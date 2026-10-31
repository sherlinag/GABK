import mongoose from "mongoose";

const orderStatuses = [
  "pending", "confirmed", "preparing", "ready_for_pickup",
  "out_for_delivery", "delivered", "cancelled"
];

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPricePaise: { type: Number, required: true, min: 1 },
  lineTotalPaise: { type: Number, required: true, min: 1 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  items: { type: [orderItemSchema], required: true },
  subtotalPaise: { type: Number, required: true, min: 0 },
  deliveryFeePaise: { type: Number, required: true, min: 0 },
  totalPaise: { type: Number, required: true, min: 0 },
  fulfillment: { type: String, enum: ["delivery", "pickup"], required: true },
  address: {
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    line1: { type: String, default: "" },
    line2: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" }
  },
  notes: { type: String, trim: true, maxlength: 500, default: "" },
  paymentMethod: { type: String, enum: ["cod"], default: "cod" },
  paymentStatus: { type: String, enum: ["pending", "paid", "refunded"], default: "pending" },
  status: { type: String, enum: orderStatuses, default: "pending", index: true },
  statusHistory: {
    type: [{
      status: { type: String, enum: orderStatuses, required: true },
      changedAt: { type: Date, default: Date.now },
      note: { type: String, trim: true, maxlength: 300, default: "" }
    }],
    default: []
  },
  stockRestored: { type: Boolean, default: false }
}, { timestamps: true });

orderSchema.index({ customer: 1, createdAt: -1 });
export default mongoose.models.Order || mongoose.model("Order", orderSchema);
