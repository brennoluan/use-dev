import qs from "qs";
import {
  ProductSearchParamsSchema,
  type ProductSearchParams,
} from "../types/search";

export function parseSearchParams(
  searchParams: URLSearchParams,
): Partial<ProductSearchParams> {
  const rawParams = qs.parse(searchParams.toString(), {
    ignoreQueryPrefix: true,
  });

  const result = ProductSearchParamsSchema.safeParse(rawParams);

  if (!result.success) {
    return {};
  }

  const cleanedData = Object.fromEntries(
    Object.entries(result.data).filter(([, value]) => value !== undefined),
  ) as ProductSearchParams;

  return cleanedData;
}

export function serializeSearchParams(filters: Partial<ProductSearchParams>) {
  return qs.stringify(filters, {
    skipNulls: true,
    encode: false,
  });
}
