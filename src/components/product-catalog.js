"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/product-card";

export default function ProductCatalog({ categorySlug = "" }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const categoriesResponse = await fetch("/api/categories");
      const categoriesResult = await categoriesResponse.json();
      if (!categoriesResponse.ok || !categoriesResult.success) {
        throw new Error(categoriesResult.error?.message || "Could not load bakery categories.");
      }

      const categoriesData = categoriesResult.data.categories;
      setCategories(categoriesData);
      const selectedCategory = categoriesData.find((category) => category.slug === categorySlug);
      if (categorySlug && !selectedCategory) {
        setProducts([]);
        setError("We couldn't find that bakery category.");
        return;
      }
      const params = new URLSearchParams({ limit: "50" });
      if (search) params.set("search", search);
      if (selectedCategory) params.set("category", selectedCategory._id);

      const productsResponse = await fetch(`/api/products?${params.toString()}`);
      const productsResult = await productsResponse.json();
      if (!productsResponse.ok || !productsResult.success) {
        throw new Error(productsResult.error?.message || "Could not load bakery products.");
      }
      setProducts(productsResult.data.products);
    } catch (requestError) {
      setError(requestError.message || "Could not load the bakery menu.");
    } finally {
      setLoading(false);
    }
  }, [categorySlug, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const selectedCategory = categories.find((category) => category.slug === categorySlug);

  return (
    <main className="section catalog-page">
      <div className="section-heading">
        <div>
          <div className="eyebrow">{selectedCategory ? "Fresh from this collection" : "Made fresh every day"}</div>
          <h1 className="page-title">{selectedCategory?.name || "Our bakery menu"}</h1>
        </div>
        <p>Browse bakery favourites and traditional treats. Sample items are for preview only; check with the bakery for today’s availability.</p>
      </div>

      <form className="shop-tools catalog-search" onSubmit={(event) => { event.preventDefault(); setSearch(searchText.trim()); }}>
        <input
          className="search-field"
          type="search"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search cakes, puffs, sweets..."
          aria-label="Search products"
        />
        <button className="button-primary" type="submit">Search</button>
      </form>

      <nav className="category-row" aria-label="Product categories">
        <Link className={`category-chip${categorySlug ? "" : " active"}`} href="/menu">Everything</Link>
        {categories.map((category) => (
          <Link
            className={`category-chip${category.slug === categorySlug ? " active" : ""}`}
            href={`/menu/${category.slug}`}
            key={category._id}
          >
            {category.name}
          </Link>
        ))}
      </nav>

      {products.some((product) => product.isDemo) && (
        <p className="demo-catalog-note">
          Sample Nagercoil-style snacks and sweets are for preview only. Demo items cannot be ordered;
          call the bakery to confirm actual prices and availability.
        </p>
      )}
      {error && <p className="api-error" role="alert">{error}</p>}

      {loading ? (
        <div className="loading-grid">Bringing the fresh menu to you…</div>
      ) : products.length ? (
        <div className="product-grid">
          {products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      ) : (
        <div className="empty-products catalog-empty">
          <strong>{search || categorySlug ? "Nothing here just yet" : "Our fresh menu is on its way"}</strong>
          <p>{search || categorySlug ? "Try another search or choose a different category." : "Check back soon for today's bakes, or call us for the current menu."}</p>
          <a className="button-secondary" href="tel:+916369501625">Call 63695 01625</a>
        </div>
      )}
    </main>
  );
}
