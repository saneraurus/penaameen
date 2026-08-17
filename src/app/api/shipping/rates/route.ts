import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const shippingRateSchema = z.object({
  addressId: z.string().cuid(),
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
    origin_details: { city_id: string; province_id: string; province: string; type: string; city_name: string; postal_code: string };
    destination_details: { city_id: string; province_id: string; province: string; type: string; city_name: string; postal_code: string };
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
    console.warn("RAJAONGKIR_API_KEY not configured");
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
      console.error("RajaOngkir API error:", response.statusText);
      return null;
    }

    return (await response.json()) as RajaOngkirResponse;
  } catch (error) {
    console.error("Error fetching RajaOngkir rates:", error);
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

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const totalWeight = cart.items.reduce((sum, item) => {
      return sum + item.quantity * 500; // Assume 500g per item
    }, 0);

    const originPostalCode = "12345"; // Warehouse postal code - should be configurable

    const rates = await getRajaOngkirRates(originPostalCode, address.postalCode, totalWeight);

    if (!rates) {
      return NextResponse.json(
        { error: "Unable to fetch shipping rates. Please try again." },
        { status: 503 }
      );
    }

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

    return NextResponse.json({ rates: formattedRates });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error fetching shipping rates:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
