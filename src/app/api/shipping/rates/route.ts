import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { resolveFlatShippingRate } from "@/data/shipping-flat";
import { getApiSettings } from "@/lib/admin/api-settings";
import {
  getRajaOngkirCosts,
  resolveDestinationCityId,
} from "@/lib/shipping/rajaongkir";

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

function sumItemWeight(
  items: ReadonlyArray<{ quantity?: number | undefined }> | undefined,
): number {
  if (!items || items.length === 0) return 0;
  return (
    items.reduce(
      (acc, it) => acc + (typeof it.quantity === "number" ? it.quantity : 0),
      0,
    ) * 1000
  ); // assume 1kg per item as a baseline if product weights aren't joined
}

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
          error:
            "Kota dan provinsi tujuan wajib diisi untuk menghitung ongkir",
        },
        { status: 400 },
      );
    }

    // Flat rate fallback (always computed so the client always has an option)
    const flatRate = resolveFlatShippingRate(
      destinationCity,
      destinationProvince,
    );

    const weightFromItems = sumItemWeight(parsed.items);
    const weight = parsed.weight || weightFromItems || 1000;

    // Try RajaOngkir first if configured
    try {
      const settings = getApiSettings();
      const cfg = settings.rajaongkir;
      if (
        cfg.apiKey &&
        cfg.originCityId &&
        cfg.enabledCouriers &&
        cfg.enabledCouriers.length > 0
      ) {
        const destId = resolveDestinationCityId(destinationCity);
        if (destId) {
          const costs = await getRajaOngkirCosts({
            config: {
              apiKey: cfg.apiKey,
              tier: cfg.tier,
              originCityId: cfg.originCityId,
              originCityName: cfg.originCityName,
              enabledCouriers: cfg.enabledCouriers,
            },
            destinationCityId: destId,
            weightGrams: weight,
          });

          if (costs.length > 0) {
            return NextResponse.json({
              rates: costs.map((c) => ({
                label: c.service,
                service: c.service,
                description: c.description,
                cost: c.cost,
                etd: c.etd,
                courier: c.courier,
              })),
              origin: cfg.originCityName || "Surabaya",
              originCityId: cfg.originCityId,
              destinationCity,
              weightGrams: weight,
              provider: "rajaongkir",
            });
          }
        }
      }
    } catch (e) {
      console.warn(
        "[Shipping] RajaOngkir lookup failed, falling back to flat rate:",
        e instanceof Error ? e.message : e,
      );
    }

    return NextResponse.json({
      rates: [flatRate],
      origin: "Surabaya, Jawa Timur",
      weightGrams: weight,
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
