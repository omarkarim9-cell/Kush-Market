"use client"

import { useEffect, useState } from "react"
import { SectionHeader } from "./section-header"
import { useLang } from "@/contexts/lang-context"
import { t } from "@/lib/translations"

interface Product {
  id: number
  name: string
  name_ar?: string
  description: string
  description_ar?: string
  price: number
  image_url: string
  category: string
  in_stock: boolean
}

interface ProductsGridProps {
  onSelectProduct: (name: string, price: number) => void
}

export function ProductsGrid({ onSelectProduct }: ProductsGridProps) {
  const { lang } = useLang()
  const tx = t[lang].products
  const isAr = lang === "ar"

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  // Track which products are currently being translated by the user
  const [translatingId, setTranslatingId] = useState<number | null>(null)
  // Track newly translated products so we can show the result without refetching the whole list
  const [localTranslations, setLocalTranslations] = useState<Record<number, { name_ar: string; description_ar: string }>>({})

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))]

  const filtered = products.filter(p => {
    // Search in both languages
    const name = (isAr && (p.name_ar || localTranslations[p.id]?.name_ar)) || p.name
    const desc = (isAr && (p.description_ar || localTranslations[p.id]?.description_ar)) || p.description
    const matchSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      desc?.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === "All" || p.category === activeCategory
    return matchSearch && matchCategory && p.in_stock
  })

  // Called when an Arabic user clicks "Translate" on an untranslated product
  async function handleUserTranslate(product: Product) {
    setTranslatingId(product.id)
    try {
      const res = await fetch("/api/products/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, name: product.name, description: product.description }),
      })
      if (res.ok) {
        const data = await res.json()
        // Store translation locally so card updates immediately without full reload
        if (data.name_ar) {
          setLocalTranslations(prev => ({
            ...prev,
            [product.id]: { name_ar: data.name_ar, description_ar: data.description_ar || "" },
          }))
          // Also update the products list in-place
          setProducts(prev => prev.map(p =>
            p.id === product.id
              ? { ...p, name_ar: data.name_ar, description_ar: data.description_ar }
              : p
          ))
        }
      }
    } catch { /* silent fail — user can retry */ }
    setTranslatingId(null)
  }

  return (
    <section className="mb-14">
      <SectionHeader
        title={tx.title}
        subtitle={tx.subtitle}
      />

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder={isAr ? "ابحث عن منتج..." : "Search products..."}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white outline-none focus:border-gold transition-colors"
          dir={isAr ? "rtl" : "ltr"}
        />
      </div>

      {/* Category filter */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors"
              style={{
                background: activeCategory === cat ? "#0B1D3A" : "#fff",
                color: activeCategory === cat ? "#E0B84A" : "#6B7280",
                borderColor: activeCategory === cat ? "#0B1D3A" : "#E2DDD4",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          {isAr ? "جاري التحميل..." : "Loading products..."}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          {isAr ? "لا توجد منتجات" : `No products found${search ? ` for "${search}"` : ""}.`}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
        {filtered.map(product => {
          const local = localTranslations[product.id]
          const displayName = isAr ? (product.name_ar || local?.name_ar || product.name) : product.name
          const displayDesc = isAr ? (product.description_ar || local?.description_ar || product.description) : product.description
          const isTranslated = !!(product.name_ar || local?.name_ar)
          const isBeingTranslated = translatingId === product.id

          return (
            <div
              key={product.id}
              className="bg-white border border-border rounded-[14px] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              dir={isAr ? "rtl" : "ltr"}
            >
              {/* Image */}
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={displayName}
                  className="w-full h-[180px] object-cover"
                  onError={e => {
                    e.currentTarget.style.display = "none"
                    const next = e.currentTarget.nextElementSibling as HTMLElement
                    if (next) next.style.display = "flex"
                  }}
                />
              ) : null}
              <div
                className="w-full h-[180px] bg-gradient-to-br from-gray to-[#D4CFC2] flex flex-col items-center justify-center gap-2"
                style={{ display: product.image_url ? "none" : "flex" }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
                <span className="text-xs text-muted-foreground">Product image</span>
              </div>

              {/* Body */}
              <div className="p-4">
                {product.category && (
                  <div className="text-[11px] font-medium tracking-wide uppercase text-gold mb-1.5">
                    {product.category}
                  </div>
                )}

                <div className="text-[15px] font-medium text-navy mb-1">{displayName}</div>
                <p className="text-[13px] text-muted-foreground mb-3.5 leading-relaxed">{displayDesc}</p>

                {/* Translate button — only shown in Arabic mode when product has no Arabic */}
                {isAr && !isTranslated && (
                  <button
                    onClick={() => handleUserTranslate(product)}
                    disabled={isBeingTranslated}
                    className="w-full mb-3 py-1.5 px-3 rounded-lg text-[12px] font-medium border transition-colors"
                    style={{
                      background: isBeingTranslated ? "#F4F1EB" : "#EEF2FF",
                      color: "#4338CA",
                      borderColor: "#C7D7FA",
                      cursor: isBeingTranslated ? "not-allowed" : "pointer",
                    }}
                  >
                    {isBeingTranslated ? "جاري الترجمة..." : "🌐 ترجمة إلى العربية"}
                  </button>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-lg font-medium text-navy">AED {product.price}</div>
                  <button
                    onClick={() => onSelectProduct(product.name, product.price)}
                    className="bg-navy text-gold2 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors hover:bg-navy/90"
                  >
                    {tx.orderBtn}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
