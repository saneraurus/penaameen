"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

const STORAGE_KEY = "penaameen_admin_ameen_chat";

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Halo Staf Pena Ameen! Saya AMEEN (Mode Admin / Operations Copilot). Saya terhubung langsung ke database realtime toko. Anda bisa menanyakan status pesanan perlu dikirim, stok menipis, omset harian/bulanan, atau notifikasi operasional.",
};

const QUICK_PROMPTS = [
  "📦 Pesanan perlu diproses/dikirim",
  "⚠️ Cek stok kritis & menipis",
  "💰 Ringkasan omset & penjualan",
  "🔔 Cek notifikasi admin unread",
];

function loadHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [WELCOME_MESSAGE];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [WELCOME_MESSAGE];
    const parsed = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [WELCOME_MESSAGE];
    return parsed;
  } catch {
    return [WELCOME_MESSAGE];
  }
}

function renderMessageContent(content: string) {
  // Simple markdown link parser: [Text](url) -> <Link href="url">Text</Link>
  const parts = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }
    const label = match[1];
    const url = match[2];
    if (url?.startsWith("/")) {
      parts.push(
        <Link
          key={match.index}
          href={url}
          className="inline-flex items-center gap-1 font-semibold text-primary-700 underline underline-offset-2 hover:text-primary-900"
        >
          {label}
        </Link>,
      );
    } else {
      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-primary-700 underline underline-offset-2 hover:text-primary-900"
        >
          {label}
        </a>,
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return <span className="whitespace-pre-wrap">{parts}</span>;
}

export function AdminAmeenCopilot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);

  useEffect(() => {
    messagesRef.current = messages;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesRef.current));
    } catch {
      // storage unavailable
    }
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending, isOpen]);

  const sendMessage = useCallback(
    async (textToSend?: string) => {
      const trimmed = (textToSend ?? input).trim();
      if (!trimmed || isSending) return;

      const userMsg: ChatMessage = { role: "user", content: trimmed };
      const nextHistory = [...messagesRef.current, userMsg];

      setMessages(nextHistory);
      setInput("");
      setIsSending(true);
      setError(null);

      try {
        const res = await fetch("/api/admin/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextHistory.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            currentAdminPath: pathname,
          }),
        });

        if (!res.ok) {
          const errData = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(errData.error || `Server error (${res.status})`);
        }

        const data = (await res.json()) as { reply?: string };
        const reply = data.reply?.trim();

        if (!reply) {
          throw new Error("Respon asisten kosong");
        }

        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal terhubung ke asisten operasional.",
        );
      } finally {
        setIsSending(false);
      }
    },
    [input, isSending, pathname],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const handleClearHistory = () => {
    setMessages([WELCOME_MESSAGE]);
    setError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Tutup AMEEN Copilot" : "Buka AMEEN Ops Copilot"}
          className="group relative flex items-center gap-2.5 rounded-full bg-primary-950 px-4 py-3 text-white shadow-xl ring-2 ring-accent-400/40 transition-all duration-200 hover:scale-105 hover:bg-primary-900 active:scale-95"
        >
          <span className="relative flex h-3 w-3 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-400" />
          </span>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold tracking-wide text-white">
              AMEEN Copilot
            </span>
            <span className="text-[9px] font-semibold tracking-wider text-accent-300">
              MODE ADMIN
            </span>
          </div>
        </button>
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="AMEEN Operations Copilot"
          className="fixed bottom-22 right-4 z-50 flex h-[560px] w-[92vw] max-w-[430px] flex-col overflow-hidden rounded-2xl border border-supporting-200 bg-white shadow-2xl sm:right-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-supporting-200 bg-primary-950 px-4 py-3.5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-800 text-accent-300 shadow-inner">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white">
                    AMEEN Copilot
                  </h2>
                  <span className="rounded bg-accent-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent-300">
                    Live DB
                  </span>
                </div>
                <p className="text-[11px] text-supporting-300">
                  Operations Intelligence · Realtime
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearHistory}
                title="Bersihkan Percakapan"
                className="rounded-lg p-1.5 text-supporting-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                🗑️
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Tutup"
                className="rounded-lg p-1.5 text-supporting-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="flex gap-1.5 overflow-x-auto border-b border-supporting-100 bg-supporting-50 px-3 py-2 scrollbar-none">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void sendMessage(prompt)}
                disabled={isSending}
                className="shrink-0 rounded-full border border-supporting-200 bg-white px-2.5 py-1 text-[10px] font-medium text-supporting-700 transition-colors hover:border-primary-700 hover:text-primary-900 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto p-4 text-xs leading-relaxed scrollbar-none"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs ${
                    msg.role === "user"
                      ? "bg-primary-900 text-white rounded-br-xs"
                      : "bg-supporting-50 text-supporting-900 border border-supporting-200 rounded-bl-xs"
                  }`}
                >
                  {renderMessageContent(msg.content)}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl border border-supporting-200 bg-supporting-50 px-4 py-2.5 text-supporting-500">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-700" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-700 [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-700 [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px]">
                    Menganalisis live data...
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-center text-xs text-rose-700">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="border-t border-supporting-200 bg-white p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void sendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tanya pesanan, stok, omset, notifikasi..."
                disabled={isSending}
                className="flex-1 rounded-xl border border-supporting-300 bg-supporting-50 px-3.5 py-2 text-xs text-supporting-900 placeholder:text-supporting-400 focus:border-primary-700 focus:bg-white focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={!input.trim() || isSending}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-950 text-white transition-all hover:bg-primary-900 disabled:opacity-40"
              >
                ➤
              </button>
            </form>
            <p className="mt-1.5 text-center text-[9px] text-supporting-400">
              Live Database Connected · Groq AI Engine
            </p>
          </div>
        </div>
      )}
    </>
  );
}
