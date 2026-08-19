import { z } from "zod";

export const STOCK_MOVEMENT_TYPES = [
  "CREATED",
  "ADJUSTED",
  "STATUS",
  "DELETED",
] as const;

export type StockMovementType = (typeof STOCK_MOVEMENT_TYPES)[number];

export const stockMovementSchema = z.object({
  time: z
    .string()
    .trim()
    .default(() => new Date().toISOString()),
  sku: z.string().trim().min(1),
  name: z.string().trim().min(1),
  delta: z.number().int(),
  stockAfter: z.number().int().min(0),
  type: z.enum(STOCK_MOVEMENT_TYPES),
  reason: z.string().trim().max(500).default(""),
  by: z.string().trim().max(200).default("system"),
  source: z.string().trim().max(50).default("admin"),
});

export type StockMovementInput = z.input<typeof stockMovementSchema>;

export type StockMovement = z.output<typeof stockMovementSchema>;
