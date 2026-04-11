"use client"

import { useState } from "react"

const REGIONS: Record<string, string[]> = {
  "GCC": ["United Arab Emirates", "Saudi Arabia", "Kuwait", "Qatar", "Bahrain", "Oman"],
  "Arab World": ["Egypt", "Jordan", "Lebanon", "Iraq", "Sudan", "Libya", "Tunisia", "Algeria", "Morocco", "Yemen"],
  "Europe": ["United Kingdom", "Germany", "France", "Netherlands", "Sweden", "Norway", "Italy", "Spain", "Switzerland"],
  "Asia": ["India", "Pakistan", "Bangladesh", "Philippines", "Malaysia", "Indonesia", "Singapore", "Sri Lanka", "China", "Japan", "South Korea"],
  "Africa": ["Kenya", "Nigeria", "South Africa", "Ethiopia", "Ghana", "Tanzania"],
  "Americas & Australia": ["United States", "Canada", "Australia", "Brazil", "Mexico"],
}

// Rates in AED per kg (approximate real-world rates from UAE)
const RATES: Record<string, Record<string, { min: number; max: number; days: string }>> = {
  "GCC": {
    courier:  { min: 35,  max: 65,  days: "1–3 days" },
    air:      { min: 20,  max: 35,  days: "3–5 days" },
    sea:      { min: 8,   max: 15,  days: "5–10 days" },
  },
  "Arab World": {
    courier:  { min: 60,  max: 100, days: "2–4 days" },
    air:      { min: 30,  max: 55,  days: "4–7 days" },
    sea:      { min: 12,  max: 22,  days: "7–14 days" },
  },
  "Europe": {
    courier:  { min: 120, max: 200, days: "2–4 days" },
    air:      { min: 55,  max: 90,  days: "5–8 days" },
    sea:      { min: 18,  max: 32,  days: "20–35 days" },
  },
  "Asia": {
    courier:  { min: 80,  max: 150, days: "2–5 days" },
    air:      { min: 40,  max: 70,  days: "4–7 days" },
    sea:      { min: 15,  max: 28,  days: "15–25 days" },
  },
  "Africa": {
    courier:  { min: 130, max: 220, days: "3–6 days" },
    air:      { min: 60,  max: 100, days: "5–10 days" },
    sea:      { min: 20,  max: 38,  days: "20–40 days" },
  },
  "Americas & Australia": {
    courier:  { min: 150, max: 250, days: "2–5 days" },
    air:      { min: 70,  max: 120, days: "6–10 days" },
    sea:      { min: 22,  max: 42,  days: "25–45 days" },
  },
}

const METHODS = [
  { key: "courier",  label: "Express Courier",  icon: "⚡", desc: "DHL / FedEx / Aramex" },
  { key: "air",      label: "Air Cargo",         icon: "✈️", desc: "Standard air freight" },
  { key: "sea",      label: "Sea Cargo",          icon: "🚢", desc: "Economy sea freight" },
]

function getRegion(country: string): string | null {
  for (const [region, countries] of Object.entries(REGIONS)) {
    if (countries.includes(country)) return region
  }
  return null
}

const ALL_COUNTRIES = Object.values(REGIONS).flat().sort()

