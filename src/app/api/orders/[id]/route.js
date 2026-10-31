import mongoose from "mongoose";
import { requireUser } from "@/lib/auth";
import { ApiError, success, withApi } from "@/lib/api";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";

export const GET = withApi(async (request, context) => {
  await connectToDatabase();
  const user = await requireUser(request);
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid order ID.", "INVALID_ID");
  const order = await Order.findOne({ _id: id, customer: user._id }).lean();
  if (!order) throw new ApiError(404, "Order not found.", "ORDER_NOT_FOUND");
  return success({ order });
});
