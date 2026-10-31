import StoreFooter from "@/components/store-footer";
import StoreHeader from "@/components/store-header";
import ProductCatalog from "@/components/product-catalog";

export async function generateMetadata({ params }) {
  const { categorySlug } = await params;
  const category = categorySlug.replaceAll("-", " ");
  return {
    title: `${category.replace(/\b\w/g, (letter) => letter.toUpperCase())} | G Arasu Bakery`,
    description: `Browse freshly prepared ${category} at G Arasu Bakery.`
  };
}

export default async function CategoryPage({ params }) {
  const { categorySlug } = await params;
  return (
    <>
      <StoreHeader />
      <ProductCatalog categorySlug={categorySlug} />
      <StoreFooter />
    </>
  );
}
