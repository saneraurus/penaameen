import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const shippingRateSchema = z.object({
  addressId: z.string().min(1),
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

async function getRajaOngkirRates(originPostalCode: string, destinationPostalCode: string, weight: number): Promise<RajaOngkirResponse | null> {
  const apiKey = process.env.RAJAONGKIR_API_KEY;
  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch("https://api.rajaongkir.com/starter/cost", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        key: apiKey,
      },
      body: new URLSearchParams({
        origin: originPostalCode,
        destination: destinationPostalCode,
        weight: weight.toString(),
        courier: "jne,jnt,sicepat",
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

const DEFAULT_COURIER_RATES = [
  {
    courier: "jne",
    courierName: "JNE",
    service: "REG",
    description: "Layanan Reguler",
    cost: 18000,
    etd: "2-3",
    note: "Paling Populer",
  },
  {
    courier: "jnt",
    courierName: "J&T Express",
    service: "EZ",
    description: "Pengiriman Cepat Reguler",
    cost: 19000,
    etd: "2-3",
    note: "Tracking Real-time",
  },
  {
    courier: "sicepat",
    courierName: "SiCepat",
    service: "REG",
    description: "SiCepat Reguler",
    cost: 17000,
    etd: "1-2",
    note: "Cepat & Hemat",
  },
  {
    courier: "pos",
    courierName: "POS Indonesia",
    service: "KILAT",
    description: "Pos Kilat Khusus",
    cost: 15000,
    etd: "3-4",
    note: "Jangkauan Luas ke Seluruh Indonesia",
  },
];

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { addressId } = shippingRateSchema.parse(body);

    let addressPostalCode = "12345";
    let totalWeight = 1000;

    try {
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      if (cart && cart.items.length > 0) {
        totalWeight = cart.items.reduce((sum, item) => sum + item.quantity * 500, 0);
      }

      const address = await prisma.address.findFirst({
        where: { id: addressId },
      });

      if (address) {
        addressPostalCode = address.postalCode;
      }
    } catch {
      // Ignore DB errors and use defaults
    }

    const originPostalCode = "60293"; // Surabaya / HQ warehouse postal code

    const rates = await getRajaOngkirRates(originPostalCode, addressPostalCode, totalWeight);

    if (rates && rates.rajaongkir?.results) {
      const formattedRates = rates.rajaongkir.results.flatMap((courier) =>
        courier.costs.flatMap((cost) =>
          cost.cost.map((c) => ({
            courier: courier.code,
            courierName: courier.name,
            service: cost.service,
            description: cost.description,
            cost: c.value,
            etd: c.etd,
            note: c.note,
          }))
        )
      );

      if (formattedRates.length > 0) {
        return NextResponse.json({ rates: formattedRates });
      }
    }

    // Fallback to standard Indonesian courier rates based on weight
    const weightMultiplier = Math.max(1, Math.ceil(totalWeight / 1000));
    const calculatedDefaultRates = DEFAULT_COURIER_RATES.map((rate) => ({
      ...rate,
      cost: rate.cost * weightMultiplier,
    }));

    return NextResponse.json({ rates: calculatedDefaultRates });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error in shipping rates API, falling back:", error);
    return NextResponse.json({ rates: DEFAULT_COURIER_RATES });
  }
}
