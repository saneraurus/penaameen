import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

type ClerkUserEventData = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email_addresses?: Array<{ email_address?: string | null }>;
  phone_numbers?: Array<{ phone_number?: string | null }>;
};

export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("CLERK_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Server not configured" },
        { status: 500 },
      );
    }

    const payload = await request.text();
    const headers = Object.fromEntries(request.headers.entries());

    const svixId = headers["svix-id"];
    const svixTimestamp = headers["svix-timestamp"];
    const svixSignature = headers["svix-signature"];

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json(
        { error: "Missing svix headers" },
        { status: 400 },
      );
    }

    const wh = new Webhook(webhookSecret);
    let evt: { type: string; data: ClerkUserEventData };

    try {
      evt = wh.verify(payload, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as { type: string; data: ClerkUserEventData };
    } catch (err) {
      console.error("Error verifying Clerk webhook:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const { type, data } = evt;

    switch (type) {
      case "user.created": {
        await prisma.user.create({
          data: {
            clerkId: data.id,
            email: data.email_addresses?.[0]?.email_address ?? "",
            name:
              `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || null,
            phone: data.phone_numbers?.[0]?.phone_number ?? null,
          },
        });
        console.log("User created:", data.id);
        break;
      }
      case "user.updated": {
        await prisma.user.update({
          where: { clerkId: data.id },
          data: {
            email: data.email_addresses?.[0]?.email_address ?? "",
            name:
              `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || null,
            phone: data.phone_numbers?.[0]?.phone_number ?? null,
          },
        });
        console.log("User updated:", data.id);
        break;
      }
      case "user.deleted": {
        await prisma.user.delete({
          where: { clerkId: data.id },
        });
        console.log("User deleted:", data.id);
        break;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing Clerk webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
