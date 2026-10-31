import mongoose from "mongoose";
import Category from "../src/models/Category.js";
import Order from "../src/models/Order.js";
import Product from "../src/models/Product.js";
import User from "../src/models/User.js";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required.");

const categories = [
  "Traditional Sweets",
  "Cakes",
  "Pastries",
  "Puffs",
  "Rolls",
  "Cookies",
  "Bread",
  "Savoury Snacks",
  "Cupcakes",
  "Special Items"
];

await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
try {
  const models = [User, Category, Product, Order];
  for (const model of models) {
    const collectionName = model.collection.collectionName;
    const exists = await mongoose.connection.db
      .listCollections({ name: collectionName }, { nameOnly: true })
      .hasNext();
    if (!exists) await mongoose.connection.db.createCollection(collectionName);
    await model.createIndexes();
  }

  for (const [displayOrder, name] of categories.entries()) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    await Category.updateOne(
      { slug },
      { $setOnInsert: { name, slug, displayOrder, isActive: true } },
      { upsert: true }
    );
  }
  console.log(`Database initialized: ${mongoose.connection.name}; collections: ${models.length}; categories: ${categories.length}.`);
} finally {
  await mongoose.disconnect();
}
