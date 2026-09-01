import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { buildLiveAdminKnowledge } from "@/lib/assistant/admin-knowledge";
import {
  getAssistantHealth,
  isUsableAssistantKey,
} from "@/lib/assistant/assistant-health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const NVIDIA_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";

type AssistantProvider = {
  name: string;
  endpoint: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  reasoningBudget?: number;
};

function buildAdminAssistantProviders(): AssistantProvider[] {
  const providers: AssistantProvider[] = [];

  const groqKey = process.env.GROQ_API_KEY;
  if (isUsableAssistantKey(groqKey)) {
    providers.push({
      name: "groq",
      endpoint: GROQ_ENDPOINT,
      apiKey: groqKey,
      model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
      temperature: 0.2,
      maxTokens: 1500,
      topP: 0.9,
    });
  }

  const nvidiaKey =
    process.env.NVIDIA_API_KEY || process.env.NVIDIA_API_KEY_FALLBACK;
  if (isUsableAssistantKey(nvidiaKey)) {
    providers.push({
      name: "nvidia",
      endpoint: NVIDIA_ENDPOINT,
      apiKey: nvidiaKey,
      model: process.env.NVIDIA_MODEL || "nvidia/nemotron-3-super-120b-a12b",
      temperature: 0.2,
      maxTokens: 1500,
      topP: 0.9,
    });
  }

  return providers;
}

const requestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(3000),
    }),
  ),
  currentAdminPath: z.string().optional().default("/admin"),
});

async function callProvider(
  provider: AssistantProvider,
  systemPrompt: string,
  userMessages: Array<{ role: "user" | "assistant"; content: string }>,
): Promise<{ ok: boolean; reply?: string; detail?: string; status?: number }> {
  try {
    const body: Record<string, unknown> = {
      model: provider.model,
      messages: [
        { role: "system", content: systemPrompt },
        ...userMessages.map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: provider.temperature,
      max_tokens: provider.maxTokens,
      top_p: provider.topP,
    };

    const response = await fetch(provider.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      await response.text().catch(() => "");
      return {
        ok: false,
        status: response.status,
        detail: `http_${response.status}`,
      };
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) return { ok: false, detail: "empty reply" };

    return { ok: true, reply };
  } catch (err) {
    return {
      ok: false,
      detail: err instanceof Error ? err.message : "network error",
    };
  }
}

export async function POST(request: Request) {
  // 1. Authorize: only active staff / admin allowed
  let actor: Awaited<ReturnType<typeof requireStaffActor>>;
  try {
    actor = await requireStaffActor("access:read");
  } catch {
    return NextResponse.json(
      {
        error: "Akses ditolak. Fitur ini hanya untuk Staf & Admin Pena Ameen.",
      },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Permintaan tidak valid" },
        { status: 400 },
      );
    }

    const providers = buildAdminAssistantProviders();
    if (providers.length === 0) {
      console.error(
        "No usable AI provider for admin assistant",
        getAssistantHealth(),
      );
      return NextResponse.json(
        {
          error: "Layanan asisten AI belum dikonfigurasi.",
          code: "PROVIDER_UNAVAILABLE",
        },
        { status: 503 },
      );
    }

    const { messages, currentAdminPath } = parsed.data;

    // 2. Fetch live database snapshot
    const liveAdminKnowledge = await buildLiveAdminKnowledge();

    const systemPrompt = `Kamu adalah AMEEN (Mode Admin / Operations Copilot), asisten kecerdasan buatan operasional internal untuk staf & administrator toko Pena Ameen (penaameen.com).
Staf yang sedang berinteraksi denganmu: ${actor.email} (Role: ${actor.orgRole}).
Halaman admin saat ini yang sedang dibuka staf: ${currentAdminPath}

TUGAS DAN WEWENANGMU:
1. Membantu staf mengawasi dan menganalisis operasional toko secara realtime: pesanan masuk, pemenuhan pengiriman/resi (fulfillment), status stok dan inventori menipis, ringkasan omset & penjualan, notifikasi admin, serta log audit aktivitas.
2. Memberikan jawaban yang akurat, terstruktur, padat, berbasis data live snapshot di bawah.
3. Selalu sertakan link rujukan internal bila relevan (misal: \`[Buka Pesanan](/admin/orders)\`, \`[Cek Stok](/admin/products/stocks)\`, \`[Lihat Notifikasi](/admin/notifications)\`, \`[Fulfillment](/admin/fulfillment)\`, \`[Analytics](/admin/analytics)\`).
4. Jawab dalam Bahasa Indonesia profesional, jelas, santun, dan langsung ke intinya (gunakan poin/bullet dan angka nominal rupiah yang terformat rapi).

DATA REALTIME TOKO SAAT INI (Gunakan data ini sebagai sumber kebenaran utama):
${liveAdminKnowledge}

PANDUAN MENJAWAB:
- Jika staf tanya tentang pesanan: jelaskan jumlah pesanan yang butuh tindakan (PAID/PROCESSING), nomor pesanannya, dan nama pelanggannya.
- Jika staf tanya tentang stok: sebutkan produk mana yang stoknya kritis (<= 5 pcs) beserta sisa stoknya.
- Jika staf tanya tentang omset/keuangan: sampaikan omset hari ini, 7 hari terakhir, dan bulan ini secara gamblang.
- Jika staf tanya tentang notifikasi: ringkas notifikasi unread terpenting beserta tingkat keparahannya (CRITICAL/WARNING/INFO).
- Jika staf meminta rekomendasi tindakan operasional: berikan rekomendasi prioritas (misal: "Prioritas 1: Input resi untuk pesanan #PA-xxxx, Prioritas 2: Restock Buku Al-Barqy").`;

    const history = messages.slice(-12);

    for (const provider of providers) {
      const result = await callProvider(provider, systemPrompt, history);
      if (result.ok && result.reply) {
        return NextResponse.json({
          reply: result.reply,
          provider: provider.name,
        });
      }
      console.warn(
        `Admin assistant provider ${provider.name} failed: ${result.detail}`,
      );
    }

    return NextResponse.json(
      {
        error:
          "Asisten operasional sedang sibuk. Silakan coba lagi sebentar lagi.",
      },
      { status: 503 },
    );
  } catch (error) {
    console.error("Admin assistant route error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada asisten admin." },
      { status: 500 },
    );
  }
}
