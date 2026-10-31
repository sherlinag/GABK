import Link from "next/link";

export default function StoreFooter() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <Link className="brand" href="/">
            <span className="brand-mark">G</span>
            <span>
              <span className="brand-name">G Arasu Bakery</span>
              <span className="brand-sub">Freshly baked with love</span>
            </span>
          </Link>
          <p>Your neighbourhood bakery in Muttaicadu. Fresh treats and warm smiles, every day.</p>
        </div>
        <div className="footer-links">
          <Link href="/menu">Our menu</Link>
          <Link href="/about">Our story</Link>
          <Link href="/contact">Find us</Link>
          <Link href="tel:+916369501625">Call the bakery</Link>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} G Arasu Bakery · Baked fresh in Kumarapuram, Tamil Nadu
      </div>
    </footer>
  );
}
