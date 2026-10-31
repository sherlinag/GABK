import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, trim: true, maxlength: 2000, default: "" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  pricePaise: { type: Number, required: true, min: 1 },
  discountPricePaise: { type: Number, min: 1, default: null },
  images: { type: [String], default: [] },
  stock: { type: Number, required: true, min: 0, default: 0 },
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isDemo: { type: Boolean, default: false }
}, { timestamps: true });

productSchema.index({ category: 1, isAvailable: 1 });
productSchema.index({ name: "text", description: "text" });
export default mongoose.models.Product || mongoose.model("Product", productSchema);
