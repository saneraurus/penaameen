import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getApiSettings } from "@/lib/admin/api-settings";

const shippingRateSchema = z.object({
  addressId: z.string().optional(),
  destination: z
    .object({
      city: z.string().optional(),
      province: z.string().optional(),
      postalCode: z.string().optional(),
    })
    .optional(),
  weight: z.number().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().optional(),
        quantity: z.number().optional(),
      }),
    )
    .optional(),
});

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
    rajaongkir?: {
      results?: Array<{ city_id: string; city_name: string; province: string }>;
    };
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
    const body = await request.json();
    const parsed = shippingRateSchema.parse(body);

    let destinationCity = parsed.destination?.city || "";
    let destinationProvince = parsed.destination?.province || "";

    // 1. Resolve address destination if addressId was provided
    if (parsed.addressId) {
      try {
        const address = await prisma.address.findFirst({
          where: { id: parsed.addressId },
        });
        if (address) {
          destinationCity = destinationCity || address.city;
          destinationProvince = destinationProvince || address.province;
        }
      } catch {
        // Ignore DB lookup error
      }
    }

    if (!destinationCity || !destinationProvince) {
      return NextResponse.json(
        {
          error: "Kota dan provinsi tujuan wajib diisi untuk menghitung ongkir",
        },
        { status: 400 },
      );
    }

    // 2. Compute total weight from cart or items
    const totalWeight = parsed.weight || 0;

    if (totalWeight <= 0) {
      return NextResponse.json(
        { error: "Berat pesanan wajib tersedia untuk menghitung ongkir" },
        { status: 400 },
      );
    }

    // 3. Check Live RajaOngkir API Configuration
    let apiKey = process.env.RAJAONGKIR_API_KEY || "";
    let originCityId = "444"; // 444 = Surabaya
    let enabledCouriers = ["jne", "jnt", "pos", "sicepat"];
    try {
      const settings = getApiSettings();
      apiKey = settings.rajaongkir?.apiKey || apiKey;
      originCityId = settings.rajaongkir?.originCityId || originCityId;
      if (
        settings.rajaongkir?.enabledCouriers &&
        settings.rajaongkir.enabledCouriers.length > 0
      ) {
        enabledCouriers = settings.rajaongkir.enabledCouriers.filter(Boolean);
      }
    } catch {
      // Ignore settings file error
    }

    if (!apiKey || apiKey.length <= 10) {
      return NextResponse.json(
        { error: "Provider ongkir belum dikonfigurasi" },
        { status: 503 },
      );
    }

    try {
      const destinationCityId = await resolveDestinationCityId(
        apiKey,
        destinationCity,
        destinationProvince,
      );

      if (destinationCityId === null) {
        return NextResponse.json(
          { error: "Kota tujuan tidak ditemukan pada provider ongkir" },
          { status: 422 },
        );
      }

      const ratesResponse = await getRajaOngkirRates(
        apiKey,
        originCityId,
        destinationCityId,
        totalWeight,
        enabledCouriers,
      );

      if (
        ratesResponse?.rajaongkir?.results &&
        ratesResponse.rajaongkir.results.length > 0
      ) {
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
                note: c.note || "",
              })),
            ),
        );

        if (formattedRates.length > 0) {
          return NextResponse.json({
            rates: formattedRates,
            origin: "Surabaya, Jawa Timur",
            weightGrams: totalWeight,
            provider: "rajaongkir",
          });
        }
      }
      return NextResponse.json(
        {
          error: "Provider ongkir tidak mengembalikan layanan untuk tujuan ini",
        },
        { status: 502 },
      );
    } catch (err) {
      console.warn("[Shipping API] Live RajaOngkir query failed:", err);
      return NextResponse.json(
        { error: "Gagal menghitung ongkir dari provider" },
        { status: 502 },
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error(
      "SHIPPING_RATE_ERROR:",
      error instanceof Error ? error.stack : error,
    );

    return NextResponse.json(
      {
        error: "Gagal menghitung ongkir dari provider",
      },
      { status: 502 },
    );
  }
}
