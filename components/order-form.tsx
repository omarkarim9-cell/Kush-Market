"use client"

import { useState, useEffect, useRef } from "react"
import { SectionHeader } from "./section-header"
import { useLang } from "@/contexts/lang-context"
import { t } from "@/lib/translations"

interface OrderFormProps {
  selectedProduct: string
  onSubmit: () => void
}

interface Product {
  id: number
  name: string
  price: number
  category: string
  in_stock: boolean
}

const COUNTRIES = [
  "United Arab Emirates", "Saudi Arabia", "Kuwait", "Qatar", "Bahrain", "Oman",
  "Sudan", "Egypt", "Jordan", "Lebanon", "Iraq", "Syria", "Yemen", "Libya",
  "Tunisia", "Algeria", "Morocco", "Palestine", "United Kingdom", "United States",
  "Canada", "Australia", "Germany", "France", "Netherlands", "Sweden", "Norway",
  "Denmark", "Switzerland", "Italy", "Spain", "Turkey", "Pakistan", "India",
  "Bangladesh", "Sri Lanka", "Philippines", "Malaysia", "Indonesia", "Singapore",
  "South Africa", "Kenya", "Nigeria", "Ethiopia", "Ghana", "Tanzania",
  "China", "Japan", "South Korea", "Brazil", "Mexico", "Argentina",
].sort()

const PHONE_CODES = [
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+965", flag: "🇰🇼", name: "Kuwait" },
  { code: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "+973", flag: "🇧🇭", name: "Bahrain" },
  { code: "+968", flag: "🇴🇲", name: "Oman" },
  { code: "+249", flag: "🇸🇩", name: "Sudan" },
  { code: "+20", flag: "🇪🇬", name: "Egypt" },
  { code: "+962", flag: "🇯🇴", name: "Jordan" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+1", flag: "🇺🇸", name: "US/Canada" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+92", flag: "🇵🇰", name: "Pakistan" },
  { code: "+91", flag: "🇮🇳", name: "India" },
]

