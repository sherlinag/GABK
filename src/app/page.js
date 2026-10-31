"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import StoreHeader from "@/components/store-header";
import StoreFooter from "@/components/store-footer";
import { readCart, writeCart } from "@/lib/cart";

const EMPTY_ADDRESS = {
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "Tamil Nadu",
  pincode: ""
};

function Icon({ name }) {
  const paths = {
    bag: <><path d="M5 8h14l-1 13H6L5 8Z" /><path d="M9 8a3 3 0 0 1 6 0" /><path d="M9 12v1m6-1v1" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.3" /><path d="m16 16 4 4" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    arrow: <><path d="M4 12h15m-6-6 6 6-6 6" /></>,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>
  };
  return <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function formatPrice(paise) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(paise / 100);
}

function foodEmoji(product) {
  const value = `${product.name} ${product.category?.name || ""}`.toLowerCase();
  if (value.includes("cake")) return "🎂";
  if (value.includes("puff")) return "🥐";
  if (value.includes("roll")) return "🌯";
  if (value.includes("sweet") || value.includes("laddu")) return "🍬";
  if (value.includes("cookie")) return "🍪";
  if (value.includes("bread")) return "🍞";
  if (value.includes("cupcake")) return "🧁";
  if (value.includes("pastry")) return "🥧";
  return "🥮";
}

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [cart, setCart] = useState([]);
  const [cartReady, setCartReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checkoutStarted, setCheckoutStarted] = useState(false);
  const [accountMode, setAccountMode] = useState("login");
  const [account, setAccount] = useState({ name: "", email: "", phone: "", password: "" });
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [fulfillment, setFulfillment] = useState("delivery");
  const [orderNotes, setOrderNotes] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (search) params.set("search", search);
      if (activeCategory) params.set("category", activeCategory);
      const [categoryResponse, productResponse] = await Promise.all([
        fetch("/api/categories"),
        fetch(`/api/products?${params.toString()}`)
      ]);
      const [categoryJson, productJson] = await Promise.all([
        categoryResponse.json(),
        productResponse.json()
      ]);
      if (!categoryResponse.ok || !categoryJson.success) {
        throw new Error(categoryJson.error?.message || "Could not load bakery categories.");
      }
      if (!productResponse.ok || !productJson.success) {
        throw new Error(productJson.error?.message || "Could not load the product menu.");
      }
      setCategories(categoryJson.data.categories);
      setProducts(productJson.data.products);
    } catch (error) {
      setLoadError(error.message || "Could not connect to the bakery menu.");
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search]);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    try {
      setCart(readCart());
    } catch {
      window.localStorage.removeItem("g-arasu-cart");
    }
    setAccessToken(window.sessionStorage.getItem("g-arasu-access-token") || "");
    setCartReady(true);
  }, []);

  useEffect(() => {
    if (cartReady) writeCart(cart);
  }, [cart, cartReady]);

  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce(
    (total, item) => total + (item.discountPricePaise ?? item.pricePaise) * item.quantity,
    0
  ), [cart]);

  function addToCart(product) {
    if (product.isDemo) return;
    setNotice(`${product.name} added to your bag.`);
    setCart((current) => {
      const found = current.find((item) => item._id === product._id);
      if (found) {
        return current.map((item) => item._id === product._id
          ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
          : item);
      }
      return [...current, { ...product, quantity: 1 }];
    });
    window.setTimeout(() => setNotice(""), 2400);
  }

  function changeQuantity(productId, delta) {
    setCart((current) => current
      .map((item) => item._id === productId
        ? { ...item, quantity: Math.min(item.quantity + delta, item.stock) }
        : item)
      .filter((item) => item.quantity > 0));
  }

  async function submitAccount(event) {
    event.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      const endpoint = accountMode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = accountMode === "login"
        ? { email: account.email, password: account.password }
        : account;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error?.message || "Could not sign in.");
      window.sessionStorage.setItem("g-arasu-access-token", result.data.accessToken);
      setAccessToken(result.data.accessToken);
      setFormError("");
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function submitOrder(event) {
    event.preventDefault();
    setFormError("");
    setNotice("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          items: cart.map((item) => ({ productId: item._id, quantity: item.quantity })),
          fulfillment,
          ...(fulfillment === "delivery" ? { address } : {}),
          notes: orderNotes
        })
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error?.message || "Could not place your order.");
      setNotice(`Order ${result.data.order.orderNumber} placed successfully. Payment is due on delivery.`);
      setCart([]);
      setCheckoutStarted(false);
      setAddress(EMPTY_ADDRESS);
      await loadCatalog();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function loadOrders() {
    setFormError("");
    try {
      const response = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error?.message || "Could not load orders.");
      setOrders(result.data.orders);
      setShowOrders(true);
    } catch (error) {
      setFormError(error.message);
    }
  }

  function updateAddress(event) {
    const { name, value } = event.target;
    setAddress((current) => ({ ...current, [name]: value }));
  }

  return (
    <>
      <StoreHeader />

      <main>
        <section className="hero">
          <div className="hero-inner">
            <div>
              <div className="eyebrow">From our oven to your table</div>
              <h1>Freshly baked <em>happiness,</em> every day.</h1>
              <p className="hero-copy">A little sweetness, a lot of love. Discover fresh bakes and much-loved treats made for sharing at G Arasu Bakery.</p>
              <div className="hero-actions">
                <a className="button-primary" href="#menu">Explore the menu <Icon name="arrow" /></a>
                <a className="button-secondary" href="tel:+916369501625">Call to order · 63695 01625</a>
              </div>
              <div className="hero-rating"><span className="rating-stars">★★★★★</span><span>Made fresh daily in Muttaicadu</span></div>
            </div>
            <div className="hero-art" aria-label="Freshly baked artisan bread">
              <div className="hero-food" />
              <div className="hero-sticker"><strong>Made fresh</strong><span>with love daily</span></div>
            </div>
          </div>
        </section>

        <div className="trust-strip" aria-label="Bakery features">
          <div className="trust-item"><span className="trust-icon">♨</span><span><strong>Fresh from the oven</strong><span>Made fresh every day</span></span></div>
          <div className="trust-item"><span className="trust-icon">♡</span><span><strong>Made with care</strong><span>Goodness in every bite</span></span></div>
          <div className="trust-item"><span className="trust-icon">⌖</span><span><strong>Local pickup</strong><span>Muttaicadu, Kumarapuram</span></span></div>
        </div>

        <section className="section" id="menu">
          <div className="section-heading">
            <div><div className="eyebrow">Something delicious awaits</div><h2>Our bakery favourites</h2></div>
            <p>Find a new favourite or enjoy the treats you already love. Freshly prepared and ready for your table.</p>
          </div>
          <div className="shop-tools">
            <form className="form-stack" style={{ display: "flex", width: "100%", maxWidth: 430 }} onSubmit={(event) => { event.preventDefault(); setSearch(searchText.trim()); }}>
              <input className="search-field" type="search" value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search cakes, puffs, sweets..." aria-label="Search products" />
              <button type="submit" className="icon-button" aria-label="Search"><Icon name="search" /></button>
            </form>
          </div>
          <div className="category-row" aria-label="Filter by category">
            <Link className={`category-chip${activeCategory ? "" : " active"}`} href="/menu">Everything</Link>
            {categories.map((category) => (
              <Link
                key={category._id}
                className={`category-chip${activeCategory === category._id ? " active" : ""}`}
                href={`/menu/${category.slug}`}
              >
                {category.name}
              </Link>
            ))}
          </div>
          {notice && !cartOpen && <p className="form-success" role="status">{notice}</p>}
          {products.some((product) => product.isDemo) && (
            <p className="demo-catalog-note">
              Sample Nagercoil-style sweets and snacks are shown for preview only. Prices and stock are illustrative;
              demo items cannot be ordered. Call the bakery to confirm today’s menu.
            </p>
          )}
          {loadError && <p className="api-error" role="alert">{loadError} Please try again in a moment.</p>}
          <div className="product-grid">
            {loading ? <div className="loading-grid">Bringing the fresh menu to you…</div> : products.length === 0 ? (
              <div className="empty-products">
                <strong>{search || activeCategory ? "Nothing here just yet" : "Our fresh menu is on its way"}</strong>
                <p>{search || activeCategory ? "Try another search or choose a different category." : "Check back soon for today's bakes, or call us and we’ll be happy to help."}</p>
                <a className="button-secondary" href="tel:+916369501625">Call 63695 01625</a>
              </div>
            ) : products.map((product) => (
              <article className="product-card" key={product._id}>
                <Link className="product-photo" href={`/products/${product.slug}`} aria-label={`View ${product.name}`}>
                  {product.images?.[0]
                    ? <img src={product.images[0]} alt={product.name} loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                    : <span className="product-emoji" aria-hidden="true">{foodEmoji(product)}</span>}
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
                    <button
                      className="add-button"
                      type="button"
                      disabled={!product.stock || product.isDemo}
                      aria-label={product.isDemo ? `${product.name} sample listing` : `Add ${product.name} to bag`}
                      title={product.isDemo ? "Sample listing; not available to order" : "Add to bag"}
                      onClick={() => addToCart(product)}
                    >
                      {product.isDemo ? "·" : "+"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="story-section" id="story">
          <div className="story-inner">
            <div className="story-photo" role="img" aria-label="Fresh pastries from a local bakery" />
            <div className="story-copy">
              <div className="eyebrow">A little local goodness</div>
              <h2>Made fresh, shared with love.</h2>
              <p>At G Arasu Bakery, every day begins with the simple joy of baking. From savoury afternoon favourites to something sweet for the family, we’re here to make your everyday moments a little more delicious.</p>
              <div className="story-note">“The best treats are the ones we share.”</div>
              <div className="contact-card" id="visit">
                <strong><Icon name="pin" /> &nbsp;Come by for something lovely</strong>
                <span>78PC+97P, Muttaicadu, Kumarapuram, Tamil Nadu 629164<br />Open every day · 8:00 AM – 10:00 PM<br /><a href="tel:+916369501625">+91 63695 01625</a></span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <StoreFooter />

      {cartOpen && (
        <div className="overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
          <aside className="drawer" role="dialog" aria-modal="true" aria-label={showOrders ? "Your orders" : "Shopping bag"}>
            <div className="drawer-head">
              <h2>{showOrders ? "Your orders" : checkoutStarted ? "Your checkout" : "Your bag"}</h2>
              <button className="close-button" type="button" aria-label="Close" onClick={() => setCartOpen(false)}>×</button>
            </div>
            {notice && <p className="form-success" role="status">{notice}</p>}
            {formError && <p className="form-error" role="alert">{formError}</p>}
            {showOrders ? (
              <div className="order-history">
                {orders.length === 0 ? <p>You haven’t placed an order yet.</p> : orders.map((order) => (
                  <div className="order-row" key={order._id}>
                    <span><strong>{order.orderNumber}</strong><br />{new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                    <span>{order.status.replaceAll("_", " ")}<br />{formatPrice(order.totalPaise)}</span>
                  </div>
                ))}
                <button className="text-button" type="button" onClick={() => setShowOrders(false)}>Back to bag</button>
              </div>
            ) : (
              <>
                {!checkoutStarted && (
                  <>
                    {cart.length === 0 ? <div className="drawer-step"><p>Your bag is waiting for something delicious.</p><a className="button-secondary" href="#menu" onClick={() => setCartOpen(false)}>Explore the menu</a></div> : (
                      <>
                        <div className="drawer-step">
                          {cart.map((item) => (
                            <div className="cart-line" key={item._id}>
                              <div><h3>{item.name}</h3><span>{formatPrice(item.discountPricePaise ?? item.pricePaise)} each</span></div>
                              <div className="quantity-control">
                                <button type="button" aria-label={`Remove one ${item.name}`} onClick={() => changeQuantity(item._id, -1)}>−</button>
                                <span>{item.quantity}</span>
                                <button type="button" aria-label={`Add one ${item.name}`} onClick={() => changeQuantity(item._id, 1)}>+</button>
                              </div>
                            </div>
                          ))}
                          <div className="cart-summary"><span>Subtotal · COD</span><span>{formatPrice(cartTotal)}</span></div>
                          <button className="button-primary" style={{ width: "100%" }} type="button" onClick={() => { setCheckoutStarted(true); setFormError(""); }}>Continue to checkout <Icon name="arrow" /></button>
                        </div>
                      </>
                    )}
                  </>
                )}
                {checkoutStarted && !accessToken && (
                  <div className="drawer-step">
                    <h3>{accountMode === "login" ? "Welcome back" : "Create your account"}</h3>
                    <p style={{ color: "var(--muted)", fontSize: 12 }}>Sign in to place your order and keep track of your bakes.</p>
                    <form className="form-stack" onSubmit={submitAccount}>
                      {accountMode === "register" && <>
                        <input className="form-field" placeholder="Your name" autoComplete="name" required minLength={2} value={account.name} onChange={(event) => setAccount({ ...account, name: event.target.value })} />
                        <input className="form-field" placeholder="Mobile number" autoComplete="tel" required minLength={7} value={account.phone} onChange={(event) => setAccount({ ...account, phone: event.target.value })} />
                      </>}
                      <input className="form-field" type="email" placeholder="Email address" autoComplete="email" required value={account.email} onChange={(event) => setAccount({ ...account, email: event.target.value })} />
                      <input className="form-field" type="password" placeholder="Password (at least 8 characters)" autoComplete={accountMode === "login" ? "current-password" : "new-password"} required minLength={8} value={account.password} onChange={(event) => setAccount({ ...account, password: event.target.value })} />
                      <button className="button-primary" type="submit" disabled={submitting}>{submitting ? "Please wait…" : accountMode === "login" ? "Sign in to continue" : "Create account"}</button>
                    </form>
                    <button className="text-button" type="button" onClick={() => { setAccountMode(accountMode === "login" ? "register" : "login"); setFormError(""); }}>
                      {accountMode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
                    </button>
                  </div>
                )}
                {checkoutStarted && accessToken && (
                  <div className="drawer-step">
                    <h3>Where should we send your order?</h3>
                    <form className="form-stack" onSubmit={submitOrder}>
                      <div className="radio-row">
                        <label><input type="radio" name="fulfillment" value="delivery" checked={fulfillment === "delivery"} onChange={() => setFulfillment("delivery")} /> Delivery</label>
                        <label><input type="radio" name="fulfillment" value="pickup" checked={fulfillment === "pickup"} onChange={() => setFulfillment("pickup")} /> Store pickup</label>
                      </div>
                      {fulfillment === "delivery" && <>
                        <input className="form-field" name="name" placeholder="Full name" autoComplete="name" required value={address.name} onChange={updateAddress} />
                        <input className="form-field" name="phone" placeholder="Mobile number" autoComplete="tel" required minLength={7} value={address.phone} onChange={updateAddress} />
                        <input className="form-field" name="line1" placeholder="House / street address" autoComplete="street-address" required value={address.line1} onChange={updateAddress} />
                        <input className="form-field" name="line2" placeholder="Area / landmark (optional)" value={address.line2} onChange={updateAddress} />
                        <div className="form-grid">
                          <input className="form-field" name="city" placeholder="City" autoComplete="address-level2" required value={address.city} onChange={updateAddress} />
                          <input className="form-field" name="pincode" placeholder="PIN code" autoComplete="postal-code" required inputMode="numeric" pattern="[0-9]{6}" value={address.pincode} onChange={updateAddress} />
                        </div>
                        <input className="form-field" name="state" placeholder="State" autoComplete="address-level1" required value={address.state} onChange={updateAddress} />
                      </>}
                      <textarea className="form-field" placeholder="Order notes (optional)" value={orderNotes} onChange={(event) => setOrderNotes(event.target.value)} />
                      <div className="cart-summary"><span>Total · Cash on delivery</span><span>{formatPrice(cartTotal)}</span></div>
                      <button className="button-primary" type="submit" disabled={submitting || cart.length === 0}>{submitting ? "Placing your order…" : "Place order"}</button>
                    </form>
                    <button className="text-button" type="button" onClick={() => setCheckoutStarted(false)}>Back to bag</button>
                  </div>
                )}
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
