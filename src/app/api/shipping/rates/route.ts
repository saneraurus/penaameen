import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getApiSettings } from "@/lib/admin/api-settings";

const shippingRateSchema = z.object({
  addressId: z.string().min(1),
});

// TEMPORARY ASSUMPTION (SHIP-004 UNKNOWN): per-product weights are not yet
// confirmed. Until real weights exist, the cart weight basis is a documented
// assumption. The quoted rates themselves are always computed by the provider.
const ASSUMED_WEIGHT_GRAMS_PER_ITEM = 500;

interface RajaOngkirCost {
  service: string;
  description: string;
  cost: Array<{
    value: number;
    etd: string;
    note: string;
  }>;
}

interface RajaOngkirResponse {
  rajaongkir: {
    status: { code: number; description: string };
    results: Array<{
      code: string;
      name: string;
      costs: RajaOngkirCost[];
    }>;
  };
}

type CityCache = { fetchedAt: number; byName: Map<string, number> };

let cityCache: CityCache | null = null;
const CITY_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

async function loadRajaOngkirCities(apiKey: string): Promise<CityCache> {
  if (cityCache && Date.now() - cityCache.fetchedAt < CITY_CACHE_TTL_MS) {
    return cityCache;
  }

  const response = await fetch("https://api.rajaongkir.com/starter/city", {
    headers: { key: apiKey },
  });
  if (!response.ok) {
    throw new Error(`RajaOngkir city lookup failed: ${response.status}`);
  }
  const data = (await response.json()) as {
    rajaongkir?: { results?: Array<{ city_id: string; city_name: string; province: string }> };
  };

  const byName = new Map<string, number>();
  for (const city of data.rajaongkir?.results ?? []) {
    byName.set(
      `${city.city_name.toLowerCase()}|${city.province.toLowerCase()}`,
      Number(city.city_id),
    );
  }
  cityCache = { fetchedAt: Date.now(), byName };
  return cityCache;
}

async function resolveDestinationCityId(
  apiKey: string,
  city: string,
  province: string,
): Promise<number | null> {
  try {
    const cache = await loadRajaOngkirCities(apiKey);
    return (
      cache.byName.get(`${city.toLowerCase()}|${province.toLowerCase()}`) ??
      null
    );
  } catch {
    return null;
  }
}

async function getRajaOngkirRates(
  apiKey: string,
  originCityId: string,
  destinationCityId: number,
  weight: number,
  couriers: string[],
): Promise<RajaOngkirResponse | null> {
  try {
    const response = await fetch("https://api.rajaongkir.com/starter/cost", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        key: apiKey,
      },
      body: new URLSearchParams({
        origin: originCityId,
        destination: String(destinationCityId),
        weight: weight.toString(),
        courier: couriers.join(","),
      }),
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as RajaOngkirResponse;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { addressId } = shippingRateSchema.parse(body);

    const settings = getApiSettings();
    const apiKey = settings.rajaongkir.apiKey || process.env.RAJAONGKIR_API_KEY;
    const originCityId = settings.rajaongkir.originCityId;
    const enabledCouriers = settings.rajaongkir.enabledCouriers.filter(Boolean);

    if (!apiKey) {
      return NextResponse.json(
        { error: "RajaOngkir API key belum dikonfigurasi (Admin → API Access)." },
        { status: 503 },
      );
    }

    if (!originCityId) {
      return NextResponse.json(
        { error: "Kota asal pengiriman belum dikonfigurasi (Admin → API Access). Ongkir tidak dapat dihitung tanpa asal yang benar." },
        { status: 503 },
      );
    }

    if (enabledCouriers.length === 0) {
      return NextResponse.json(
        { error: "Kurir pengiriman belum dikonfigurasi (Admin → API Access)." },
        { status: 503 },
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { product: true } },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Keranjang kosong" },
        { status: 400 },
      );
    }

    const address = await prisma.address.findFirst({
      where: { id: addressId },
    });

    if (!address) {
      return NextResponse.json(
        { error: "Alamat tujuan tidak ditemukan" },
        { status: 404 },
      );
    }

    const totalWeight = cart.items.reduce(
      (sum, item) => sum + item.quantity * ASSUMED_WEIGHT_GRAMS_PER_ITEM,
      0,
    );

    const destinationCityId = await resolveDestinationCityId(
      apiKey,
      address.city,
      address.province,
    );

    if (destinationCityId === null) {
      return NextResponse.json(
        { error: "Kota tujuan tidak ditemukan pada data RajaOngkir. Periksa nama kota/provinsi alamat." },
        { status: 503 },
      );
    }

    const ratesResponse = await getRajaOngkirRates(
      apiKey,
      originCityId,
      destinationCityId,
      totalWeight,
      enabledCouriers,
    );

    if (!ratesResponse?.rajaongkir?.results) {
      return NextResponse.json(
        { error: "Layanan ongkir tidak merespons. Tidak ada tarif inventif yang digunakan; coba lagi nanti." },
        { status: 503 },
      );
    }

    const formattedRates = ratesResponse.rajaongkir.results.flatMap(
      (courier) =>
        courier.costs.flatMap((cost) =>
          cost.cost.map((c) => ({
            courier: courier.code,
            courierName: courier.name,
            service: cost.service,
            description: cost.description,
            cost: c.value,
            etd: c.etd,
            note: c.note,
          })),
        ),
    );

    if (formattedRates.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada tarif tersedia untuk kombinasi asal-tujuan ini." },
        { status: 503 },
      );
    }

    return NextResponse.json({ rates: formattedRates });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error in shipping rates API:", error);
    return NextResponse.json(
      { error: "Gagal menghitung ongkir. Tidak ada tarif inventif yang digunakan." },
      { status: 503 },
    );
  }
}