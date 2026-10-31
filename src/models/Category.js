import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, trim: true, maxlength: 500, default: "" },
  imageUrl: { type: String, trim: true, default: "" },
  displayOrder: { type: Number, min: 0, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model("Category", categorySchema);
