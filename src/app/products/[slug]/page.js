import StoreFooter from "@/components/store-footer";
import StoreHeader from "@/components/store-header";
import ProductDetail from "@/components/product-detail";

export const metadata = {
  title: "Bakery Product | G Arasu Bakery",
  description: "Product details from G Arasu Bakery."
};

export default function ProductPage() {
  return (
    <>
      <StoreHeader />
      <ProductDetail />
      <StoreFooter />
    </>
  );
}
