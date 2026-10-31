import mongoose from "mongoose";
import Category from "../src/models/Category.js";
import Product from "../src/models/Product.js";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required.");

const demoProducts = [
  {
    name: "Nagercoil-Style Banana Chips",
    slug: "sample-nagercoil-banana-chips",
    categorySlug: "savoury-snacks",
    pricePaise: 12000,
    stock: 20,
    description: "Sample listing inspired by a Kanyakumari favourite. Confirm actual price and availability with the bakery."
  },
  {
    name: "Tapioca Chips",
    slug: "sample-tapioca-chips",
    categorySlug: "savoury-snacks",
    pricePaise: 10000,
    stock: 20,
    description: "Sample listing inspired by a local-style crunchy snack. Confirm actual price and availability with the bakery."
  },
  {
    name: "South Tamil Nadu Mixture",
    slug: "sample-south-tamil-nadu-mixture",
    categorySlug: "savoury-snacks",
    pricePaise: 9000,
    stock: 20,
    description: "Illustrative regional mixture listing. Ingredients, actual price and availability must be confirmed."
  },
  {
    name: "Handmade Kai Murukku",
    slug: "sample-kai-murukku",
    categorySlug: "savoury-snacks",
    pricePaise: 15000,
    stock: 20,
    description: "Sample listing for a traditional handmade murukku. Confirm actual price and availability with the bakery."
  },
  {
    name: "Crispy Thattai",
    slug: "sample-thattai",
    categorySlug: "savoury-snacks",
    pricePaise: 10000,
    stock: 20,
    description: "Illustrative savoury snack listing. Confirm ingredients, price and availability with the bakery."
  },
  {
    name: "Ribbon Pakoda",
    slug: "sample-ribbon-pakoda",
    categorySlug: "savoury-snacks",
    pricePaise: 10000,
    stock: 20,
    description: "Sample listing inspired by a South Indian bakery snack. Confirm actual price and availability."
  },
  {
    name: "Traditional Adhirasam",
    slug: "sample-adhirasam",
    categorySlug: "traditional-sweets",
    pricePaise: 15000,
    stock: 20,
    description: "Sample traditional sweet listing. Recipe, actual price and availability must be confirmed with the bakery."
  },
  {
    name: "Mysore Pak",
    slug: "sample-mysore-pak",
    categorySlug: "traditional-sweets",
    pricePaise: 22000,
    stock: 20,
    description: "Illustrative sweet-shop favourite. Confirm actual price, ingredients and availability with the bakery."
  },
  {
    name: "Coconut Burfi",
    slug: "sample-coconut-burfi",
    categorySlug: "traditional-sweets",
    pricePaise: 18000,
    stock: 20,
    description: "Sample listing for a classic coconut sweet. Confirm actual price and availability with the bakery."
  },
  {
    name: "Ellu Urundai",
    slug: "sample-ellu-urundai",
    categorySlug: "traditional-sweets",
    pricePaise: 12000,
    stock: 20,
    description: "Illustrative sesame-jaggery sweet listing. Confirm ingredients, actual price and availability."
  },
  {
    name: "Nei Appam",
    slug: "sample-nei-appam",
    categorySlug: "traditional-sweets",
    pricePaise: 15000,
    stock: 20,
    description: "Sample listing for a traditional ghee appam. Confirm actual price and availability with the bakery."
  },
  {
    name: "Milk Peda",
    slug: "sample-milk-peda",
    categorySlug: "traditional-sweets",
    pricePaise: 20000,
    stock: 20,
    description: "Illustrative traditional milk sweet listing. Confirm actual price and availability with the bakery."
  }
];

await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
try {
  const categories = await Category.find({
    slug: { $in: [...new Set(demoProducts.map((item) => item.categorySlug))] }
  }).lean();
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category._id]));
  const missingCategories = [...new Set(demoProducts.map((item) => item.categorySlug))]
    .filter((slug) => !categoryBySlug.has(slug));
  if (missingCategories.length) {
    throw new Error(`Required categories are missing: ${missingCategories.join(", ")}. Run npm run db:init first.`);
  }

  for (const { categorySlug, ...product } of demoProducts) {
    await Product.updateOne(
      { slug: product.slug },
      {
        $set: {
          ...product,
          category: categoryBySlug.get(categorySlug),
          isDemo: true,
          isAvailable: true,
          isFeatured: false,
          images: []
        }
      },
      { upsert: true, runValidators: true }
    );
  }
  console.log(`Seeded ${demoProducts.length} clearly marked, non-purchasable sample sweets and snacks.`);
} finally {
  await mongoose.disconnect();
}
