import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { readJson, success, withApi } from "@/lib/api";
import connectToDatabase from "@/lib/mongodb";
import { createOrder } from "@/lib/order-service";
import Order from "@/models/Order";

const addressSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20),
  line1: z.string().trim().min(3).max(200),
  line2: z.string().trim().max(200).default(""),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  pincode: z.string().trim().regex(/^\d{6}$/)
});

const createSchema = z.object({
  items: z.array(z.object({
    productId: z.string().regex(/^[a-f\d]{24}$/i),
    quantity: z.number().int().min(1).max(20)
  })).min(1).max(30),
  fulfillment: z.enum(["delivery", "pickup"]),
  address: addressSchema.optional(),
  notes: z.string().trim().max(500).default("")
}).refine(
  (input) => input.fulfillment !== "delivery" || Boolean(input.address),
  { path: ["address"], message: "A delivery address is required." }
);

export const GET = withApi(async (request) => {
  await connectToDatabase();
  const user = await requireUser(request);
  const orders = await Order.find({ customer: user._id }).sort({ createdAt: -1 }).lean();
  return success({ orders });
});

export const POST = withApi(async (request) => {
  await connectToDatabase();
  const user = await requireUser(request);
  const input = createSchema.parse(await readJson(request));
  const order = await createOrder(user._id, { ...input, deliveryFeePaise: 0 });
  return success({ order }, 201);
});
