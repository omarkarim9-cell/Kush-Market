"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

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
  city: string
  country: string
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
      fetch("/api/products").then(r => r.json()).catch(() => []),
      fetch("/api/orders").then(r => r.json()).catch(() => []),
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
    setMsg("")
    try {
      const res = await fetch("/api/products/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, name: p.name, description: p.description }),
      })
      const data = await res.json()
      if (res.ok && data.success) { 
        setMsg(`"${p.name}" translated to Arabic!`)
        fetchAll() 
      } else {
        setMsg(data.error || "Translation failed. Check ANTHROPIC_API_KEY in Vercel env vars.")
      }
    } catch (err) { 
      setMsg("Translation error. Check console for details.") 
      console.error(err)
    }
    setTranslating(null)
    setTimeout(() => setMsg(""), 5000)
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="bg-[#0B1D3A] text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[#E0B84A]">Admin Panel</h1>
          <Link href="/" className="text-sm text-white/70 hover:text-white">
            ← Back to Shop
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["products", "orders"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-6 py-2 rounded-lg border text-sm font-medium capitalize transition-colors"
              style={{
                background: tab === t ? "#0B1D3A" : "#fff",
                color: tab === t ? "#E0B84A" : "#6B7280",
                borderColor: tab === t ? "#0B1D3A" : "#E2DDD4",
              }}
            >
              {t} ({t === "products" ? products.length : orders.length})
            </button>
          ))}
        </div>

        {/* Message */}
        {msg && (
          <div className="mb-4 p-3 rounded-lg bg-[#ECFDF5] text-[#065F46] text-sm">
            {msg}
          </div>
        )}

        {loading ? (
          <p className="text-center py-12 text-[#6B7280]">Loading...</p>
        ) : tab === "products" ? (
          <>
            {/* Add Product Button */}
            <button
              onClick={openAdd}
              className="mb-6 px-4 py-2 bg-[#0B1D3A] text-[#E0B84A] rounded-lg text-sm font-medium hover:bg-[#142447]"
            >
              + Add Product
            </button>

            {/* Add/Edit Form Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <h2 className="text-lg font-semibold text-[#0B1D3A] mb-4">
                    {editProduct ? "Edit Product" : "Add New Product"}
                  </h2>
                  <div className="space-y-4">
                    {[
                      { label: "Product Name *", key: "name", type: "text", placeholder: "e.g. Study Planner" },
                      { label: "Description", key: "description", type: "text", placeholder: "Short description" },
                      { label: "Price (AED) *", key: "price", type: "number", placeholder: "e.g. 89" },
                      { label: "Image URL", key: "image_url", type: "text", placeholder: "https://..." },
                      { label: "Category", key: "category", type: "text", placeholder: "e.g. Stationery" },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-[#0B1D3A] mb-1">{field.label}</label>
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={(form as Record<string, string | number | boolean>)[field.key] as string | number}
                          onChange={e => setForm(f => ({ ...f, [field.key]: field.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value }))}
                          className="w-full border border-[#E2DDD4] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C49A3C] bg-[#FAF7F2]"
                        />
                      </div>
                    ))}
                    <label className="flex items-center gap-2 text-sm text-[#0B1D3A]">
                      <input
                        type="checkbox"
                        checked={form.in_stock}
                        onChange={e => setForm(f => ({ ...f, in_stock: e.target.checked }))}
                        className="w-4 h-4"
                      />
                      In Stock
                    </label>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-2 border border-[#E2DDD4] rounded-lg text-[#6B7280] hover:bg-[#FAF7F2]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveProduct}
                      disabled={saving}
                      className="flex-1 py-2 bg-[#0B1D3A] text-[#E0B84A] rounded-lg font-medium hover:bg-[#142447] disabled:opacity-50"
                    >
                      {saving ? "Saving..." : editProduct ? "Update" : "Add Product"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-[#E2DDD4] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#FAF7F2] border-b border-[#E2DDD4]">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-[#0B1D3A]">Name (EN)</th>
                      <th className="text-left px-4 py-3 font-medium text-[#0B1D3A]">Name (AR)</th>
                      <th className="text-left px-4 py-3 font-medium text-[#0B1D3A]">Category</th>
                      <th className="text-left px-4 py-3 font-medium text-[#0B1D3A]">Price</th>
                      <th className="text-left px-4 py-3 font-medium text-[#0B1D3A]">Stock</th>
                      <th className="text-left px-4 py-3 font-medium text-[#0B1D3A]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-b border-[#E2DDD4] last:border-b-0">
                        <td className="px-4 py-3">
                          <div className="font-medium text-[#0B1D3A]">{p.name}</div>
                          <div className="text-xs text-[#6B7280] truncate max-w-[200px]">{p.description}</div>
                        </td>
                        <td className="px-4 py-3">
                          {p.name_ar ? (
                            <div dir="rtl">
                              <div className="font-medium text-[#0B1D3A]">{p.name_ar}</div>
                              <div className="text-xs text-[#6B7280] truncate max-w-[200px]">{p.description_ar}</div>
                            </div>
                          ) : (
                            <span className="text-xs text-[#9CA3AF] italic">Not translated</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[#6B7280]">{p.category || "—"}</td>
                        <td className="px-4 py-3 text-[#0B1D3A] font-medium">AED {p.price}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${p.in_stock ? "bg-[#ECFDF5] text-[#065F46]" : "bg-[#FEF2F2] text-[#991B1B]"}`}>
                            {p.in_stock ? "In Stock" : "Out"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEdit(p)}
                              className="px-3 py-1 border border-[#E2DDD4] rounded text-xs text-[#0B1D3A] hover:bg-[#FAF7F2]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => translateProduct(p)}
                              disabled={translating === p.id}
                              className="px-3 py-1 rounded text-xs bg-[#EEF2FF] text-[#4338CA] hover:bg-[#E0E7FF] disabled:opacity-50 whitespace-nowrap"
                            >
                              {translating === p.id ? "Translating..." : p.name_ar ? "Re-translate" : "Translate AR"}
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="px-3 py-1 rounded text-xs bg-[#FEF2F2] text-[#991B1B] hover:bg-[#FEE2E2]"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-[#6B7280]">
                          No products yet. Click &quot;Add Product&quot; to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* Orders Table */
          <div className="bg-white rounded-xl border border-[#E2DDD4] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#FAF7F2] border-b border-[#E2DDD4]">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-[#0B1D3A]">Customer</th>
                    <th className="text-left px-4 py-3 font-medium text-[#0B1D3A]">Product</th>
                    <th className="text-left px-4 py-3 font-medium text-[#0B1D3A]">Payment</th>
                    <th className="text-left px-4 py-3 font-medium text-[#0B1D3A]">Qty</th>
                    <th className="text-left px-4 py-3 font-medium text-[#0B1D3A]">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-[#0B1D3A]">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-[#E2DDD4] last:border-b-0">
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#0B1D3A]">{o.full_name}</div>
                        <div className="text-xs text-[#6B7280]">{o.email}</div>
                        <div className="text-xs text-[#6B7280]">{o.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-[#0B1D3A]">{o.product_name}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{o.payment_method}</td>
                      <td className="px-4 py-3 text-[#0B1D3A]">{o.quantity}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-[#FEF3C7] text-[#92400E]">
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#6B7280]">
                        {new Date(o.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-[#6B7280]">
                        No orders yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
