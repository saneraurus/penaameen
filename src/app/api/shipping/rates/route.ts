import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { resolveFlatShippingRate } from "@/data/shipping-flat";

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = shippingRateSchema.parse(body);

    let destinationCity = parsed.destination?.city || "";
    let destinationProvince = parsed.destination?.province || "";

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
        // ignore DB error
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

    const flatRate = resolveFlatShippingRate(
      destinationCity,
      destinationProvince,
    );

    return NextResponse.json({
      rates: [flatRate],
      origin: "Surabaya, Jawa Timur",
      weightGrams: parsed.weight || 0,
      estimatedWeight: true,
      provider: "flat",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error(
      "SHIPPING_RATE_ERROR:",
      error instanceof Error ? error.stack : error,
    );

    return NextResponse.json(
      { error: "Gagal menghitung ongkir dari provider" },
      { status: 502 },
    );
  }
}
