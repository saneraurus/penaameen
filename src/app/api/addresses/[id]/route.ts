import { NextResponse } from "next/server";
import { z } from "zod";
import { withRLSContext } from "@/middleware/rls-context";

const updateAddressSchema = z.object({
  label: z.string().min(1).max(50).optional(),
  recipientName: z.string().min(1).max(100).optional(),
  phone: z.string().min(10).max(20).optional(),
  addressLine1: z.string().min(1).max(200).optional(),
  addressLine2: z.string().max(200).optional().nullable(),
  city: z.string().min(1).max(100).optional(),
  province: z.string().min(1).max(100).optional(),
  postalCode: z.string().min(5).max(10).optional(),
  country: z.string().default("Indonesia").optional(),
  isDefault: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return withRLSContext(async (context, tx) => {
    if (context.actorKind !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const { id } = await params;
      const body = await request.json();
      const data = updateAddressSchema.parse(body);

      const address = await tx.address.findUnique({
        where: { id },
      });

      if (!address) {
        return NextResponse.json(
          { error: "Address not found" },
          { status: 404 },
        );
      }

      if (data.isDefault) {
        await tx.address.updateMany({
          where: { isDefault: true },
          data: { isDefault: false },
        });
      }

      const updated = await tx.address.update({
        where: { id },
        data: data as Record<string, unknown>,
      });

      return NextResponse.json({ address: updated });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.issues }, { status: 400 });
      }
      console.error("Error updating address:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return withRLSContext(async (context, tx) => {
    if (context.actorKind !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const { id } = await params;

      const address = await tx.address.findUnique({
        where: { id },
      });

      if (!address) {
        return NextResponse.json(
          { error: "Address not found" },
          { status: 404 },
        );
      }

      await tx.address.delete({ where: { id } });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting address:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  });
}
