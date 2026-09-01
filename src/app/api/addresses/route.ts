import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUserId, withRLSContext } from "@/middleware/rls-context";

const addressSchema = z.object({
  label: z.string().min(1).max(50),
  recipientName: z.string().min(1).max(100),
  phone: z.string().min(10).max(20),
  addressLine1: z.string().min(1).max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(1).max(100),
  province: z.string().min(1).max(100),
  postalCode: z.string().min(5).max(10),
  country: z.string().default("Indonesia"),
  isDefault: z.boolean().default(false),
});

export async function GET() {
  return withRLSContext(async (context, tx) => {
    if (context.actorKind !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const addresses = await tx.address.findMany({
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      });

      return NextResponse.json({ addresses });
    } catch (error) {
      console.error("Error fetching addresses:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  });
}

export async function POST(request: Request) {
  return withRLSContext(async (context, tx) => {
    if (context.actorKind !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const body = await request.json();
      const data = addressSchema.parse(body);
      const userId = await getCurrentUserId(tx);
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (data.isDefault) {
        await tx.address.updateMany({
          where: { isDefault: true },
          data: { isDefault: false },
        });
      }

      const address = await tx.address.create({
        data: {
          userId,
          label: data.label,
          recipientName: data.recipientName,
          phone: data.phone,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2 ?? null,
          city: data.city,
          province: data.province,
          postalCode: data.postalCode,
          country: data.country,
          isDefault: data.isDefault,
        },
      });

      return NextResponse.json({ address }, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.issues }, { status: 400 });
      }
      console.error("Error creating address:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  });
}
