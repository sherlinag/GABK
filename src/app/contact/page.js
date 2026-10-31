import Link from "next/link";
import StoreFooter from "@/components/store-footer";
import StoreHeader from "@/components/store-header";

export const metadata = {
  title: "Visit & Contact | G Arasu Bakery",
  description: "Find G Arasu Bakery in Muttaicadu, Kumarapuram, or call to ask about today's menu."
};

export default function ContactPage() {
  return (
    <>
      <StoreHeader />
      <main className="contact-page">
        <section className="story-hero">
          <div className="eyebrow">We’re just around the corner</div>
          <h1>Come by for something lovely.</h1>
          <p>Questions about today’s bakes, ingredients, or a larger order? Give the bakery a call.</p>
        </section>
        <section className="contact-grid">
          <article className="contact-panel">
            <div className="eyebrow">Find the bakery</div>
            <h2>G Arasu Bakery</h2>
            <p>78PC+97P, Muttaicadu,<br />Kumarapuram, Tamil Nadu 629164</p>
            <a className="button-primary" href="https://maps.google.com/?q=G+Arasu+Bakery+Muttaicadu+Kumarapuram" target="_blank" rel="noreferrer">Open in Google Maps</a>
          </article>
          <article className="contact-panel contact-hours">
            <div className="eyebrow">We’re here every day</div>
            <h2>8:00 AM – 10:00 PM</h2>
            <p>Call us to check product availability and current prices before visiting or placing your order.</p>
            <a className="button-primary" href="tel:+916369501625">Call +91 63695 01625</a>
          </article>
        </section>
        <div className="contact-menu-link"><span>Ready for a treat?</span><Link className="button-secondary" href="/menu">Browse the bakery menu</Link></div>
      </main>
      <StoreFooter />
    </>
  );
}
