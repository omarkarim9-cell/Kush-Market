"use client"

import { useState, useEffect } from "react"
import { SectionHeader } from "./section-header"

interface OrderFormProps {
  selectedProduct: string
  onSubmit: () => void
}

const productOptions = [
  { value: "Study Planner 2025–2026 (AED 89)", label: "Study Planner 2025–2026 — AED 89" },
  { value: "IELTS Prep Bundle (AED 145)", label: "IELTS Prep Bundle — AED 145" },
  { value: "Kush Branded Backpack (AED 199)", label: "Kush Branded Backpack — AED 199" },
  { value: "University Applications Guide (AED 65)", label: "University Applications Guide — AED 65" },
]

export function OrderForm({ selectedProduct, onSubmit }: OrderFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    product: "",
    quantity: "1",
    paymentMethod: "",
    address: "",
    notes: "",
  })

  useEffect(() => {
    if (selectedProduct) {
      setFormData((prev) => ({ ...prev, product: selectedProduct }))
    }
  }, [selectedProduct])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const inputStyles =
    "w-full px-3.5 py-2.5 border border-border rounded-lg text-sm bg-cream text-foreground outline-none transition-colors focus:border-gold focus:bg-white"

  return (
    <section id="order-form" className="mb-14">
      <SectionHeader
        title="Place Your Order"
        subtitle="Fill in your details and we'll send you payment confirmation"
      />

      <div className="bg-white border border-border rounded-2xl p-10 max-sm:p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fullName" className="text-[13px] font-medium text-navy">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Your full name"
                required
                value={formData.fullName}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[13px] font-medium text-navy">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@email.com"
                required
                value={formData.email}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-[13px] font-medium text-navy">
                Phone / WhatsApp *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+971 50 000 0000"
                required
                value={formData.phone}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            {/* Country */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="country" className="text-[13px] font-medium text-navy">
                Country *
              </label>
              <input
                type="text"
                id="country"
                name="country"
                placeholder="e.g. United Arab Emirates"
                required
                value={formData.country}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            {/* Product */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="product" className="text-[13px] font-medium text-navy">
                Product *
              </label>
              <select
                id="product"
                name="product"
                required
                value={formData.product}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="">— Select a product —</option>
                {productOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="quantity" className="text-[13px] font-medium text-navy">
                Quantity *
              </label>
              <select
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className={inputStyles}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="paymentMethod" className="text-[13px] font-medium text-navy">
                Payment Method *
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                required
                value={formData.paymentMethod}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="">— How will you pay? —</option>
                <option value="Wise">Wise (international transfer)</option>
                <option value="Bank of Khartoum">Bank of Khartoum</option>
              </select>
            </div>

            {/* Delivery Address */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="address" className="text-[13px] font-medium text-navy">
                Delivery Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="City, Country"
                required
                value={formData.address}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5 col-span-2 max-sm:col-span-1">
              <label htmlFor="notes" className="text-[13px] font-medium text-navy">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Any special requests, questions, or details..."
                value={formData.notes}
                onChange={handleChange}
                className={`${inputStyles} resize-y min-h-[90px]`}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-5 bg-gold text-navy py-3.5 px-8 rounded-lg text-[15px] font-medium transition-colors hover:bg-gold2"
          >
            {"Submit Order Request →"}
          </button>
        </form>
      </div>
    </section>
  )
}
