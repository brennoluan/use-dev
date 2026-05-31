import z from "zod";

const SortFieldSchema = z
  .enum(["price", "label", "id"])
  .optional()
  .catch(undefined);
const SortOrderSchema = z.enum(["asc", "desc"]).optional().catch("asc");

export const ProductSearchParamsSchema = z.object({
  price_gte: z.coerce.number().min(0).max(1000).optional().catch(undefined),
  price_lte: z.coerce.number().min(0).max(1000).optional().catch(undefined),
  _sort: SortFieldSchema,
  _order: SortOrderSchema,
});

export type ProductSearchParams = z.infer<typeof ProductSearchParamsSchema>;
