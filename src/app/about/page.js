import Link from "next/link";
import StoreFooter from "@/components/store-footer";
import StoreHeader from "@/components/store-header";

export const metadata = {
  title: "Our Story | G Arasu Bakery",
  description: "Meet your neighbourhood bakery in Muttaicadu, Kumarapuram."
};

export default function AboutPage() {
  return (
    <>
      <StoreHeader />
      <main className="story-page">
        <section className="story-hero">
          <div className="eyebrow">A little local goodness</div>
          <h1>Rooted in our neighbourhood. Made for sharing.</h1>
          <p>G Arasu Bakery brings fresh bakes and familiar treats to Muttaicadu, Kumarapuram, and the Nagercoil area.</p>
        </section>
        <section className="story-inner story-page-content">
          <div className="story-photo" role="img" aria-label="Freshly baked bread and pastries" />
          <div className="story-copy">
            <div className="eyebrow">Freshly baked with love</div>
            <h2>Everyday treats, close to home.</h2>
            <p>From a quick savoury bite to a box of sweets for family and friends, a neighbourhood bakery is part of life’s little celebrations.</p>
            <p>We’re glad to serve our local community from Muttaicadu. Our online menu is growing; please call to confirm today’s availability, ingredients, and prices.</p>
            <div className="story-note">“The best treats are the ones we share.”</div>
            <Link className="button-primary" href="/menu">Explore the menu</Link>
          </div>
        </section>
        <section className="story-values">
          <article><span>01</span><h2>Fresh each day</h2><p>We love the simple pleasure of a freshly baked treat.</p></article>
          <article><span>02</span><h2>Made for sharing</h2><p>Savoury snacks and sweets for everyday moments and celebrations.</p></article>
          <article><span>03</span><h2>Neighbourhood first</h2><p>Serving Muttaicadu, Kumarapuram, and nearby communities.</p></article>
        </section>
      </main>
      <StoreFooter />
    </>
  );
}
