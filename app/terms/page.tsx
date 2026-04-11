"use client"

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F2", fontFamily: "DM Sans, sans-serif" }}>

      {/* Header */}
      <div style={{ background: "#0B1D3A", padding: "0 2rem", display: "flex", alignItems: "center", height: 64 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img
            src="https://kush-edu.com/wp-content/uploads/2025/07/Ad-Kush-logo.jpg"
            alt="Kush"
            style={{ height: 36, borderRadius: 4 }}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <span style={{ color: "#E0B84A", fontFamily: "serif", fontSize: 18 }}>KUSH Shop</span>
        </a>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "3rem 2rem" }}>

        <h1 style={{ fontFamily: "serif", fontSize: 32, color: "#0B1D3A", marginBottom: 8 }}>Terms & Conditions</h1>
        <p style={{ color: "#6B7280", fontSize: 13, marginBottom: 40 }}>Last updated: April 2026 · Kush Educational Services — UAE</p>

        {[
          {
            title: "1. Introduction",
            content: `These Terms and Conditions govern your use of the Kush Shop (shop.kush-edu.com), operated by Kush Educational Services, based in the United Arab Emirates. By placing an order through this website, you agree to be bound by these terms. Please read them carefully before submitting any order.`,
          },
          {
            title: "2. Products & Availability",
            content: `All products listed on this store are subject to availability. We reserve the right to discontinue any product at any time without prior notice. Product images are for illustration purposes only and may differ slightly from the actual product received. We make every effort to ensure product descriptions are accurate, but do not warrant that descriptions are complete, reliable, or error-free.`,
          },
          {
            title: "3. Pricing",
            content: `All prices are listed in UAE Dirhams (AED) unless otherwise stated. Prices are subject to change without notice. The price shown at the time of your order submission is the price you will be charged. Kush Educational Services reserves the right to cancel an order if a pricing error has occurred.`,
          },
          {
            title: "4. Shipping & Delivery",
            content: `Shipping costs are not included in the product price displayed on the website. Shipping fees will be calculated and communicated to you separately after your order is confirmed, based on your delivery location, package weight, and the shipping method chosen. Kush Educational Services is not responsible for delays caused by shipping carriers, customs clearance, or circumstances beyond our control. Estimated delivery times are provided as a guide only and are not guaranteed.`,
          },
          {
            title: "5. Payment",
            content: `We currently accept payments via manual bank transfer only, through Wise (international) or Bank of Khartoum. Orders are only processed after payment has been received and verified by our team. It is the customer's responsibility to ensure the correct amount is transferred and that proof of payment is sent to us via WhatsApp at +971 50 420 7781. We will send an official invoice upon payment confirmation.`,
          },
          {
            title: "6. Order Confirmation",
            content: `Submitting an order form does not constitute a binding contract. An order is only confirmed once you receive a written confirmation from our team via WhatsApp or email. We reserve the right to refuse or cancel any order at our discretion, including in cases of suspected fraud, payment issues, or product unavailability.`,
          },
          {
            title: "7. Returns & Refunds",
            content: `If you receive a damaged or incorrect item, please contact us within 48 hours of receiving your order with photographic evidence. Approved refunds or replacements will be processed within 7–14 business days. We do not accept returns for change of mind. Digital products and services are non-refundable once delivered. Shipping costs are non-refundable unless the return is due to our error.`,
          },
          {
            title: "8. Limitation of Liability",
            content: `Kush Educational Services shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or services, including but not limited to loss of profits, data, or goodwill. Our total liability to you for any claim shall not exceed the amount paid for the product in question.`,
          },
          {
            title: "9. Privacy & Data",
            content: `We collect personal information (name, email, phone, address) solely for the purpose of processing your order and communicating with you. We do not sell or share your personal data with third parties except where required by law or necessary to fulfil your order (e.g., shipping carriers). By placing an order, you consent to us storing and using your data for these purposes.`,
          },
          {
            title: "10. Intellectual Property",
            content: `All content on this website, including text, images, logos, and design, is the property of Kush Educational Services and may not be copied, reproduced, or distributed without prior written permission.`,
          },
          {
            title: "11. Governing Law",
            content: `These Terms and Conditions are governed by and construed in accordance with the laws of the United Arab Emirates. Any disputes arising from these terms or your use of this website shall be subject to the exclusive jurisdiction of the courts of the UAE.`,
          },
          {
            title: "12. Contact Us",
            content: `If you have any questions about these Terms and Conditions, please contact us:\n\nEmail: info@kush-edu.com\nWhatsApp: +971 50 420 7781\nWebsite: kush-edu.com`,
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: "#0B1D3A", marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid #E2DDD4" }}>
              {section.title}
            </h2>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, whiteSpace: "pre-line" }}>
              {section.content}
            </p>
          </div>
        ))}

        <div style={{ background: "#0B1D3A", borderRadius: 12, padding: "20px 24px", marginTop: 40, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>© 2026 Kush Educational Services · UAE</span>
          <a href="/" style={{ color: "#E0B84A", fontSize: 13, textDecoration: "none" }}>← Back to Shop</a>
        </div>

      </div>
    </div>
  )
}
