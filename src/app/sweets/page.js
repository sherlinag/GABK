import Link from "next/link";
import ProductCatalog from "@/components/product-catalog";
import StoreFooter from "@/components/store-footer";
import StoreHeader from "@/components/store-header";

export const metadata = {
  title: "Traditional Sweets | G Arasu Bakery",
  description: "Explore traditional sweets and sample regional favourites from G Arasu Bakery."
};

export default function SweetsPage() {
  return (
    <>
      <StoreHeader />
      <main>
        <section className="collection-hero sweets-hero">
          <div className="eyebrow">A little sweetness for the day</div>
          <h1>Traditional sweets,<br /><em>made for sharing.</em></h1>
          <p>Explore familiar South Tamil Nadu sweet-shop favourites and find something lovely for your next tea break or celebration.</p>
          <Link className="button-primary" href="#sweets-menu">Explore sweets</Link>
          <span className="collection-art" aria-hidden="true">🍬</span>
        </section>
        <div id="sweets-menu"><ProductCatalog categorySlug="traditional-sweets" /></div>
      </main>
      <StoreFooter />
    </>
  );
}
