import Link from "next/link";
import ProductCatalog from "@/components/product-catalog";
import StoreFooter from "@/components/store-footer";
import StoreHeader from "@/components/store-header";

export const metadata = {
  title: "Savoury Snacks | G Arasu Bakery",
  description: "Browse Nagercoil-style savoury snacks and sample regional favourites."
};

export default function SnacksPage() {
  return (
    <>
      <StoreHeader />
      <main>
        <section className="collection-hero snacks-hero">
          <div className="eyebrow">A savoury little something</div>
          <h1>Local snacks,<br /><em>big on crunch.</em></h1>
          <p>Discover sample South Tamil Nadu snack favourites for your evening tea, family visits, and get-togethers.</p>
          <Link className="button-primary" href="#snacks-menu">Explore snacks</Link>
          <span className="collection-art" aria-hidden="true">🥨</span>
        </section>
        <div id="snacks-menu"><ProductCatalog categorySlug="savoury-snacks" /></div>
      </main>
      <StoreFooter />
    </>
  );
}