export function OrderForm({ selectedProduct, onSubmit }: OrderFormProps) {
  const { lang, isRTL } = useLang()
  const tx = t[lang].form

  const [products, setProducts] = useState<Product[]>([])
  const [formData, setFormData] = useState({
    fullName: "", email: "", phoneCode: "+971", phone: "",
    country: "", product: "", productPrice: 0,
    quantity: 1, paymentMethod: "", city: "", notes: "",
  })

  const [countrySearch, setCountrySearch] = useState("")
  const [showCountryList, setShowCountryList] = useState(false)
  const countryRef = useRef<HTMLDivElement>(null)

  const [showPhoneCodes, setShowPhoneCodes] = useState(false)
  const phoneRef = useRef<HTMLDivElement>(null)

  const [submitting, setSubmitting] = useState(false)
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => setProducts(Array.isArray(data) ? data.filter((p: Product) => p.in_stock) : []))
  }, [])

  useEffect(() => {
    if (selectedProduct && products.length > 0) {
      const name = selectedProduct.split(" (AED")[0]
      const found = products.find(p => p.name === name)
      if (found) {
        setFormData(prev => ({ ...prev, product: found.name, productPrice: found.price }))
      }
    }
  }, [selectedProduct, products])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) setShowCountryList(false)
      if (phoneRef.current && !phoneRef.current.contains(e.target as Node)) setShowPhoneCodes(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const filteredCountries = COUNTRIES.filter(c =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  )

  const total = formData.productPrice * formData.quantity

  function handleProductChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = products.find(p => p.name === e.target.value)
    setFormData(prev => ({
      ...prev,
      product: e.target.value,
      productPrice: selected?.price ?? 0,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const fullPhone = `${formData.phoneCode}${formData.phone}`
    const deliveryAddress = `${formData.city}, ${formData.country}`

    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          phone: fullPhone,
          country: formData.country,
          product_name: `${formData.product} (AED ${formData.productPrice})`,
          quantity: formData.quantity,
          payment_method: formData.paymentMethod,
          delivery_address: deliveryAddress,
          notes: formData.notes,
        }),
      })
    } catch (err) {
      console.error("Order save error:", err)
    }

    const msg =
      `Hello, I'd like to place an order:\n\n` +
      `*Name:* ${formData.fullName}\n` +
      `*Email:* ${formData.email}\n` +
      `*Phone:* ${fullPhone}\n` +
      `*Country:* ${formData.country}\n` +
      `*Product:* ${formData.product}\n` +
      `*Quantity:* ${formData.quantity}\n` +
      `*Total:* AED ${total}\n` +
      `*Payment:* ${formData.paymentMethod}\n` +
      `*Delivery to:* ${deliveryAddress}` +
      (formData.notes ? `\n*Notes:* ${formData.notes}` : "")

    window.open(`https://wa.me/971504207781?text=${encodeURIComponent(msg)}`, "_blank")

    setSubmitting(false)
    onSubmit()

    setFormData({
      fullName: "", email: "", phoneCode: "+971", phone: "",
      country: "", product: "", productPrice: 0,
      quantity: 1, paymentMethod: "", city: "", notes: "",
    })
    setCountrySearch("")
    setAgreed(false)
  }

  const inputStyles = "w-full px-3.5 py-2.5 border border-border rounded-lg text-sm bg-cream text-foreground outline-none transition-colors focus:border-gold focus:bg-white"

  return (
    <section id="order-form" className="mb-14">
      <SectionHeader title={tx.title} subtitle={tx.subtitle} />

      <div className="bg-white border border-border rounded-2xl p-10 max-sm:p-6" dir={isRTL ? "rtl" : "ltr"}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">

            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-navy">{tx.fullName}</label>
              <input type="text" placeholder={tx.fullNamePlaceholder} required
                value={formData.fullName}
                onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))}
                className={inputStyles} />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-navy">{tx.email}</label>
              <input type="email" placeholder={tx.emailPlaceholder} required
                value={formData.email}
                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                className={inputStyles} />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-navy">{tx.phone}</label>
              <div className="flex gap-2">
                <div className="relative" ref={phoneRef}>
                  <button type="button" onClick={() => setShowPhoneCodes(p => !p)}
                    className="h-full px-3 border border-border rounded-lg text-sm bg-cream flex items-center gap-1.5 whitespace-nowrap hover:border-gold transition-colors">
                    {PHONE_CODES.find(c => c.code === formData.phoneCode)?.flag} {formData.phoneCode} ▾
                  </button>
                  {showPhoneCodes && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-50 w-52 max-h-48 overflow-y-auto">
                      {PHONE_CODES.map(c => (
                        <button key={c.code} type="button"
                          onClick={() => { setFormData(p => ({ ...p, phoneCode: c.code })); setShowPhoneCodes(false) }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-cream flex items-center gap-2">
                          <span>{c.flag}</span>
                          <span className="text-navy">{c.name}</span>
                          <span className="text-muted-foreground ml-auto">{c.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input type="tel" placeholder={tx.phonePlaceholder} required
                  value={formData.phone}
                  onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                  className={inputStyles} />
              </div>
            </div>

            {/* Country */}
            <div className="flex flex-col gap-1.5" ref={countryRef}>
              <label className="text-[13px] font-medium text-navy">{tx.country}</label>
              <div className="relative">
                <input type="text" placeholder={tx.countryPlaceholder} autoComplete="off"
                  value={countrySearch || formData.country}
                  onFocus={() => { setShowCountryList(true); setCountrySearch("") }}
                  onChange={e => { setCountrySearch(e.target.value); setShowCountryList(true) }}
                  className={inputStyles} />
                {showCountryList && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {filteredCountries.length === 0 && (
                      <div className="px-3 py-2 text-sm text-muted-foreground">{tx.noCountry}</div>
                    )}
                    {filteredCountries.map(c => (
                      <button key={c} type="button"
                        onClick={() => { setFormData(p => ({ ...p, country: c })); setCountrySearch(""); setShowCountryList(false) }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-cream text-navy">
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input type="text" required value={formData.country} onChange={() => {}} className="sr-only" />
            </div>

            {/* Product */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-navy">{tx.product}</label>
              <select required value={formData.product} onChange={handleProductChange} className={inputStyles}>
                <option value="">{tx.productPlaceholder}</option>
                {products.map(p => (
                  <option key={p.id} value={p.name}>{p.name} — AED {p.price}</option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-navy">{tx.quantity}</label>
              <div className="flex items-center gap-3 border border-border rounded-lg bg-cream px-3.5 py-1.5">
                <button type="button"
                  onClick={() => setFormData(p => ({ ...p, quantity: Math.max(1, p.quantity - 1) }))}
                  className="w-8 h-8 rounded-full bg-white border border-border text-navy font-medium text-lg flex items-center justify-center hover:border-gold transition-colors">−</button>
                <span className="flex-1 text-center text-sm font-medium text-navy">{formData.quantity}</span>
                <button type="button"
                  onClick={() => setFormData(p => ({ ...p, quantity: Math.min(20, p.quantity + 1) }))}
                  className="w-8 h-8 rounded-full bg-white border border-border text-navy font-medium text-lg flex items-center justify-center hover:border-gold transition-colors">+</button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-navy">{tx.payment}</label>
              <div className="flex gap-3">
                {[
                  { value: "Wise", label: tx.paymentWise, sub: tx.paymentWiseSub },
                  { value: "Bank of Khartoum", label: tx.paymentBok, sub: tx.paymentBokSub },
                ].map(opt => (
                  <button key={opt.value} type="button"
                    onClick={() => setFormData(p => ({ ...p, paymentMethod: opt.value }))}
                    className="flex-1 py-2.5 px-3 border rounded-lg text-left transition-all"
                    style={{
                      borderColor: formData.paymentMethod === opt.value ? "#C49A3C" : "#E2DDD4",
                      background: formData.paymentMethod === opt.value ? "#FFF8EC" : "#FAF7F2",
                    }}>
                    <div className="text-sm font-medium text-navy">{opt.label}</div>
                    <div className="text-[11px] text-muted-foreground">{opt.sub}</div>
                  </button>
                ))}
              </div>
              <input type="text" required value={formData.paymentMethod} onChange={() => {}} className="sr-only" />
            </div>

            {/* City */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-navy">{tx.city}</label>
              <input type="text" placeholder={tx.cityPlaceholder} required
                value={formData.city}
                onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                className={inputStyles} />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5 col-span-2 max-sm:col-span-1">
              <label className="text-[13px] font-medium text-navy">
                {tx.notes} <span className="text-muted-foreground font-normal">{tx.notesOptional}</span>
              </label>
              <textarea placeholder={tx.notesPlaceholder}
                value={formData.notes}
                onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                className={`${inputStyles} resize-y min-h-[80px]`} />
            </div>
          </div>

          {/* Order Summary */}
          {formData.product && (
            <div className="mt-5 bg-cream border border-border rounded-xl px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-[13px] text-muted-foreground">{tx.subtotal}</div>
                  <div className="text-[15px] font-medium text-navy">{formData.product} × {formData.quantity}</div>
                </div>
                <div className="text-2xl font-semibold text-navy">AED {total.toFixed(2)}</div>
              </div>
              <div className="flex items-start gap-2 border-t border-border pt-3 mt-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C49A3C" strokeWidth="2" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  <span className="font-medium text-navy">{tx.shippingNote}</span> {tx.shippingNoteDesc}
                </p>
              </div>
            </div>
          )}

          {/* Terms */}
          <label className="flex items-start gap-2.5 mt-4 cursor-pointer">
            <input type="checkbox" required checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-0.5 accent-gold" />
            <span className="text-[12px] text-muted-foreground leading-relaxed">
              {tx.terms}{" "}
              <a href="/terms" target="_blank" className="text-gold underline hover:text-gold2">{tx.termsLink}</a>
              {tx.termsRest}
            </span>
          </label>

          <button type="submit" disabled={submitting || !agreed}
            className="w-full mt-4 bg-gold text-navy py-3.5 px-8 rounded-lg text-[15px] font-medium transition-all hover:bg-gold2 disabled:opacity-40 disabled:cursor-not-allowed">
            {submitting ? tx.submitting : tx.submit}
          </button>
          <p className="text-center text-[12px] text-muted-foreground mt-2">{tx.hint}</p>
        </form>
      </div>
    </section>
  )
}
