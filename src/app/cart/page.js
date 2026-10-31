"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import StoreFooter from "@/components/store-footer";
import StoreHeader from "@/components/store-header";
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

function formatPrice(paise) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(paise / 100);
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [accountMode, setAccountMode] = useState("login");
  const [account, setAccount] = useState({ name: "", phone: "", email: "", password: "" });
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [fulfillment, setFulfillment] = useState("delivery");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setCart(readCart());
    setAccessToken(window.sessionStorage.getItem("g-arasu-access-token") || "");
    setLoaded(true);
  }, []);

  const total = useMemo(() => cart.reduce(
    (sum, item) => sum + (item.discountPricePaise ?? item.pricePaise) * item.quantity,
    0
  ), [cart]);

  function updateCart(nextCart) {
    setCart(nextCart);
    writeCart(nextCart);
  }

  function changeQuantity(id, amount) {
    updateCart(cart
      .map((item) => item._id === id
        ? { ...item, quantity: Math.min(item.quantity + amount, item.stock) }
        : item)
      .filter((item) => item.quantity > 0));
  }

  async function submitAccount(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const registering = accountMode === "register";
      const response = await fetch(registering ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registering ? account : { email: account.email, password: account.password })
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error?.message || "Could not sign in.");
      window.sessionStorage.setItem("g-arasu-access-token", result.data.accessToken);
      setAccessToken(result.data.accessToken);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitOrder(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
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
          notes
        })
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error?.message || "Could not place your order.");
      updateCart([]);
      setNotice(`Order ${result.data.order.orderNumber} placed. Payment is due on delivery.`);
      setAddress(EMPTY_ADDRESS);
      router.push("/account?ordered=1");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <StoreHeader />
      <main className="section checkout-page">
        <div className="eyebrow">A little something delicious</div>
        <h1 className="page-title">Your shopping bag</h1>
        {notice && <p className="form-success" role="status">{notice}</p>}
        {error && <p className="form-error" role="alert">{error}</p>}

        {!loaded ? <div className="loading-grid">Loading your bag…</div> : cart.length === 0 ? (
          <div className="empty-products">
            <strong>Your bag is waiting for something delicious.</strong>
            <p>Browse today’s bakery favourites and add something to your bag.</p>
            <Link className="button-primary" href="/menu">Explore the menu</Link>
          </div>
        ) : (
          <div className="checkout-layout">
            <section className="checkout-card">
              <h2>In your bag</h2>
              {cart.map((item) => (
                <article className="cart-page-item" key={item._id}>
                  <Link className="cart-item-image" href={`/products/${item.slug}`}>
                    {item.images?.[0] ? <img src={item.images[0]} alt={item.name} /> : <span aria-hidden="true">🥮</span>}
                  </Link>
                  <div className="cart-item-info">
                    <Link href={`/products/${item.slug}`}><strong>{item.name}</strong></Link>
                    <span>{formatPrice(item.discountPricePaise ?? item.pricePaise)} each</span>
                    <div className="quantity-control">
                      <button type="button" aria-label={`Remove one ${item.name}`} onClick={() => changeQuantity(item._id, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button type="button" aria-label={`Add one ${item.name}`} disabled={item.quantity >= item.stock} onClick={() => changeQuantity(item._id, 1)}>+</button>
                    </div>
                  </div>
                  <strong className="cart-item-subtotal">{formatPrice((item.discountPricePaise ?? item.pricePaise) * item.quantity)}</strong>
                </article>
              ))}
              <Link className="text-button" href="/menu">Continue shopping</Link>
            </section>

            <aside className="checkout-card checkout-summary">
              <h2>Checkout</h2>
              {!accessToken ? (
                <>
                  <p>Sign in or create an account to place your order and track it.</p>
                  <form className="form-stack" onSubmit={submitAccount}>
                    {accountMode === "register" && <>
                      <input className="form-field" placeholder="Your name" autoComplete="name" minLength={2} required value={account.name} onChange={(event) => setAccount({ ...account, name: event.target.value })} />
                      <input className="form-field" placeholder="Mobile number" autoComplete="tel" minLength={7} required value={account.phone} onChange={(event) => setAccount({ ...account, phone: event.target.value })} />
                    </>}
                    <input className="form-field" type="email" placeholder="Email address" autoComplete="email" required value={account.email} onChange={(event) => setAccount({ ...account, email: event.target.value })} />
                    <input className="form-field" type="password" placeholder="Password (at least 8 characters)" autoComplete={accountMode === "login" ? "current-password" : "new-password"} minLength={8} required value={account.password} onChange={(event) => setAccount({ ...account, password: event.target.value })} />
                    <button className="button-primary" type="submit" disabled={busy}>{busy ? "Please wait…" : accountMode === "login" ? "Sign in" : "Create account"}</button>
                  </form>
                  <button className="text-button" type="button" onClick={() => { setAccountMode(accountMode === "login" ? "register" : "login"); setError(""); }}>
                    {accountMode === "login" ? "New here? Create an account" : "Already registered? Sign in"}
                  </button>
                </>
              ) : (
                <form className="form-stack" onSubmit={submitOrder}>
                  <h3>How would you like your order?</h3>
                  <div className="radio-row">
                    <label><input type="radio" name="fulfillment" checked={fulfillment === "delivery"} onChange={() => setFulfillment("delivery")} /> Delivery</label>
                    <label><input type="radio" name="fulfillment" checked={fulfillment === "pickup"} onChange={() => setFulfillment("pickup")} /> Store pickup</label>
                  </div>
                  {fulfillment === "delivery" && <>
                    <input className="form-field" name="name" placeholder="Full name" autoComplete="name" required value={address.name} onChange={(event) => setAddress({ ...address, name: event.target.value })} />
                    <input className="form-field" name="phone" placeholder="Mobile number" autoComplete="tel" minLength={7} required value={address.phone} onChange={(event) => setAddress({ ...address, phone: event.target.value })} />
                    <input className="form-field" name="line1" placeholder="House / street address" autoComplete="street-address" required value={address.line1} onChange={(event) => setAddress({ ...address, line1: event.target.value })} />
                    <input className="form-field" name="line2" placeholder="Area / landmark (optional)" value={address.line2} onChange={(event) => setAddress({ ...address, line2: event.target.value })} />
                    <div className="form-grid">
                      <input className="form-field" name="city" placeholder="City" required value={address.city} onChange={(event) => setAddress({ ...address, city: event.target.value })} />
                      <input className="form-field" name="pincode" placeholder="PIN code" inputMode="numeric" pattern="[0-9]{6}" required value={address.pincode} onChange={(event) => setAddress({ ...address, pincode: event.target.value })} />
                    </div>
                    <input className="form-field" name="state" placeholder="State" required value={address.state} onChange={(event) => setAddress({ ...address, state: event.target.value })} />
                  </>}
                  <textarea className="form-field" placeholder="Order notes (optional)" value={notes} onChange={(event) => setNotes(event.target.value)} />
                  <p>Cash on delivery · Delivery charges are currently zero.</p>
                  <button className="button-primary" type="submit" disabled={busy}>{busy ? "Placing your order…" : "Place order · " + formatPrice(total)}</button>
                </form>
              )}
              <div className="cart-summary"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
              <small>Prices are shown in Indian Rupees. Delivery charges are currently zero.</small>
            </aside>
          </div>
        )}
      </main>
      <StoreFooter />
    </>
  );
}
