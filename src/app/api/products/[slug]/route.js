import { ApiError, success, withApi } from "@/lib/api";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

export const GET = withApi(async (_request, context) => {
  await connectToDatabase();
  const { slug } = await context.params;
  const product = await Product.findOne({ slug, isAvailable: true })
    .populate("category", "name slug").lean();
  if (!product) throw new ApiError(404, "Product not found.", "PRODUCT_NOT_FOUND");
  return success({ product });
});
