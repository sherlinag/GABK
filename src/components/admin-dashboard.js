"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const STATUSES = ["pending", "confirmed", "preparing", "ready_for_pickup", "out_for_delivery", "delivered", "cancelled"];

function formatPrice(paise) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(paise / 100);
}

function dateLabel(date) {
  return new Date(date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function isNextStatusAllowed(current, next) {
  const transitions = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["preparing", "cancelled"],
    preparing: ["ready_for_pickup", "out_for_delivery", "cancelled"],
    ready_for_pickup: ["delivered", "cancelled"],
    out_for_delivery: ["delivered", "cancelled"],
    delivered: [],
    cancelled: []
  };
  return transitions[current]?.includes(next);
}

function OrderStatusControl({ order, onChange }) {
  const nextStatuses = STATUSES.filter((status) => isNextStatusAllowed(order.status, status));
  if (!nextStatuses.length) return <span className="table-muted">Complete</span>;

  return (
    <select
      className="admin-filter"
      aria-label={`Update status for ${order.orderNumber}`}
      value=""
      onChange={(event) => onChange(order, event.target.value)}
    >
      <option value="">Update status</option>
      {nextStatuses.map((status) => (
        <option key={status} value={status}>{status.replaceAll("_", " ")}</option>
      ))}
    </select>
  );
}

function AdminShell({ children, section, onLogout }) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link className="brand admin-brand" href="/admin">
          <span className="brand-mark">G</span>
          <span><span className="brand-name">G Arasu</span><span className="brand-sub">Bakery admin</span></span>
        </Link>
        <div className="admin-nav-label">MANAGEMENT</div>
        <nav className="admin-nav" aria-label="Admin dashboard navigation">
          <Link className={section === "overview" ? "active" : ""} href="/admin">▦ &nbsp; Overview</Link>
          <a className={section === "orders" ? "active" : ""} href="#orders">▤ &nbsp; Orders</a>
          <a className={section === "products" ? "active" : ""} href="#products">◇ &nbsp; Products</a>
          <Link href="/admin/login">↪ &nbsp; Admin sign in</Link>
        </nav>
        <div className="admin-sidebar-bottom">
          <Link href="/">← &nbsp; View storefront</Link>
          <button type="button" onClick={onLogout}>↗ &nbsp; Sign out</button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar">
          <div><span className="admin-top-label">G ARASU BAKERY</span><strong>Store management</strong></div>
          <button className="admin-logout-mobile" type="button" onClick={onLogout}>Sign out</button>
        </header>
        {children}
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [productBusy, setProductBusy] = useState(false);
  const [editingProductId, setEditingProductId] = useState("");
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    isDemo: false
  });

  const adminFetch = useCallback(async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${token}`,
        ...options.headers
      }
    });
    const result = await response.json();
    if (response.status === 401 || response.status === 403) {
      window.sessionStorage.removeItem("g-arasu-admin-token");
      router.replace("/admin/login");
      throw new Error("Admin session expired. Please sign in again.");
    }
    if (!response.ok || !result.success) {
      throw new Error(result.error?.message || "Admin request failed.");
    }
    return result.data;
  }, [router, token]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [productData, orderData, categoryResponse] = await Promise.all([
        adminFetch("/api/admin/products"),
        adminFetch("/api/admin/orders?limit=100"),
        fetch("/api/categories")
      ]);
      const categoryData = await categoryResponse.json();
      if (!categoryResponse.ok || !categoryData.success) {
        throw new Error(categoryData.error?.message || "Could not load categories.");
      }
      setProducts(productData.products);
      setOrders(orderData.orders);
      setCategories(categoryData.data.categories);
    } catch (requestError) {
      setError(requestError.message || "Could not load the dashboard.");
    } finally {
      setLoading(false);
    }
  }, [adminFetch, filterStatus]);

  useEffect(() => {
    const storedToken = window.sessionStorage.getItem("g-arasu-admin-token") || "";
    if (!storedToken) {
      router.replace("/admin/login");
      setAuthChecked(true);
      return;
    }
    setToken(storedToken);
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${storedToken}` } })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success || result.data.user.role !== "admin") {
          window.sessionStorage.removeItem("g-arasu-admin-token");
          router.replace("/admin/login");
          return;
        }
        setAuthChecked(true);
      })
      .catch(() => {
        setError("Could not verify the administrator session.");
        setAuthChecked(true);
      });
  }, [router]);

  useEffect(() => {
    if (token && authChecked) loadDashboard();
  }, [token, authChecked, loadDashboard]);

  const metrics = useMemo(() => {
    const validOrders = orders.filter((order) => order.status !== "cancelled");
    return {
      orders: orders.length,
      pending: orders.filter((order) => order.status === "pending").length,
      products: products.filter((product) => !product.isDemo).length,
      demo: products.filter((product) => product.isDemo).length,
      revenuePaise: validOrders.reduce((sum, order) => sum + (order.paymentStatus === "paid" ? order.totalPaise : 0), 0),
      lowStock: products.filter((product) => !product.isDemo && product.stock <= 5).length
    };
  }, [orders, products]);
  const visibleOrders = useMemo(
    () => filterStatus ? orders.filter((order) => order.status === filterStatus) : orders,
    [filterStatus, orders]
  );
  const visibleProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) =>
      `${product.name} ${product.category?.name || ""}`.toLowerCase().includes(query)
    );
  }, [productSearch, products]);

  function logout() {
    window.sessionStorage.removeItem("g-arasu-admin-token");
    router.replace("/admin/login");
  }

  async function updateOrder(order, status) {
    setError("");
    setNotice("");
    try {
      await adminFetch(`/api/admin/orders/${order._id}`, {
        method: "PATCH",
        body: JSON.stringify({ status, note: `Updated from admin dashboard` })
      });
      setNotice(`Order ${order.orderNumber} updated to ${status.replaceAll("_", " ")}.`);
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function updateProductField(event) {
    const { name, value, type, checked } = event.target;
    setProductForm((current) => {
      if (type === "checkbox") return { ...current, [name]: checked };
      if (name === "name" && !current.slug) {
        const slug = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        return { ...current, name: value, slug };
      }
      return { ...current, [name]: value };
    });
  }

  function startCreateProduct() {
    setEditingProductId("");
    setProductForm({
      name: "",
      slug: "",
      description: "",
      category: "",
      price: "",
      stock: "",
      image: "",
      isDemo: false
    });
    setProductFormOpen(true);
    document.getElementById("product-form")?.scrollIntoView({ behavior: "smooth" });
  }

  function startEditProduct(product) {
    setEditingProductId(product._id);
    setProductForm({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      category: product.category?._id || "",
      price: String((product.pricePaise / 100).toFixed(2)),
      stock: String(product.stock),
      image: product.images?.[0] || "",
      isDemo: product.isDemo
    });
    setProductFormOpen(true);
    window.setTimeout(() => document.getElementById("product-form")?.scrollIntoView({ behavior: "smooth" }), 0);
  }

  async function createProduct(event) {
    event.preventDefault();
    setProductBusy(true);
    setError("");
    setNotice("");
    try {
      const updatingDemo = editingProductId && productForm.isDemo === false;
      await adminFetch(editingProductId
        ? `/api/admin/products/${editingProductId}`
        : "/api/admin/products", {
        method: editingProductId ? "PATCH" : "POST",
        body: JSON.stringify({
          name: productForm.name,
          slug: productForm.slug,
          description: productForm.description,
          category: productForm.category,
          pricePaise: Math.round(Number(productForm.price) * 100),
          stock: Number(productForm.stock),
          images: productForm.image ? [productForm.image] : [],
          isAvailable: true,
          isFeatured: editingProductId
            ? products.find((product) => product._id === editingProductId)?.isFeatured || false
            : false,
          isDemo: productForm.isDemo
        })
      });
      setNotice(updatingDemo
        ? "Sample product published with the verified price and stock you entered."
        : editingProductId ? "Product details updated." : "Product added to the catalog.");
      setProductForm({ name: "", slug: "", description: "", category: "", price: "", stock: "", image: "", isDemo: false });
      setEditingProductId("");
      setProductFormOpen(false);
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setProductBusy(false);
    }
  }

  async function deleteProduct(product) {
    if (!window.confirm(`Remove ${product.name} from the customer catalog?`)) return;
    setError("");
    setNotice("");
    try {
      await adminFetch(`/api/admin/products/${product._id}`, { method: "DELETE" });
      setNotice(`${product.name} removed from the customer catalog.`);
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (!authChecked || !token) {
    return <main className="admin-loading"><span className="admin-spinner" />Checking admin access…</main>;
  }

  return (
    <AdminShell section="overview" onLogout={logout}>
      <div className="admin-content">
        <div className="admin-page-heading">
          <div><div className="eyebrow">Good day, bakery team</div><h1>Dashboard overview</h1><p>Manage your products and keep orders moving.</p></div>
          <button className="button-primary" type="button" onClick={startCreateProduct}>＋ Add product</button>
        </div>
        {error && <p className="form-error admin-feedback" role="alert">{error}</p>}
        {notice && <p className="form-success admin-feedback" role="status">{notice}</p>}

        {productFormOpen && (
          <section className="admin-panel" id="product-form">
            <div className="admin-panel-heading"><div><h2>{editingProductId ? "Edit product" : "Add a product"}</h2><p>{productForm.isDemo ? "This is a sample listing. Confirm product details before publishing." : "Enter verified store details."}</p></div><button className="text-button" type="button" onClick={() => { setProductFormOpen(false); setEditingProductId(""); }}>Close</button></div>
            <form className="admin-product-form" onSubmit={createProduct}>
              <label>Product name<input className="form-field" name="name" required minLength={2} maxLength={120} value={productForm.name} onChange={updateProductField} /></label>
              <label>URL slug<input className="form-field" name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={productForm.slug} onChange={updateProductField} /></label>
              <label>Category<select className="form-field" name="category" required value={productForm.category} onChange={updateProductField}><option value="">Select category</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select></label>
              <label>Price (₹)<input className="form-field" name="price" type="number" min="0.01" step="0.01" required value={productForm.price} onChange={updateProductField} /></label>
              <label>Stock quantity<input className="form-field" name="stock" type="number" min="0" step="1" required value={productForm.stock} onChange={updateProductField} /></label>
              <label>Image URL or local path<input className="form-field" name="image" type="text" maxLength="2048" placeholder="https://… or /images/products/…" value={productForm.image} onChange={updateProductField} /></label>
              <label className="admin-form-wide">Description<textarea className="form-field" name="description" rows="3" maxLength="2000" value={productForm.description} onChange={updateProductField} /></label>
              {editingProductId && (
                <label className="admin-demo-toggle admin-form-wide">
                  <input type="checkbox" name="isDemo" checked={productForm.isDemo} onChange={updateProductField} />
                  Keep as sample / preview only (uncheck only after verifying its price and stock)
                </label>
              )}
              <div className="admin-form-wide"><button className="button-primary" type="submit" disabled={productBusy}>{productBusy ? "Saving…" : editingProductId ? "Save changes" : "Add product"}</button></div>
            </form>
          </section>
        )}

        {loading ? <div className="admin-panel">Loading store data…</div> : (
          <>
            <section className="admin-metrics" aria-label="Store overview">
              <article><span>Recent orders</span><strong>{metrics.orders}</strong><small>Latest 100 orders loaded</small></article>
              <article><span>Awaiting confirmation</span><strong>{metrics.pending}</strong><small>Orders needing attention</small></article>
              <article><span>Active products</span><strong>{metrics.products}</strong><small>{metrics.demo} sample items excluded</small></article>
              <article><span>Low stock</span><strong>{metrics.lowStock}</strong><small>Five or fewer in stock</small></article>
              <article><span>Paid sales</span><strong>{formatPrice(metrics.revenuePaise)}</strong><small>Verified paid orders only</small></article>
            </section>

            <section className="admin-panel" id="orders">
              <div className="admin-panel-heading">
                <div><h2>Recent orders</h2><p>Update an order to move it through preparation and fulfilment.</p></div>
                <select className="admin-filter" aria-label="Filter orders by status" value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
                  <option value="">All statuses</option>
                  {STATUSES.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
                </select>
              </div>
              {visibleOrders.length === 0 ? (
                <div className="admin-empty">
                  <span className="admin-empty-icon" aria-hidden="true">🧾</span>
                  <strong>{filterStatus ? "No orders with this status" : "No orders yet"}</strong>
                  <span>{filterStatus ? "Choose another status to see more orders." : "New customer orders will appear here."}</span>
                </div>
              ) : (
                <>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Update</th></tr></thead>
                    <tbody>{visibleOrders.map((order) => (
                      <tr key={order._id}>
                        <td><strong>{order.orderNumber}</strong><small>{dateLabel(order.createdAt)}</small></td>
                        <td>{order.customer?.name || "Customer"}<small>{order.customer?.phone || order.customer?.email || ""}</small></td>
                        <td>{order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}</td>
                        <td>{formatPrice(order.totalPaise)}<small>{order.paymentMethod.toUpperCase()} · {order.paymentStatus}</small></td>
                        <td><span className={`status-pill status-${order.status}`}>{order.status.replaceAll("_", " ")}</span></td>
                        <td><OrderStatusControl order={order} onChange={updateOrder} /></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
                <div className="admin-orders-cards">
                  {visibleOrders.map((order) => (
                    <article className="admin-order-card" key={order._id}>
                      <div className="admin-order-card-heading">
                        <div><strong>{order.orderNumber}</strong><small>{dateLabel(order.createdAt)}</small></div>
                        <span className={`status-pill status-${order.status}`}>{order.status.replaceAll("_", " ")}</span>
                      </div>
                      <div className="admin-order-customer">
                        <strong>{order.customer?.name || "Customer"}</strong>
                        <span>{order.customer?.phone || order.customer?.email || "Contact not provided"}</span>
                      </div>
                      <p className="admin-order-items">{order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}</p>
                      <div className="admin-order-card-footer">
                        <strong>{formatPrice(order.totalPaise)}</strong>
                        <OrderStatusControl order={order} onChange={updateOrder} />
                      </div>
                    </article>
                  ))}
                </div>
                </>
              )}
            </section>

            <section className="admin-panel" id="products">
              <div className="admin-panel-heading admin-products-heading">
                <div><h2>Product catalog</h2><p>Sample entries are not available for customer checkout until verified.</p></div>
                <div className="admin-product-tools">
                  <label className="admin-search-label">
                    <span className="sr-only">Search products</span>
                    <input className="admin-search" type="search" placeholder="Search products…" value={productSearch} onChange={(event) => setProductSearch(event.target.value)} />
                  </label>
                  <span className="admin-count">{visibleProducts.length} of {products.length} items</span>
                </div>
              </div>
              <div className="admin-product-list">
                {visibleProducts.length ? visibleProducts.map((product) => (
                  <article className="admin-product-row" key={product._id}>
                    <div className="admin-product-thumb">{product.images?.[0] ? <img src={product.images[0]} alt="" /> : <span>🥮</span>}</div>
                    <div className="admin-product-name"><strong>{product.name}</strong><span>{product.category?.name || "Uncategorized"} {product.isDemo && <em>Sample</em>}</span></div>
                    <span className="admin-stock">{product.isDemo ? "Preview only" : `${product.stock} in stock`}</span>
                    <span className="admin-price">{product.isDemo ? "Unverified" : formatPrice(product.pricePaise)}</span>
                    <div className="admin-row-actions">
                      <button className="admin-edit-button" type="button" onClick={() => startEditProduct(product)} aria-label={`Edit ${product.name}`} title="Edit product">Edit</button>
                      <button className="admin-delete-button" type="button" onClick={() => deleteProduct(product)} aria-label={`Remove ${product.name}`} title="Remove product">×</button>
                    </div>
                  </article>
                )) : <div className="admin-empty">{products.length ? "No products match your search." : "No products in the catalog yet. Add your first product to get started."}</div>}
              </div>
            </section>
          </>
        )}
      </div>
    </AdminShell>
  );
}
