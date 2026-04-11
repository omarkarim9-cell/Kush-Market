"use client"

import { useEffect, useState } from "react"
import { SectionHeader } from "./section-header"
import { useLang } from "@/contexts/lang-context"
import { t } from "@/lib/translations"

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

interface ProductsGridProps {
  onSelectProduct: (name: string, price: number) => void
}

export function ProductsGrid({ onSelectProduct }: ProductsGridProps) {
  const { lang, isRTL } = useLang()
  const tx = t[lang].products

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))]

  const filtered = products.filter((p) => {
    const name = lang === "ar" && p.name_ar ? p.name_ar : p.name
    const desc = lang === "ar" && p.description_ar ? p.description_ar : p.description
    const matchSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      desc?.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === "all" || p.category === activeCategory
    return matchSearch && matchCategory && p.in_stock
  })

  return (
    <section id="products" className="py-16 bg-gray" dir={isRTL ? "rtl" : "ltr"}>
      <SectionHeader title={tx.title} subtitle={tx.subtitle} />

      {/* Search Bar */}
      <div className="max-w-xl mx-auto px-6 mb-6">
        <input
          type="text"
          placeholder={tx.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white outline-none focus:border-gold transition-colors"
        />
      </div>

      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="flex justify-center gap-2 px-6 mb-8 flex-wrap">
          {categories.map((cat) => (
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
              {cat === "all" ? tx.all : cat}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <p className="text-center text-muted-foreground py-12">{tx.loading}</p>
      )}

      {/* No results */}
      {!loading && filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          {tx.noResults}{search ? ` "${search}"` : ""}
        </p>
      )}

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((product) => {
          const displayName = lang === "ar" && product.name_ar ? product.name_ar : product.name
          const displayDesc = lang === "ar" && product.description_ar ? product.description_ar : product.description

          return (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Product Image */}
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={displayName}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    const sibling = e.currentTarget.nextElementSibling as HTMLElement
                    if (sibling) sibling.style.display = "flex"
                  }}
                />
              ) : null}

              {/* Placeholder if no image */}
              <div
                className="w-full h-48 bg-secondary items-center justify-center"
                style={{ display: product.image_url ? "none" : "flex" }}
              >
                <svg className="w-12 h-12 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="sr-only">Product image</span>
              </div>

              {/* Product Body */}
              <div className="p-4 flex flex-col flex-1">
                {product.category && (
                  <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    {product.category}
                  </span>
                )}
                <h3 className="font-semibold text-foreground mb-1">{displayName}</h3>
                <p className="text-sm text-muted-foreground flex-1 line-clamp-2">
                  {displayDesc}
                </p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <span className="text-lg font-bold text-navy">
                    AED {product.price}
                  </span>
                  <button
                    onClick={() => onSelectProduct(displayName, product.price)}
                    className="bg-navy text-gold2 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors hover:bg-navy/90"
                  >
                    {tx.orderNow}
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
