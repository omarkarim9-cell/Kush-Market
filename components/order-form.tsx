"use client"

import { useState, useEffect } from "react"
import { SectionHeader } from "./section-header"
import { useLang } from "@/contexts/lang-context"
import { t } from "@/lib/translations"

interface Product {
  id: number
  name: string
  price: number
  name_ar?: string
}

interface OrderFormProps {
  selectedProduct: string
  onSubmit: () => void
}

export function OrderForm({ selectedProduct, onSubmit }: OrderFormProps) {
  const { lang, isRTL } = useLang()
  const tx = t[lang].form

  const [products, setProducts] = useState<Product[]>([])
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    product: "",
    quantity: "1",
    paymentMethod: "",
    notes: "",
    agreed: false,
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (selectedProduct) {
      setFormData((prev) => ({ ...prev, product: selectedProduct }))
    }
  }, [selectedProduct])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.agreed) return

    setSubmitting(true)
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          city: formData.city,
          product_name: formData.product,
          quantity: parseInt(formData.quantity),
          payment_method: formData.paymentMethod,
          notes: formData.notes,
        }),
      })
      onSubmit()
      
      // Open WhatsApp
      const message = encodeURIComponent(
        `Hi! I just placed an order:\n\nName: ${formData.fullName}\nProduct: ${formData.product}\nQty: ${formData.quantity}\nPayment: ${formData.paymentMethod}\n\nPlease confirm my order.`
      )
      window.open(`https://wa.me/971501234567?text=${message}`, "_blank")
    } catch (err) {
      console.error(err)
    }
    setSubmitting(false)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }))
  }

  const inputStyles =
    "w-full px-3.5 py-2.5 border border-border rounded-lg text-sm bg-cream text-foreground outline-none transition-colors focus:border-gold focus:bg-white"

  // Calculate subtotal
  const selectedProd = products.find(p => {
    const name = lang === "ar" && p.name_ar ? p.name_ar : p.name
    return formData.product.includes(name)
  })
  const subtotal = selectedProd ? selectedProd.price * parseInt(formData.quantity || "1") : 0

  return (
    <section id="order-form" className="mb-14" dir={isRTL ? "rtl" : "ltr"}>
      <SectionHeader title={tx.title} subtitle={tx.subtitle} />

      <div className="bg-white border border-border rounded-2xl p-10 max-sm:p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fullName" className="text-[13px] font-medium text-navy">
                {tx.fullName}
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder={tx.fullNamePlaceholder}
                required
                value={formData.fullName}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[13px] font-medium text-navy">
                {tx.email}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder={tx.emailPlaceholder}
                required
                value={formData.email}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-[13px] font-medium text-navy">
                {tx.phone}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder={tx.phonePlaceholder}
                required
                value={formData.phone}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            {/* Country */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="country" className="text-[13px] font-medium text-navy">
                {tx.country}
              </label>
              <input
                type="text"
                id="country"
                name="country"
                placeholder={tx.countryPlaceholder}
                required
                value={formData.country}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            {/* City */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="city" className="text-[13px] font-medium text-navy">
                {tx.city}
              </label>
              <input
                type="text"
                id="city"
                name="city"
                placeholder={tx.cityPlaceholder}
                required
                value={formData.city}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            {/* Product */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="product" className="text-[13px] font-medium text-navy">
                {tx.product}
              </label>
              <select
                id="product"
                name="product"
                required
                value={formData.product}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="">{tx.productPlaceholder}</option>
                {products.map((p) => {
                  const name = lang === "ar" && p.name_ar ? p.name_ar : p.name
                  return (
                    <option key={p.id} value={`${name} (AED ${p.price})`}>
                      {name} — AED {p.price}
                    </option>
                  )
                })}
              </select>
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="quantity" className="text-[13px] font-medium text-navy">
                {tx.quantity}
              </label>
              <select
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className={inputStyles}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="paymentMethod" className="text-[13px] font-medium text-navy">
                {tx.payment}
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                required
                value={formData.paymentMethod}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="">—</option>
                <option value="Wise">{tx.paymentWise} ({tx.paymentWiseSub})</option>
                <option value="Bank of Khartoum">{tx.paymentBok} ({tx.paymentBokSub})</option>
              </select>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5 col-span-2 max-sm:col-span-1">
              <label htmlFor="notes" className="text-[13px] font-medium text-navy">
                {tx.notes} <span className="text-muted-foreground font-normal">{tx.notesOptional}</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                placeholder={tx.notesPlaceholder}
                value={formData.notes}
                onChange={handleChange}
                className={`${inputStyles} resize-y min-h-[90px]`}
              />
            </div>
          </div>

          {/* Subtotal */}
          {subtotal > 0 && (
            <div className="mt-5 p-4 bg-[#FAF7F2] rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6B7280]">{tx.subtotal}</span>
                <span className="text-lg font-semibold text-[#0B1D3A]">AED {subtotal}</span>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-1">
                {tx.shippingNote} {tx.shippingNoteDesc}
              </p>
            </div>
          )}

          {/* Terms */}
          <label className="flex items-start gap-3 mt-5 cursor-pointer">
            <input
              type="checkbox"
              name="agreed"
              checked={formData.agreed}
              onChange={handleChange}
              required
              className="w-4 h-4 mt-0.5"
            />
            <span className="text-xs text-[#6B7280]">
              {tx.terms}{" "}
              <a href="#" className="text-[#C49A3C] hover:underline">{tx.termsLink}</a>
              {tx.termsRest}
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting || !formData.agreed}
            className="w-full mt-5 bg-gold text-navy py-3.5 px-8 rounded-lg text-[15px] font-medium transition-colors hover:bg-gold2 disabled:opacity-50"
          >
            {submitting ? tx.submitting : tx.submit}
          </button>

          <p className="text-center text-xs text-[#9CA3AF] mt-3">{tx.hint}</p>
        </form>
      </div>
    </section>
  )
}
