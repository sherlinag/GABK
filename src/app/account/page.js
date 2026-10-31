"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import StoreFooter from "@/components/store-footer";
import StoreHeader from "@/components/store-header";

function formatPrice(paise) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(paise / 100);
}

export default function AccountPage() {
  const [token, setToken] = useState("");
  const [mode, setMode] = useState("login");
  const [fields, setFields] = useState({ name: "", phone: "", email: "", password: "" });
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [orderNotice, setOrderNotice] = useState(false);

  const loadOrders = useCallback(async (accessToken) => {
    const response = await fetch("/api/orders", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.error?.message || "Could not load your order history.");
    setOrders(result.data.orders);
  }, []);

  useEffect(() => {
    setOrderNotice(new URLSearchParams(window.location.search).get("ordered") === "1");
    const storedToken = window.sessionStorage.getItem("g-arasu-access-token") || "";
    setToken(storedToken);
    if (storedToken) loadOrders(storedToken).catch((requestError) => setError(requestError.message));
  }, [loadOrders]);

  async function submitAccount(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const registering = mode === "register";
      const response = await fetch(registering ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registering ? fields : { email: fields.email, password: fields.password })
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error?.message || "Could not sign in.");
      if (result.data.user.role !== "customer") {
        throw new Error("Please use the separate administrator sign-in page.");
      }
      window.sessionStorage.setItem("g-arasu-access-token", result.data.accessToken);
      setToken(result.data.accessToken);
      await loadOrders(result.data.accessToken);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  function signOut() {
    window.sessionStorage.removeItem("g-arasu-access-token");
    setToken("");
    setOrders([]);
  }

  return (
    <>
      <StoreHeader />
      <main className="section account-page">
        <div className="eyebrow">Your G Arasu Bakery account</div>
        <h1 className="page-title">Your account &amp; orders</h1>
        {orderNotice && <p className="form-success">Your order was placed. Its latest status appears below.</p>}
        {error && <p className="form-error" role="alert">{error}</p>}
        {!token ? (
          <section className="account-card">
            <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
            <p>Sign in to track your bakery orders, or register to get started.</p>
            <form className="form-stack" onSubmit={submitAccount}>
              {mode === "register" && <>
                <input className="form-field" placeholder="Your name" autoComplete="name" minLength={2} required value={fields.name} onChange={(event) => setFields({ ...fields, name: event.target.value })} />
                <input className="form-field" placeholder="Mobile number" autoComplete="tel" minLength={7} required value={fields.phone} onChange={(event) => setFields({ ...fields, phone: event.target.value })} />
              </>}
              <input className="form-field" type="email" placeholder="Email address" autoComplete="email" required value={fields.email} onChange={(event) => setFields({ ...fields, email: event.target.value })} />
              <input className="form-field" type="password" placeholder="Password (at least 8 characters)" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} required value={fields.password} onChange={(event) => setFields({ ...fields, password: event.target.value })} />
              <button className="button-primary" type="submit" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</button>
            </form>
            <button className="text-button" type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
              {mode === "login" ? "New here? Create an account" : "Already registered? Sign in"}
            </button>
          </section>
        ) : (
          <section className="orders-panel">
            <div className="orders-panel-heading">
              <div><h2>Your order history</h2><p>Track the latest status of your orders.</p></div>
              <button className="button-secondary" type="button" onClick={signOut}>Sign out</button>
            </div>
            {orders.length === 0 ? (
              <div className="empty-products">
                <strong>No orders yet</strong>
                <p>Your placed orders will show here.</p>
                <Link className="button-primary" href="/menu">Explore the menu</Link>
              </div>
            ) : orders.map((order) => (
              <article className="order-history-card" key={order._id}>
                <div>
                  <strong>{order.orderNumber}</strong>
                  <span>{new Date(order.createdAt).toLocaleString("en-IN")}</span>
                  <small>{order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}</small>
                </div>
                <div className="order-status">
                  <span className="status-pill">{order.status.replaceAll("_", " ")}</span>
                  <strong>{formatPrice(order.totalPaise)}</strong>
                  <small>{order.fulfillment === "pickup" ? "Store pickup" : "Delivery"} · COD</small>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
      <StoreFooter />
    </>
  );
}
