import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { success, withApi } from "@/lib/api";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";

const schema = z.object({
  status: z.enum(["pending", "confirmed", "preparing", "ready_for_pickup", "out_for_delivery", "delivered", "cancelled"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25)
});

export const GET = withApi(async (request) => {
  await connectToDatabase();
  await requireAdmin(request);
  const query = schema.parse(Object.fromEntries(new URL(request.url).searchParams));
  const filter = query.status ? { status: query.status } : {};
  const [orders, total] = await Promise.all([
    Order.find(filter).populate("customer", "name email phone").sort({ createdAt: -1 })
      .skip((query.page - 1) * query.limit).limit(query.limit).lean(),
    Order.countDocuments(filter)
  ]);
  return success({
    orders,
    pagination: { page: query.page, limit: query.limit, total, pages: Math.ceil(total / query.limit) }
  });
});
