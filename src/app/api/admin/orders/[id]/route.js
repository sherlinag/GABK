import mongoose from "mongoose";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { ApiError, readJson, success, withApi } from "@/lib/api";
import connectToDatabase from "@/lib/mongodb";
import { changeOrderStatus } from "@/lib/order-service";

const schema = z.object({
  status: z.enum(["confirmed", "preparing", "ready_for_pickup", "out_for_delivery", "delivered", "cancelled"]),
  note: z.string().trim().max(300).default("")
});

export const PATCH = withApi(async (request, context) => {
  await connectToDatabase();
  await requireAdmin(request);
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid order ID.", "INVALID_ID");
  const input = schema.parse(await readJson(request));
  return success({ order: await changeOrderStatus(id, input.status, input.note) });
});
