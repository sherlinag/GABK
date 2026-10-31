"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readCart, subscribeToCart } from "@/lib/cart";

export default function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setCartCount(readCart().reduce((total, item) => total + item.quantity, 0));
    };
    updateCount();
    return subscribeToCart(updateCount);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <div className="announcement">
        BAKED FRESH, EVERY DAY <span aria-hidden="true">✦</span>{" "}
        <strong>Pickup &amp; local ordering in Nagercoil</strong>
      </div>
      <header className="site-header">
        <div className="nav-wrap">
          <Link className="brand" href="/" aria-label="G Arasu Bakery home" onClick={closeMenu}>
            <span className="brand-mark">G</span>
            <span>
              <span className="brand-name">G Arasu Bakery</span>
              <span className="brand-sub">Freshly baked with love</span>
            </span>
          </Link>
          <nav className={`nav-links${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
            <Link href="/menu" onClick={closeMenu}>Our menu</Link>
            <Link href="/sweets" onClick={closeMenu}>Sweets</Link>
            <Link href="/snacks" onClick={closeMenu}>Snacks</Link>
            <Link href="/about" onClick={closeMenu}>Our story</Link>
            <Link href="/contact" onClick={closeMenu}>Visit us</Link>
            <Link href="/admin/login" onClick={closeMenu}>Admin sign in</Link>
          </nav>
          <div className="nav-actions">
            <button
              className="icon-button mobile-menu-button"
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                {menuOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
            <Link className="icon-button" href="/account" aria-label="Account and order tracking" title="Account">
              <span aria-hidden="true">☺</span>
            </Link>
            <Link className="icon-button" href="/cart" aria-label={`Shopping bag, ${cartCount} items`}>
              <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 8h14l-1 13H6L5 8Z" /><path d="M9 8a3 3 0 0 1 6 0" />
              </svg>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
