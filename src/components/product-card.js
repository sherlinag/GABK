"use client";

import Link from "next/link";
import { useState } from "react";
import { readCart, writeCart } from "@/lib/cart";

function formatPrice(paise) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(paise / 100);
}

function productEmoji(product) {
  const name = `${product.name} ${product.category?.name || ""}`.toLowerCase();
  if (name.includes("cake")) return "🎂";
  if (name.includes("puff")) return "🥐";
  if (name.includes("roll")) return "🌯";
  if (name.includes("sweet") || name.includes("laddu") || name.includes("burfi") || name.includes("peda")) return "🍬";
  if (name.includes("cookie")) return "🍪";
  if (name.includes("bread")) return "🍞";
  if (name.includes("cupcake")) return "🧁";
  if (name.includes("pastry")) return "🥧";
  return "🥮";
}

export function AddToCartButton({ product }) {
  const [added, setAdded] = useState(false);

  function addProduct() {
    if (product.isDemo || product.stock < 1) return;
    const cart = readCart();
    const existing = cart.find((item) => item._id === product._id);
    const updatedCart = existing
      ? cart.map((item) => item._id === product._id
        ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
        : item)
      : [...cart, { ...product, quantity: 1 }];
    writeCart(updatedCart);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <button
      className="add-button"
      type="button"
      disabled={!product.stock || product.isDemo}
      aria-label={product.isDemo ? `${product.name} sample listing` : `Add ${product.name} to bag`}
      title={product.isDemo ? "Sample listing; not available to order" : "Add to bag"}
      onClick={addProduct}
    >
      {product.isDemo ? "·" : added ? "✓" : "+"}
    </button>
  );
}

export default function ProductCard({ product }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="product-card">
      <Link className="product-photo" href={`/products/${product.slug}`} aria-label={`View ${product.name}`}>
        {product.images?.[0] && !imageFailed
          ? <img src={product.images[0]} alt={product.name} loading="lazy" onError={() => setImageFailed(true)} />
          : <span className="product-emoji" aria-hidden="true">{productEmoji(product)}</span>}
        {product.isDemo
          ? <span className="product-label">Sample listing</span>
          : product.discountPricePaise
            ? <span className="product-label">Fresh favourite</span>
            : !product.stock && <span className="product-label">Sold out</span>}
      </Link>
      <div className="product-info">
        <div className="product-category">{product.category?.name || "Bakery"}</div>
        <h3><Link href={`/products/${product.slug}`}>{product.name}</Link></h3>
        <div className="product-desc">{product.description || "Freshly prepared with care at G Arasu Bakery."}</div>
        <div className="product-bottom">
          <span className="product-price">
            {product.isDemo ? "Ask for today's price" : formatPrice(product.discountPricePaise ?? product.pricePaise)}
          </span>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
