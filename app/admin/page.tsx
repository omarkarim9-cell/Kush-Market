"use client"

import { useEffect, useState, useRef, useMemo } from "react"

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

interface CSVRow {
  name: string
  description: string
  price: string
  category: string
  image_url: string
  in_stock: string
}

const emptyProduct = { name: "", description: "", price: 0, image_url: "", category: "", in_stock: true }
const REQUIRED_COLUMNS = ["name", "price"]
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "kush2024"

type SortKey = "name" | "category" | "price" | "in_stock"
type SortDir = "asc" | "desc"

export default function AdminPage() {
  // ── Auth ──────────────────────────────────────────────────────────
  const [authed, setAuthed] = useState(false)
  const [pwInput, setPwInput] = useState("")
  const [pwError, setPwError] = useState("")

  useEffect(() => {
    if (sessionStorage.getItem("admin_authed") === "yes") setAuthed(true)
  }, [])

  function login() {
    if (pwInput === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authed", "yes")
      setAuthed(true); setPwError("")
    } else {
      setPwError("Incorrect password. Try again.")
    }
  }

  function logout() {
    sessionStorage.removeItem("admin_authed")
    setAuthed(false); setPwInput("")
  }

  // ── Data ──────────────────────────────────────────────────────────
  const [tab, setTab] = useState<"products" | "orders" | "import">("products")
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyProduct)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")
  const [msgType, setMsgType] = useState<"success" | "error">("success")
  const [translating, setTranslating] = useState<number | null>(null)
  const [bulkTranslating, setBulkTranslating] = useState(false)
  const [bulkProgress, setBulkProgress] = useState("")

  // ── Search & Sort ─────────────────────────────────────────────────
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortDir, setSortDir] = useState<SortDir>("asc")

  // ── Bulk Import ───────────────────────────────────────────────────
  const [csvRows, setCsvRows] = useState<CSVRow[]>([])
  const [csvError, setCsvError] = useState("")
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number; errors: string[] } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (authed) fetchAll() }, [authed])

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

  function showMsg(text: string, type: "success" | "error" = "success") {
    setMsg(text); setMsgType(type)
    setTimeout(() => setMsg(""), 4000)
  }

  // ── Filtered + Sorted ─────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.name_ar || "").includes(search)
    )
    list = [...list].sort((a, b) => {
      let av: any = a[sortKey], bv: any = b[sortKey]
      if (sortKey === "price") { av = Number(av); bv = Number(bv) }
      if (typeof av === "string") av = av.toLowerCase()
      if (typeof bv === "string") bv = bv.toLowerCase()
      if (av < bv) return sortDir === "asc" ? -1 : 1
      if (av > bv) return sortDir === "asc" ? 1 : -1
      return 0
    })
    return list
  }, [products, search, sortKey, sortDir])

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("asc") }
  }

  function sortIcon(key: SortKey) {
    if (sortKey !== key) return " ↕"
    return sortDir === "asc" ? " ↑" : " ↓"
  }

  // ── CRUD ──────────────────────────────────────────────────────────
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
    if (res.ok) { showMsg(editProduct ? "Product updated!" : "Product added!"); setShowForm(false); fetchAll() }
    else showMsg("Error saving product.", "error")
    setSaving(false)
  }

  async function deleteProduct(id: number) {
    if (!confirm("Delete this product?")) return
    await fetch(`/api/products/${id}`, { method: "DELETE" })
    fetchAll()
  }

  // ── Translate single product ──────────────────────────────────────
  async function translateProduct(p: Product) {
    setTranslating(p.id)
    try {
      const res = await fetch("/api/products/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, name: p.name, description: p.description }),
      })
      if (res.ok) { showMsg(`✓ "${p.name}" translated to Arabic!`); fetchAll() }
      else showMsg("Translation failed.", "error")
    } catch { showMsg("Translation error.", "error") }
    setTranslating(null)
  }

  // ── Bulk translate — ONLY products with no Arabic yet ─────────────
  async function bulkTranslate() {
    const untranslated = products.filter(p => !p.name_ar)
    if (untranslated.length === 0) {
      showMsg("✓ All products are already translated!")
      return
    }
    if (!confirm(`Translate ${untranslated.length} untranslated products to Arabic?`)) return
    setBulkTranslating(true)
    let done = 0
    for (const p of untranslated) {
      setBulkProgress(`Translating... ${done + 1}/${untranslated.length}`)
      try {
        const res = await fetch("/api/products/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: p.id, name: p.name, description: p.description }),
        })
        if (res.ok) done++
      } catch { /* continue on error */ }
    }
    setBulkTranslating(false)
    setBulkProgress("")
    showMsg(`✓ Translated ${done} of ${untranslated.length} products!`)
    fetchAll()
  }

  // ── CSV ───────────────────────────────────────────────────────────
  function parseCSV(text: string): CSVRow[] {
    const lines = text.trim().split("\n").map(l => l.trim()).filter(Boolean)
    if (lines.length < 2) throw new Error("CSV must have a header row and at least one product row")
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/[^a-z_]/g, ""))
    const missing = REQUIRED_COLUMNS.filter(c => !headers.includes(c))
    if (missing.length > 0) throw new Error(`Missing required columns: ${missing.join(", ")}`)
    return lines.slice(1).map(line => {
      const cols: string[] = []
      let current = "", inQuotes = false
      for (const ch of line) {
        if (ch === '"') { inQuotes = !inQuotes }
        else if (ch === "," && !inQuotes) { cols.push(current.trim()); current = "" }
        else current += ch
      }
      cols.push(current.trim())
      const row: any = {}
      headers.forEach((h, i) => { row[h] = cols[i] || "" })
      return row as CSVRow
    })
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setCsvError(""); setCsvRows([]); setImportResult(null)
    const reader = new FileReader()
    reader.onload = ev => {
      try { setCsvRows(parseCSV(ev.target?.result as string)) }
      catch (err: any) { setCsvError(err.message) }
    }
    reader.readAsText(file)
  }

  function handlePasteCSV(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setCsvError(""); setCsvRows([]); setImportResult(null)
    try { if (e.target.value.trim()) setCsvRows(parseCSV(e.target.value)) }
    catch (err: any) { setCsvError(err.message) }
  }

  async function runImport() {
    if (csvRows.length === 0) return
    setImporting(true); setImportResult(null)
    try {
      const res = await fetch("/api/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: csvRows }),
      })
      const data = await res.json()
      setImportResult(data)
      if (data.imported > 0) { fetchAll(); setCsvRows([]) }
    } catch { setImportResult({ imported: 0, skipped: 0, errors: ["Network error"] }) }
    setImporting(false)
  }

  const untranslatedCount = products.filter(p => !p.name_ar).length

  const s = {
    th: (key?: SortKey) => ({
      padding: "12px 16px", textAlign: "left" as const, fontWeight: 500,
      cursor: key ? "pointer" : "default", userSelect: "none" as const, whiteSpace: "nowrap" as const,
    }),
    td: { padding: "12px 16px" },
    btn: (bg: string, color: string, extra?: object) => ({
      padding: "5px 10px", border: "none", borderRadius: 6, background: bg,
      color, fontSize: 12, cursor: "pointer" as const, whiteSpace: "nowrap" as const, ...extra
    }),
  }

  // ── Login ─────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#FAF7F2", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 40, width: "100%", maxWidth: 380, boxShadow: "0 8px 40px rgba(11,29,58,0.12)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <img src="https://kush-edu.com/wp-content/uploads/2025/07/Ad-Kush-logo.jpg" alt="Kush" style={{ height: 48, borderRadius: 6, marginBottom: 12 }} onError={(e) => (e.currentTarget.style.display = "none")} />
            <div style={{ fontSize: 20, fontWeight: 700, color: "#0B1D3A" }}>Admin Panel</div>
            <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Enter your password to continue</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#0B1D3A", display: "block", marginBottom: 6 }}>Password</label>
            <input type="password" value={pwInput}
              onChange={e => setPwInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
              placeholder="Enter admin password"
              style={{ width: "100%", border: "1px solid #E2DDD4", borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none", background: "#FAF7F2", boxSizing: "border-box" }} />
          </div>
          {pwError && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "8px 12px", color: "#991B1B", fontSize: 13, marginBottom: 12 }}>{pwError}</div>}
          <button onClick={login} style={{ width: "100%", background: "#C49A3C", color: "#0B1D3A", border: "none", padding: "12px", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Login →</button>
          <div style={{ marginTop: 16, fontSize: 12, color: "#9CA3AF", textAlign: "center" }}>Set password via NEXT_PUBLIC_ADMIN_PASSWORD in Vercel env vars</div>
        </div>
      </div>
    )
  }

  // ── Main UI ───────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F2", fontFamily: "DM Sans, sans-serif" }}>
      <div style={{ background: "#0B1D3A", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="https://kush-edu.com/wp-content/uploads/2025/07/Ad-Kush-logo.jpg" alt="Kush" style={{ height: 36, borderRadius: 4 }} onError={(e) => (e.currentTarget.style.display = "none")} />
          <span style={{ color: "#E0B84A", fontFamily: "serif", fontSize: 18 }}>Admin Panel</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none" }}>← Back to Shop</a>
          <button onClick={logout} style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", padding: "6px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {(["products", "orders", "import"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 24px", borderRadius: 8, border: "1px solid #E2DDD4", background: tab === t ? "#0B1D3A" : "#fff", color: tab === t ? "#E0B84A" : "#6B7280", fontWeight: 500, fontSize: 14, cursor: "pointer", textTransform: "capitalize" }}>
              {t === "import" ? "📥 Bulk Import" : t} {t === "products" ? `(${products.length})` : t === "orders" ? `(${orders.length})` : ""}
            </button>
          ))}
        </div>

        {msg && <div style={{ background: msgType === "success" ? "#ECFDF5" : "#FEF2F2", border: `1px solid ${msgType === "success" ? "#6EE7B7" : "#FECACA"}`, borderRadius: 8, padding: "10px 16px", marginBottom: 16, color: msgType === "success" ? "#065F46" : "#991B1B", fontSize: 14 }}>{msg}</div>}

        {loading && tab !== "import" ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#6B7280" }}>Loading...</div>

        ) : tab === "import" ? (
          /* ── BULK IMPORT TAB ── */
          <div>
            <div style={{ background: "#fff", border: "1px solid #E2DDD4", borderRadius: 14, padding: 28, marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 600, color: "#0B1D3A", marginBottom: 16 }}>📥 Bulk Import Products</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                <div style={{ background: "#F0F4FF", border: "1px solid #C7D5F5", borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1E40AF", marginBottom: 8 }}>📄 From PDF Catalogue</div>
                  <ol style={{ fontSize: 12, color: "#374151", lineHeight: 1.8, paddingLeft: 16, margin: 0 }}>
                    <li>Open PDF → select all text → copy</li>
                    <li>Paste into <strong>Google Sheets</strong> or Excel</li>
                    <li>Organize into columns below</li>
                    <li>File → Download → CSV</li>
                    <li>Upload here ✅</li>
                  </ol>
                </div>
                <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#92400E", marginBottom: 8 }}>📋 Required CSV Format</div>
                  <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.8 }}>
                    <strong>Required:</strong> name, price<br />
                    <strong>Optional:</strong> description, category, image_url, in_stock<br /><br />
                    <code style={{ background: "#FEF3C7", padding: "4px 8px", borderRadius: 4, fontSize: 11, display: "block" }}>
                      name,price,category<br />Solar Fan,149,Solar<br />Garden Light,89,Solar Lights
                    </code>
                  </div>
                </div>
              </div>
              <a href="data:text/csv;charset=utf-8,name,price,description,category,image_url,in_stock%0AProduct Name,99,Description,Category,https://image.jpg,true" download="kush-products-template.csv"
                style={{ display: "inline-block", background: "#0B1D3A", color: "#E0B84A", padding: "8px 18px", borderRadius: 8, fontSize: 13, textDecoration: "none", marginBottom: 20 }}>
                ⬇ Download CSV Template
              </a>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#0B1D3A", display: "block", marginBottom: 8 }}>Upload CSV File</label>
                <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleFileUpload}
                  style={{ border: "1px solid #E2DDD4", borderRadius: 8, padding: "8px 12px", fontSize: 13, width: "100%", background: "#FAF7F2", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#0B1D3A", display: "block", marginBottom: 8 }}>Or Paste CSV Text</label>
                <textarea placeholder={"name,price,description,category\nSolar Fan,149,Solar powered fan,Solar"} onChange={handlePasteCSV}
                  style={{ width: "100%", border: "1px solid #E2DDD4", borderRadius: 8, padding: "10px 12px", fontSize: 12, fontFamily: "monospace", minHeight: 120, outline: "none", background: "#FAF7F2", boxSizing: "border-box", resize: "vertical" }} />
              </div>
              {csvError && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", color: "#991B1B", fontSize: 13 }}>❌ {csvError}</div>}
            </div>

            {csvRows.length > 0 && (
              <div style={{ background: "#fff", border: "1px solid #E2DDD4", borderRadius: 14, padding: 24, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0B1D3A" }}>Preview — {csvRows.length} products</h3>
                  <button onClick={runImport} disabled={importing} style={{ background: "#C49A3C", color: "#0B1D3A", border: "none", padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                    {importing ? "Importing..." : `Import ${csvRows.length} Products →`}
                  </button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead><tr style={{ background: "#F4F1EB" }}>
                      <th style={s.th()}>#</th><th style={s.th()}>Name</th><th style={s.th()}>Price</th><th style={s.th()}>Category</th><th style={s.th()}>Description</th>
                    </tr></thead>
                    <tbody>
                      {csvRows.map((row, i) => (
                        <tr key={i} style={{ borderTop: "1px solid #F4F1EB" }}>
                          <td style={{ ...s.td, color: "#6B7280" }}>{i + 1}</td>
                          <td style={{ ...s.td, fontWeight: 500, color: row.name ? "#0B1D3A" : "#DC2626" }}>{row.name || "⚠ Missing"}</td>
                          <td style={{ ...s.td, color: row.price ? "#0B1D3A" : "#DC2626" }}>{row.price || "⚠ Missing"}</td>
                          <td style={{ ...s.td, color: "#6B7280" }}>{row.category || "—"}</td>
                          <td style={{ ...s.td, color: "#6B7280" }}>{row.description?.substring(0, 50) || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {importResult && (
              <div style={{ background: importResult.imported > 0 ? "#ECFDF5" : "#FEF2F2", border: `1px solid ${importResult.imported > 0 ? "#6EE7B7" : "#FECACA"}`, borderRadius: 10, padding: "16px 20px" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: importResult.imported > 0 ? "#065F46" : "#991B1B" }}>
                  {importResult.imported > 0 ? `✅ Imported ${importResult.imported} products!` : "❌ Import failed"}
                </div>
                {importResult.skipped > 0 && <div style={{ fontSize: 13, color: "#92400E" }}>⚠ {importResult.skipped} rows skipped</div>}
                {importResult.errors?.map((e, i) => <div key={i} style={{ fontSize: 12, color: "#991B1B" }}>{e}</div>)}
              </div>
            )}
          </div>

        ) : tab === "products" ? (
          /* ── PRODUCTS TAB ── */
          <>
            {/* Toolbar */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
              <input type="text" placeholder="🔍 Search products..." value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ flex: 1, minWidth: 200, border: "1px solid #E2DDD4", borderRadius: 8, padding: "9px 14px", fontSize: 14, outline: "none", background: "#fff" }} />

              {/* Bulk translate — only untranslated, shows count */}
              <button onClick={bulkTranslate} disabled={bulkTranslating || untranslatedCount === 0}
                style={{ ...s.btn("#EEF2FF", "#4338CA"), padding: "9px 16px", fontSize: 13, opacity: untranslatedCount === 0 ? 0.5 : 1 }}>
                {bulkTranslating
                  ? bulkProgress || "Translating..."
                  : untranslatedCount === 0
                  ? "🌐 All Translated"
                  : `🌐 Translate Untranslated (${untranslatedCount})`}
              </button>
              <button onClick={() => setTab("import")} style={{ ...s.btn("#F4F1EB", "#0B1D3A"), padding: "9px 16px", fontSize: 13 }}>📥 Bulk Import</button>
              <button onClick={openAdd} style={{ background: "#C49A3C", color: "#0B1D3A", border: "none", padding: "9px 20px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>+ Add Product</button>
            </div>

            {/* Form Modal */}
            {showForm && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(11,29,58,0.5)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "100%", maxWidth: 500 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, color: "#0B1D3A", marginBottom: 20 }}>{editProduct ? "Edit Product" : "Add New Product"}</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { label: "Product Name *", key: "name", type: "text", placeholder: "e.g. Solar Fan" },
                      { label: "Description", key: "description", type: "text", placeholder: "Short description" },
                      { label: "Price (AED) *", key: "price", type: "number", placeholder: "e.g. 149" },
                      { label: "Image URL", key: "image_url", type: "text", placeholder: "https://..." },
                      { label: "Category", key: "category", type: "text", placeholder: "e.g. Solar Lights" },
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
                      <input type="checkbox" checked={form.in_stock} onChange={e => setForm(f => ({ ...f, in_stock: e.target.checked }))} /> In Stock
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

            {/* Products Table */}
            <div style={{ background: "#fff", border: "1px solid #E2DDD4", borderRadius: 14, overflow: "hidden" }}>
              {search && <div style={{ padding: "10px 16px", background: "#F4F1EB", fontSize: 13, color: "#6B7280" }}>Showing {filtered.length} of {products.length} products</div>}
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "#0B1D3A", color: "#E0B84A" }}>
                    <th onClick={() => handleSort("name")} style={s.th("name")}>Name{sortIcon("name")}</th>
                    <th style={s.th()}>Arabic</th>
                    <th onClick={() => handleSort("category")} style={s.th("category")}>Category{sortIcon("category")}</th>
                    <th onClick={() => handleSort("price")} style={{ ...s.th("price"), textAlign: "right" }}>Price{sortIcon("price")}</th>
                    <th onClick={() => handleSort("in_stock")} style={{ ...s.th("in_stock"), textAlign: "center" }}>Stock{sortIcon("in_stock")}</th>
                    <th style={{ ...s.th(), textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <tr key={p.id} style={{ borderTop: "1px solid #F4F1EB", background: i % 2 === 0 ? "#fff" : "#FAF7F2" }}>
                      <td style={{ ...s.td, color: "#0B1D3A", fontWeight: 500 }}>
                        {p.name}
                        <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 400 }}>{p.description?.substring(0, 45)}...</div>
                      </td>
                      <td style={{ ...s.td, textAlign: "right" }}>
                        {p.name_ar
                          ? <div dir="rtl"><div style={{ fontSize: 13, color: "#0B1D3A" }}>{p.name_ar}</div><div style={{ fontSize: 11, color: "#6B7280" }}>{p.description_ar?.substring(0, 35)}...</div></div>
                          : <span style={{ fontSize: 12, color: "#9CA3AF", fontStyle: "italic" }}>Not translated</span>}
                      </td>
                      <td style={{ ...s.td, color: "#6B7280" }}>{p.category || "—"}</td>
                      <td style={{ ...s.td, textAlign: "right", color: "#0B1D3A", fontWeight: 500 }}>AED {p.price}</td>
                      <td style={{ ...s.td, textAlign: "center" }}>
                        <span style={{ background: p.in_stock ? "#ECFDF5" : "#FEF2F2", color: p.in_stock ? "#065F46" : "#991B1B", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
                          {p.in_stock ? "In Stock" : "Out"}
                        </span>
                      </td>
                      <td style={{ ...s.td, textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
                          <button onClick={() => openEdit(p)} style={{ ...s.btn("#fff", "#0B1D3A"), border: "1px solid #E2DDD4" }}>Edit</button>
                          <button
                            onClick={() => translateProduct(p)}
                            disabled={translating === p.id}
                            style={s.btn(translating === p.id ? "#E2DDD4" : "#EEF2FF", "#4338CA")}>
                            {translating === p.id
                              ? "Translating..."
                              : p.name_ar
                              ? "🔄 Re-translate"
                              : "🌐 Translate AR"}
                          </button>
                          <button onClick={() => deleteProduct(p.id)} style={s.btn("#FEF2F2", "#991B1B")}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#6B7280" }}>
                      {search ? `No products matching "${search}"` : "No products yet."}
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>

        ) : (
          /* ── ORDERS TAB ── */
          <div style={{ background: "#fff", border: "1px solid #E2DDD4", borderRadius: 14, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#0B1D3A", color: "#E0B84A" }}>
                  <th style={s.th()}>Customer</th>
                  <th style={s.th()}>Product</th>
                  <th style={s.th()}>Payment</th>
                  <th style={{ ...s.th(), textAlign: "center" }}>Qty</th>
                  <th style={{ ...s.th(), textAlign: "center" }}>Status</th>
                  <th style={s.th()}>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={o.id} style={{ borderTop: "1px solid #F4F1EB", background: i % 2 === 0 ? "#fff" : "#FAF7F2" }}>
                    <td style={s.td}>
                      <div style={{ fontWeight: 500, color: "#0B1D3A" }}>{o.full_name}</div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>{o.email}</div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>{o.phone}</div>
                    </td>
                    <td style={{ ...s.td, color: "#0B1D3A" }}>{o.product_name}</td>
                    <td style={{ ...s.td, color: "#6B7280" }}>{o.payment_method}</td>
                    <td style={{ ...s.td, textAlign: "center", color: "#0B1D3A" }}>{o.quantity}</td>
                    <td style={{ ...s.td, textAlign: "center" }}>
                      <span style={{ background: o.status === "confirmed" ? "#ECFDF5" : o.status === "pending" ? "#FFFBEB" : "#FEF2F2", color: o.status === "confirmed" ? "#065F46" : o.status === "pending" ? "#92400E" : "#991B1B", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{o.status}</span>
                    </td>
                    <td style={{ ...s.td, color: "#6B7280", fontSize: 12 }}>{new Date(o.created_at).toLocaleDateString()}</td>
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
