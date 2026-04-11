"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { ProductsGrid } from "@/components/products-grid"
import { ShippingCalculator } from "@/components/shipping-calculator"
import { OrderForm } from "@/components/order-form"
import { PaymentDetails } from "@/components/payment-details"
import { ProofBox } from "@/components/proof-box"
import { Footer } from "@/components/footer"
import { SuccessModal } from "@/components/success-modal"

export default function ShopPage() {
  const [selectedProduct, setSelectedProduct] = useState("")
  const [showModal, setShowModal] = useState(false)

  const handleSelectProduct = (productName: string, price: number) => {
    setSelectedProduct(`${productName} (AED ${price})`)
    document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleOrderSubmit = () => {
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <Hero />
      
      <main className="max-w-[1100px] mx-auto px-8 py-14">
        <HowItWorks />
        <ProductsGrid onSelectProduct={handleSelectProduct} />
        <ShippingCalculator />
        <OrderForm 
          selectedProduct={selectedProduct} 
          onSubmit={handleOrderSubmit} 
        />
        <PaymentDetails />
        <ProofBox />
      </main>

      <Footer />
      <SuccessModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}
