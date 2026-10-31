import mongoose from "mongoose";
import { ApiError } from "@/lib/api";
import Order from "@/models/Order";
import Product from "@/models/Product";

const transitions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["ready_for_pickup", "out_for_delivery", "cancelled"],
  ready_for_pickup: ["delivered", "cancelled"],
  out_for_delivery: ["delivered", "cancelled"],
  delivered: [],
  cancelled: []
};

export async function createOrder(customerId, input) {
  const session = await mongoose.startSession();
  let created;
  try {
    await session.withTransaction(async () => {
      const ids = input.items.map((item) => item.productId);
      if (new Set(ids).size !== ids.length) {
        throw new ApiError(400, "Each product may only appear once.", "DUPLICATE_ORDER_ITEM");
      }
      const products = await Product.find({
        _id: { $in: ids },
        isAvailable: true,
        isDemo: { $ne: true }
      }).session(session);
      if (products.length !== ids.length) {
        throw new ApiError(400, "One or more products are unavailable.", "PRODUCT_UNAVAILABLE");
      }
      const byId = new Map(products.map((product) => [product.id, product]));
      let subtotalPaise = 0;
      const items = input.items.map(({ productId, quantity }) => {
        const product = byId.get(productId);
        const unitPricePaise = product.discountPricePaise ?? product.pricePaise;
        const lineTotalPaise = unitPricePaise * quantity;
        if (!Number.isSafeInteger(lineTotalPaise)) {
          throw new ApiError(400, "Order total is outside the supported range.", "INVALID_TOTAL");
        }
        subtotalPaise += lineTotalPaise;
        return {
          product: product._id,
          name: product.name,
          quantity,
          unitPricePaise,
          lineTotalPaise
        };
      });

      for (const { productId, quantity } of input.items) {
        const reserved = await Product.findOneAndUpdate(
          { _id: productId, isAvailable: true, stock: { $gte: quantity } },
          { $inc: { stock: -quantity } },
          { new: true, session }
        );
        if (!reserved) {
          throw new ApiError(409, "A product has insufficient stock. Refresh the catalog and retry.", "INSUFFICIENT_STOCK");
        }
      }

      const deliveryFeePaise = input.fulfillment === "delivery" ? input.deliveryFeePaise : 0;
      const orderNumber = `GA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      [created] = await Order.create([{
        orderNumber,
        customer: customerId,
        items,
        subtotalPaise,
        deliveryFeePaise,
        totalPaise: subtotalPaise + deliveryFeePaise,
        fulfillment: input.fulfillment,
        address: input.fulfillment === "delivery" ? input.address : {},
        notes: input.notes,
        paymentMethod: "cod",
        status: "pending",
        statusHistory: [{ status: "pending", note: "Order placed" }]
      }], { session });
    });
  } finally {
    await session.endSession();
  }
  return created;
}

export async function changeOrderStatus(orderId, status, note = "") {
  const session = await mongoose.startSession();
  let updated;
  try {
    await session.withTransaction(async () => {
      const order = await Order.findById(orderId).session(session);
      if (!order) throw new ApiError(404, "Order not found.", "ORDER_NOT_FOUND");
      if (!transitions[order.status].includes(status)) {
        throw new ApiError(409, `Cannot change order status from ${order.status} to ${status}.`, "INVALID_STATUS_TRANSITION");
      }
      if (status === "cancelled" && !order.stockRestored) {
        for (const item of order.items) {
          await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } }, { session });
        }
        order.stockRestored = true;
      }
      order.status = status;
      order.statusHistory.push({ status, note });
      await order.save({ session });
      updated = order;
    });
  } finally {
    await session.endSession();
  }
  return updated;
}
