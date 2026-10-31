import { success, withApi } from "@/lib/api";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";

export const GET = withApi(async () => {
  await connectToDatabase();
  const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 }).lean();
  return success({ categories });
});
