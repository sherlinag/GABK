import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { ApiError, readJson, success, withApi } from "@/lib/api";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(140),
  description: z.string().trim().max(2000).default(""),
  category: z.string().regex(/^[a-f\d]{24}$/i),
  pricePaise: z.number().int().positive(),
  discountPricePaise: z.number().int().positive().nullable().optional(),
  images: z.array(z.url().max(2048)).max(8).default([]),
  stock: z.number().int().min(0),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isDemo: z.boolean().default(false)
}).refine(
  (value) => value.discountPricePaise == null || value.discountPricePaise < value.pricePaise,
  { path: ["discountPricePaise"], message: "Discounted price must be lower than regular price." }
);

export const GET = withApi(async (request) => {
  await connectToDatabase();
  await requireAdmin(request);
  const products = await Product.find().populate("category", "name slug").sort({ createdAt: -1 }).lean();
  return success({ products });
});

export const POST = withApi(async (request) => {
  await connectToDatabase();
  await requireAdmin(request);
  const input = schema.parse(await readJson(request));
  if (!(await Category.exists({ _id: input.category }))) {
    throw new ApiError(400, "The selected category does not exist.", "INVALID_CATEGORY");
  }
  return success({ product: await Product.create(input) }, 201);
});
