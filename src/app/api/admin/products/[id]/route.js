import mongoose from "mongoose";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { ApiError, readJson, success, withApi } from "@/lib/api";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";

const schema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(140).optional(),
  description: z.string().trim().max(2000).optional(),
  category: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  pricePaise: z.number().int().positive().optional(),
  discountPricePaise: z.number().int().positive().nullable().optional(),
  images: z.array(z.url().max(2048)).max(8).optional(),
  stock: z.number().int().min(0).optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isDemo: z.boolean().optional()
}).strict();

export const PATCH = withApi(async (request, context) => {
  await connectToDatabase();
  await requireAdmin(request);
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid product ID.", "INVALID_ID");
  const input = schema.parse(await readJson(request));
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found.", "PRODUCT_NOT_FOUND");
  if (input.isDemo === false && (!Number.isInteger(input.pricePaise) || !Number.isInteger(input.stock))) {
    throw new ApiError(
      400,
      "Set a verified price and stock in the same update before publishing a sample product.",
      "VERIFIED_PRODUCT_DETAILS_REQUIRED"
    );
  }
  const price = input.pricePaise ?? product.pricePaise;
  const discount = Object.hasOwn(input, "discountPricePaise")
    ? input.discountPricePaise
    : product.discountPricePaise;
  if (discount != null && discount >= price) {
    throw new ApiError(400, "Discounted price must be lower than regular price.", "INVALID_DISCOUNT");
  }
  if (input.category && !(await Category.exists({ _id: input.category }))) {
    throw new ApiError(400, "The selected category does not exist.", "INVALID_CATEGORY");
  }
  Object.assign(product, input);
  await product.save();
  return success({ product });
});

export const DELETE = withApi(async (request, context) => {
  await connectToDatabase();
  await requireAdmin(request);
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid product ID.", "INVALID_ID");
  const product = await Product.findByIdAndUpdate(id, { $set: { isAvailable: false, stock: 0 } }, { new: true });
  if (!product) throw new ApiError(404, "Product not found.", "PRODUCT_NOT_FOUND");
  return success({ product });
});
