import { z } from "zod";
import { ApiError, success, withApi } from "@/lib/api";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

const querySchema = z.object({
  search: z.string().trim().max(100).optional(),
  category: z.string().optional(),
  featured: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  sort: z.enum(["newest", "price_asc", "price_desc"]).default("newest")
});

export const GET = withApi(async (request) => {
  await connectToDatabase();
  const query = querySchema.parse(Object.fromEntries(new URL(request.url).searchParams));
  const filter = { isAvailable: true, stock: { $gt: 0 } };
  if (query.category) {
    if (!/^[a-f\d]{24}$/i.test(query.category)) {
      throw new ApiError(400, "category must be a valid category ID.", "INVALID_CATEGORY");
    }
    filter.category = query.category;
  }
  if (query.featured === "true") filter.isFeatured = true;
  if (query.search) filter.$text = { $search: query.search };
  const sort = {
    newest: { createdAt: -1 },
    price_asc: { pricePaise: 1 },
    price_desc: { pricePaise: -1 }
  }[query.sort];

  const [products, total] = await Promise.all([
    Product.find(filter).populate("category", "name slug").sort(sort)
      .skip((query.page - 1) * query.limit).limit(query.limit).lean(),
    Product.countDocuments(filter)
  ]);
  return success({
    products,
    pagination: { page: query.page, limit: query.limit, total, pages: Math.ceil(total / query.limit) }
  });
});
