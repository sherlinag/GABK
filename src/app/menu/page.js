import StoreFooter from "@/components/store-footer";
import StoreHeader from "@/components/store-header";
import ProductCatalog from "@/components/product-catalog";

export const metadata = {
  title: "Bakery Menu | G Arasu Bakery",
  description: "Browse the bakery menu, savoury snacks and traditional sweets."
};

export default function MenuPage() {
  return (
    <>
      <StoreHeader />
      <ProductCatalog />
      <StoreFooter />
    </>
  );
}
