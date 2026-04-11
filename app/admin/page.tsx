"use client"

import { useEffect, useState } from "react"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  category: string
  in_stock: boolean
  name_ar?: string
  description_ar?: string
}

interface Order {
  id: number
  full_name: string
  email: string
  phone: string
  product_name: string
  quantity: number
  payment_method: string
  delivery_address: string
  status: string
  created_at: string
}

const emptyProduct = { name: "", description: "", price: 0, image_url: "", category: "", in_stock: true }

export default function AdminPage() {
  const [tab, setTab] = useState<"products" | "orders">("products")
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyProduct)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")
  const [translating, setTranslating] = useState<number | null>(null)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [p, o] = await Promise.all([
      fetch("/api/products").then(r => r.json()),
      fetch("/api/orders").then(r => r.json()),
    ])
    setProducts(Array.isArray(p) ? p : [])
    setOrders(Array.isArray(o) ? o : [])
    setLoading(false)
  }

  function openAdd() { setEditProduct(null); setForm(emptyProduct); setShowForm(true) }
  function openEdit(p: Product) {
    setEditProduct(p)
    setForm({ name: p.name, description: p.description, price: p.price, image_url: p.image_url || "", category: p.category || "", in_stock: p.in_stock })
    setShowForm(true)
  }

  async function saveProduct() {
    setSaving(true)
    const url = editProduct ? `/api/products/${editProduct.id}` : "/api/products"
    const method = editProduct ? "PUT" : "POST"
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    if (res.ok) { setMsg(editProduct ? "Product updated!" : "Product added!"); setShowForm(false); fetchAll() }
    else setMsg("Error saving product.")
    setSaving(false)
    setTimeout(() => setMsg(""), 3000)
  }

  async function deleteProduct(id: number) {
    if (!confirm("Delete this product?")) return
    await fetch(`/api/products/${id}`, { method: "DELETE" })
    fetchAll()
  }

  async function translateProduct(p: Product) {
    setTranslating(p.id)
    try {
      const res = await fetch("/api/products/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, name: p.name, description: p.description }),
      })
      if (res.ok) { setMsg(`✓ "${p.name}" translated to Arabic!`); fetchAll() }
      else setMsg("Translation failed. Check ANTHROPIC_API_KEY in Vercel env vars.")
    } catch { setMsg("Translation error.") }
    setTranslating(null)
    setTimeout(() => setMsg(""), 4000)
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F2", fontFamily: "DM Sans, sans-serif" }}>
      <div style={{ background: "#0B1D3A", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="https://kush-edu.com/wp-content/uploads/2025/07/Ad-Kush-logo.jpg" alt="Kush" style={{ height: 36, borderRadius: 4 }} onError={(e) => (e.currentTarget.style.display = "none")} />
          <span style={{ color: "#E0B84A", fontFamily: "serif", fontSize: 18 }}>Admin Panel</span>
        </div>
        <a href="/" style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none" }}>← Back to Shop</a>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {(["products", "orders"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 24px", borderRadius: 8, border: "1px solid #E2DDD4", background: tab === t ? "#0B1D3A" : "#fff", color: tab === t ? "#E0B84A" : "#6B7280", fontWeight: 500, fontSize: 14, cursor: "pointer", textTransform: "capitalize" }}>
              {t} {t === "products" ? `(${products.length})` : `(${orders.length})`}
            </button>
          ))}
        </div>

        {msg && <div style={{ background: "#ECFDF5", border: "1px solid #6EE7B7", borderRadius: 8, padding: "10px 16px", marginBottom: 16, color: "#065F46", fontSize: 14 }}>{msg}</div>}

        {loading ? <div style={{ textAlign: "center", padding: "3rem", color: "#6B7280" }}>Loading...</div>
        : tab === "products" ? (
          <>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
              <button onClick={openAdd} style={{ background: "#C49A3C", color: "#0B1D3A", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>+ Add Product</button>
            </div>

            {showForm && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(11,29,58,0.5)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "100%", maxWidth: 500 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, color: "#0B1D3A", marginBottom: 20 }}>{editProduct ? "Edit Product" : "Add New Product"}</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { label: "Product Name *", key: "name", type: "text", placeholder: "e.g. Study Planner" },
                      { label: "Description", key: "description", type: "text", placeholder: "Short description" },
                      { label: "Price (AED) *", key: "price", type: "number", placeholder: "e.g. 89" },
                      { label: "Image URL", key: "image_url", type: "text", placeholder: "https://..." },
                      { label: "Category", key: "category", type: "text", placeholder: "e.g. Stationery" },
                    ].map(field => (
                      <div key={field.key}>
                        <label style={{ fontSize: 12, fontWeight: 500, color: "#0B1D3A", display: "block", marginBottom: 4 }}>{field.label}</label>
                        <input type={field.type} placeholder={field.placeholder}
                          value={(form as any)[field.key]}
                          onChange={e => setForm(f => ({ ...f, [field.key]: field.type === "number" ? parseFloat(e.target.value) : e.target.value }))}
                          style={{ width: "100%", border: "1px solid #E2DDD4", borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", background: "#FAF7F2", boxSizing: "border-box" }} />
                      </div>
                    ))}
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#0B1D3A", cursor: "pointer" }}>
                      <input type="checkbox" checked={form.in_stock} onChange={e => setForm(f => ({ ...f, in_stock: e.target.checked }))} />
                      In Stock
                    </label>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                    <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: "10px", border: "1px solid #E2DDD4", borderRadius: 8, background: "#fff", color: "#6B7280", cursor: "pointer", fontSize: 14 }}>Cancel</button>
                    <button onClick={saveProduct} disabled={saving} style={{ flex: 1, padding: "10px", border: "none", borderRadius: 8, background: "#C49A3C", color: "#0B1D3A", fontWeight: 500, cursor: "pointer", fontSize: 14 }}>
                      {saving ? "Saving..." : editProduct ? "Update" : "Add Product"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ background: "#fff", border: "1px solid #E2DDD4", borderRadius: 14, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "#0B1D3A", color: "#E0B84A" }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500 }}>Name (EN)</th>
                    <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 500 }}>الاسم (AR)</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500 }}>Category</th>
                    <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 500 }}>Price</th>
                    <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 500 }}>Stock</th>
                    <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 500 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={p.id} style={{ borderTop: "1px solid #F4F1EB", background: i % 2 === 0 ? "#fff" : "#FAF7F2" }}>
                      <td style={{ padding: "12px 16px", color: "#0B1D3A", fontWeight: 500 }}>
                        {p.name}
                        <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 400 }}>{p.description?.substring(0, 45)}...</div>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        {p.name_ar ? (
                          <div dir="rtl">
                            <div style={{ fontSize: 13, color: "#0B1D3A" }}>{p.name_ar}</div>
                            <div style={{ fontSize: 11, color: "#6B7280" }}>{p.description_ar?.substring(0, 35)}...</div>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: "#9CA3AF", fontStyle: "italic" }}>Not translated</span>
                        )}
                      </td>
                      <td style={{ padding: "12px 16px", color: "#6B7280" }}>{p.category || "—"}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", color: "#0B1D3A", fontWeight: 500 }}>AED {p.price}</td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <span style={{ background: p.in_stock ? "#ECFDF5" : "#FEF2F2", color: p.in_stock ? "#065F46" : "#991B1B", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
                          {p.in_stock ? "In Stock" : "Out"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
                          <button onClick={() => openEdit(p)} style={{ padding: "5px 10px", border: "1px solid #E2DDD4", borderRadius: 6, background: "#fff", color: "#0B1D3A", fontSize: 12, cursor: "pointer" }}>Edit</button>
                          <button onClick={() => translateProduct(p)} disabled={translating === p.id}
                            style={{ padding: "5px 10px", border: "none", borderRadius: 6, background: translating === p.id ? "#E2DDD4" : "#EEF2FF", color: "#4338CA", fontSize: 12, cursor: translating === p.id ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
                            {translating === p.id ? "Translating..." : p.name_ar ? "🔄 Re-translate" : "🌐 Translate AR"}
                          </button>
                          <button onClick={() => deleteProduct(p.id)} style={{ padding: "5px 10px", border: "none", borderRadius: 6, background: "#FEF2F2", color: "#991B1B", fontSize: 12, cursor: "pointer" }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#6B7280" }}>No products yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div style={{ background: "#fff", border: "1px solid #E2DDD4", borderRadius: 14, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#0B1D3A", color: "#E0B84A" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500 }}>Customer</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500 }}>Product</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500 }}>Payment</th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 500 }}>Qty</th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 500 }}>Status</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500 }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={o.id} style={{ borderTop: "1px solid #F4F1EB", background: i % 2 === 0 ? "#fff" : "#FAF7F2" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: 500, color: "#0B1D3A" }}>{o.full_name}</div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>{o.email}</div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>{o.phone}</div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#0B1D3A" }}>{o.product_name}</td>
                    <td style={{ padding: "12px 16px", color: "#6B7280" }}>{o.payment_method}</td>
                    <td style={{ padding: "12px 16px", textAlign: "center", color: "#0B1D3A" }}>{o.quantity}</td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <span style={{ background: o.status === "confirmed" ? "#ECFDF5" : o.status === "pending" ? "#FFFBEB" : "#FEF2F2", color: o.status === "confirmed" ? "#065F46" : o.status === "pending" ? "#92400E" : "#991B1B", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{o.status}</span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: 12 }}>{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#6B7280" }}>No orders yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