export function ShippingCalculator() {
  const [country, setCountry] = useState("")
  const [countrySearch, setCountrySearch] = useState("")
  const [showList, setShowList] = useState(false)
  const [weight, setWeight] = useState(1)
  const [calculated, setCalculated] = useState(false)

  const filtered = ALL_COUNTRIES.filter(c =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  )

  const region = getRegion(country)
  const rates = region ? RATES[region] : null

  function calculate() {
    if (country && weight > 0) setCalculated(true)
  }

  const inputClass = "w-full px-3.5 py-2.5 border border-[#E2DDD4] rounded-lg text-sm bg-[#FAF7F2] outline-none focus:border-[#C49A3C] transition-colors"

  return (
    <section id="shipping" className="mb-14">
      <div className="mb-2" style={{ width: 48, height: 3, background: "#C49A3C", borderRadius: 2 }} />
      <h2 style={{ fontFamily: "serif", fontSize: 26, fontWeight: 600, color: "#0B1D3A", marginBottom: 4 }}>
        Shipping Estimator
      </h2>
      <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 28 }}>
        Get an approximate shipping cost to your location. Final rate confirmed at checkout.
      </p>

      <div style={{ background: "#fff", border: "1px solid #E2DDD4", borderRadius: 16, padding: "2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>

          {/* Country selector */}
          <div style={{ position: "relative" }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#0B1D3A", display: "block", marginBottom: 6 }}>
              Destination Country *
            </label>
            <input
              type="text"
              placeholder="Type to search country..."
              value={countrySearch || country}
              onFocus={() => { setShowList(true); setCountrySearch(""); setCalculated(false) }}
              onChange={e => { setCountrySearch(e.target.value); setShowList(true); setCountry(""); setCalculated(false) }}
              className={inputClass}
              autoComplete="off"
            />
            {showList && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, background: "#fff", border: "1px solid #E2DDD4", borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 50, maxHeight: 200, overflowY: "auto" }}>
                {filtered.length === 0 && (
                  <div style={{ padding: "8px 14px", fontSize: 13, color: "#6B7280" }}>No results</div>
                )}
                {filtered.map(c => (
                  <button key={c} type="button"
                    onClick={() => { setCountry(c); setCountrySearch(""); setShowList(false); setCalculated(false) }}
                    style={{ width: "100%", textAlign: "left", padding: "8px 14px", fontSize: 13, color: "#0B1D3A", background: "none", border: "none", cursor: "pointer" }}
                    onMouseOver={e => (e.currentTarget.style.background = "#FAF7F2")}
                    onMouseOut={e => (e.currentTarget.style.background = "none")}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Weight input */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#0B1D3A", display: "block", marginBottom: 6 }}>
              Estimated Weight (kg)
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid #E2DDD4", borderRadius: 10, padding: "6px 14px", background: "#FAF7F2" }}>
              <button type="button" onClick={() => { setWeight(w => Math.max(0.5, parseFloat((w - 0.5).toFixed(1)))); setCalculated(false) }}
                style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #E2DDD4", background: "#fff", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", color: "#0B1D3A" }}>−</button>
              <span style={{ flex: 1, textAlign: "center", fontSize: 15, fontWeight: 500, color: "#0B1D3A" }}>{weight} kg</span>
              <button type="button" onClick={() => { setWeight(w => parseFloat((w + 0.5).toFixed(1))); setCalculated(false) }}
                style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #E2DDD4", background: "#fff", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", color: "#0B1D3A" }}>+</button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={calculate}
          disabled={!country || weight <= 0}
          style={{ background: "#0B1D3A", color: "#E0B84A", border: "none", padding: "11px 28px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: country ? "pointer" : "not-allowed", opacity: country ? 1 : 0.5, marginBottom: 24 }}
        >
          Calculate Shipping →
        </button>

        {/* Results */}
        {calculated && rates && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: "#6B7280" }}>Showing estimates for</span>
              <span style={{ background: "#FAF7F2", border: "1px solid #E2DDD4", borderRadius: 20, padding: "2px 12px", fontSize: 13, fontWeight: 500, color: "#0B1D3A" }}>{country}</span>
              <span style={{ fontSize: 13, color: "#6B7280" }}>· {weight} kg</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
              {METHODS.map(method => {
                const rate = rates[method.key]
                const minCost = Math.round(rate.min * weight)
                const maxCost = Math.round(rate.max * weight)
                return (
                  <div key={method.key} style={{ border: "1px solid #E2DDD4", borderRadius: 12, padding: "18px 16px", background: "#FAF7F2" }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{method.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#0B1D3A", marginBottom: 2 }}>{method.label}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 12 }}>{method.desc}</div>
                    <div style={{ fontSize: 20, fontWeight: 600, color: "#0B1D3A", marginBottom: 4 }}>
                      AED {minCost}–{maxCost}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C49A3C" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <span style={{ fontSize: 12, color: "#6B7280" }}>{rate.days}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ marginTop: 16, background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              <p style={{ fontSize: 12, color: "#92400E", lineHeight: 1.6, margin: 0 }}>
                These are estimates only. Final shipping cost depends on actual package dimensions, weight, and carrier rates at time of shipment. We will confirm the exact cost via WhatsApp before you make payment.
              </p>
            </div>
          </div>
        )}

        {calculated && !rates && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", color: "#991B1B", fontSize: 13 }}>
            We don't have shipping estimates for this country yet. Please contact us on WhatsApp for a custom quote.
          </div>
        )}
      </div>
    </section>
  )
}
