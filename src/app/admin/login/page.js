"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    window.sessionStorage.removeItem("g-arasu-admin-token");
  }, []);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error?.message || "Could not sign in.");
      if (result.data.user.role !== "admin") {
        throw new Error("This sign-in is for bakery administrators. Use the customer account page instead.");
      }
      window.sessionStorage.setItem("g-arasu-admin-token", result.data.accessToken);
      router.replace("/admin");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <Link className="brand" href="/">
          <span className="brand-mark">G</span>
          <span><span className="brand-name">G Arasu Bakery</span><span className="brand-sub">Administration</span></span>
        </Link>
        <div className="eyebrow">Staff access</div>
        <h1>Admin sign in</h1>
        <p>Sign in with the bakery administrator account to manage products and orders.</p>
        {error && <div className="form-error" role="alert">{error}</div>}
        <form className="form-stack" onSubmit={submit}>
          <label className="admin-field-label">Email address
            <input className="form-field" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="admin-field-label">Password
            <input className="form-field" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <button className="button-primary" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in to dashboard"}</button>
        </form>
        <Link className="admin-back-link" href="/account">Customer? Go to customer sign in</Link>
      </section>
    </main>
  );
}
