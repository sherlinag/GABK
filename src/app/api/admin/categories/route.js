import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { readJson, success, withApi } from "@/lib/api";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100),
  description: z.string().trim().max(500).default(""),
  imageUrl: z.union([z.url().max(2048), z.literal("")]).default(""),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true)
});

export const POST = withApi(async (request) => {
  await connectToDatabase();
  await requireAdmin(request);
  return success({ category: await Category.create(schema.parse(await readJson(request))) }, 201);
});
