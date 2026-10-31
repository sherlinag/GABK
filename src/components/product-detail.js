"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AddToCartButton } from "@/components/product-card";

function formatPrice(paise) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(paise / 100);
}

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadProduct() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/products/${encodeURIComponent(slug)}`);
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error?.message || "Product not found.");
        if (active) setProduct(result.data.product);
      } catch (requestError) {
        if (active) setError(requestError.message || "Could not load this product.");
      } finally {
        if (active) setLoading(false);
      }
    }
    if (slug) loadProduct();
    return () => { active = false; };
  }, [slug]);

  if (loading) return <main className="section"><div className="loading-grid">Loading this bakery favourite…</div></main>;
  if (error || !product) {
    return (
      <main className="section">
        <div className="empty-products"><strong>{error || "Product not found"}</strong><p>Browse the menu to find another fresh favourite.</p><Link className="button-primary" href="/menu">Browse menu</Link></div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href="/menu">Menu</Link><span>/</span><span>{product.name}</span></div>
      <article className="detail-layout">
        <div className="detail-image">
          {product.images?.[0] && !imageFailed
            ? <img src={product.images[0]} alt={product.name} onError={() => setImageFailed(true)} />
            : <span aria-hidden="true">🥮</span>}
          {product.isDemo && <span className="product-label">Sample listing</span>}
        </div>
        <div className="detail-copy">
          <div className="eyebrow">{product.category?.name || "Bakery"}</div>
          <h1>{product.name}</h1>
          <p className="detail-description">{product.description || "Freshly prepared with care at G Arasu Bakery."}</p>
          {product.isDemo ? (
            <div className="demo-catalog-note">Sample listing · Ask the bakery for today’s price and availability. This preview item cannot be ordered.</div>
          ) : (
            <div className="detail-price">{formatPrice(product.discountPricePaise ?? product.pricePaise)}</div>
          )}
          <p className="stock-note">{product.isDemo ? "Preview item — not orderable" : product.stock > 0 ? "Fresh and available today" : "Currently unavailable"}</p>
          <div className="detail-actions"><AddToCartButton product={product} /><Link className="button-secondary" href="/menu">Back to menu</Link></div>
          <div className="detail-contact">Questions about ingredients or bulk orders? <a href="tel:+916369501625">Call +91 63695 01625</a>.</div>
        </div>
      </article>
    </main>
  );
}
