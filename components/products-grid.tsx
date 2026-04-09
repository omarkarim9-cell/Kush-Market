"use client"

import { useEffect, useState } from "react"
import { SectionHeader } from "./section-header"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  category: string
  in_stock: boolean
}

interface ProductsGridProps {
  onSelectProduct: (name: string, price: number) => void
}

export function ProductsGrid({ onSelectProduct }: ProductsGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))]

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === "All" || p.category === activeCategory
    return matchSearch && matchCategory && p.in_stock
  })

  return (
    <section className="mb-14">
      <SectionHeader
        title="Our Products"
        subtitle={'Click "Order Now" on any product to jump to the order form'}
      />

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white outline-none focus:border-gold transition-colors"
        />
      </div>

      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
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
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-12 text-muted-foreground text-sm">Loading products...</div>
      )}

      {/* No results */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No products found{search ? ` for "${search}"` : ""}.
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-border rounded-[14px] overflow-hidden transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg"
          >
            {/* Product Image */}
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-[180px] object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                  e.currentTarget.nextElementSibling?.removeAttribute("style")
                }}
              />
            ) : null}

            {/* Placeholder if no image */}
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

            {/* Product Body */}
            <div className="p-4">
              {product.category && (
                <div className="text-[11px] font-medium tracking-wide uppercase text-gold mb-1.5">
                  {product.category}
                </div>
              )}
              <div className="text-[15px] font-medium text-navy mb-1">{product.name}</div>
              <p className="text-[13px] text-muted-foreground mb-3.5 leading-relaxed">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="text-lg font-medium text-navy">
                  AED {product.price}
                </div>
                <button
                  onClick={() => onSelectProduct(product.name, product.price)}
                  className="bg-navy text-gold2 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors hover:bg-navy/90"
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}