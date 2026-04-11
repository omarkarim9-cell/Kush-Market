"use client"

import { useState } from "react"
import { useLang } from "@/contexts/lang-context"
import { t } from "@/lib/translations"

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
    courier: { min: 35, max: 65, days: "1–3 days" },
    air: { min: 20, max: 35, days: "3–5 days" },
    sea: { min: 8, max: 15, days: "5–10 days" },
  },
  "Arab World": {
    courier: { min: 60, max: 100, days: "2–4 days" },
    air: { min: 30, max: 55, days: "4–7 days" },
    sea: { min: 12, max: 22, days: "7–14 days" },
  },
  "Europe": {
    courier: { min: 120, max: 200, days: "2–4 days" },
    air: { min: 55, max: 90, days: "5–8 days" },
    sea: { min: 18, max: 32, days: "20–35 days" },
  },
  "Asia": {
    courier: { min: 80, max: 150, days: "2–5 days" },
    air: { min: 40, max: 70, days: "4–7 days" },
    sea: { min: 15, max: 28, days: "15–25 days" },
  },
  "Africa": {
    courier: { min: 130, max: 220, days: "3–6 days" },
    air: { min: 60, max: 100, days: "5–10 days" },
    sea: { min: 20, max: 38, days: "20–40 days" },
  },
  "Americas & Australia": {
    courier: { min: 150, max: 250, days: "2–5 days" },
    air: { min: 70, max: 120, days: "6–10 days" },
    sea: { min: 22, max: 42, days: "25–45 days" },
  },
}

function getRegion(country: string): string | null {
  for (const [region, countries] of Object.entries(REGIONS)) {
    if (countries.includes(country)) return region
  }
  return null
}

const ALL_COUNTRIES = Object.values(REGIONS).flat().sort()

export function ShippingCalculator() {
  const { lang, isRTL } = useLang()
  const tx = t[lang].shipping

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

  const METHODS = [
    { key: "courier", icon: "⚡" },
    { key: "air", icon: "✈️" },
    { key: "sea", icon: "🚢" },
  ] as const

  const inputClass = "w-full px-3.5 py-2.5 border border-[#E2DDD4] rounded-lg text-sm bg-[#FAF7F2] outline-none focus:border-[#C49A3C] transition-colors"

  return (
    <section id="shipping" className="py-16 bg-[#FAF7F2]" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#0B1D3A] mb-2">
            {tx.title}
          </h2>
          <p className="text-[#6B7280] text-sm">
            {tx.subtitle}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2DDD4] p-6 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">

            {/* Country selector */}
            <div className="relative">
              <label className="block text-sm font-medium text-[#0B1D3A] mb-1.5">
                {tx.country}
              </label>
              <input
                type="text"
                placeholder={tx.countryPlaceholder}
                value={country || countrySearch}
                onFocus={() => { setShowList(true); setCountrySearch(""); setCalculated(false) }}
                onChange={e => { setCountrySearch(e.target.value); setShowList(true); setCountry(""); setCalculated(false) }}
                className={inputClass}
                autoComplete="off"
              />
              {showList && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-[#E2DDD4] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filtered.length === 0 && (
                    <p className="px-4 py-2 text-sm text-[#6B7280]">No results</p>
                  )}
                  {filtered.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { setCountry(c); setCountrySearch(""); setShowList(false); setCalculated(false) }}
                      className="w-full text-start p-2 px-3.5 text-sm text-[#0B1D3A] hover:bg-[#FAF7F2] cursor-pointer"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Weight input */}
            <div>
              <label className="block text-sm font-medium text-[#0B1D3A] mb-1.5">
                {tx.weight}
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { setWeight(w => Math.max(0.5, parseFloat((w - 0.5).toFixed(1)))); setCalculated(false) }}
                  className="w-8 h-8 rounded-full border border-[#E2DDD4] bg-white flex items-center justify-center text-lg text-[#0B1D3A] cursor-pointer hover:bg-[#FAF7F2]"
                >
                  −
                </button>
                <span className="text-lg font-medium text-[#0B1D3A] min-w-[60px] text-center">{weight} kg</span>
                <button
                  type="button"
                  onClick={() => { setWeight(w => parseFloat((w + 0.5).toFixed(1))); setCalculated(false) }}
                  className="w-8 h-8 rounded-full border border-[#E2DDD4] bg-white flex items-center justify-center text-lg text-[#0B1D3A] cursor-pointer hover:bg-[#FAF7F2]"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={calculate}
            className="w-full mt-6 py-3 bg-[#0B1D3A] text-[#E0B84A] rounded-lg font-medium transition-colors hover:bg-[#142447]"
          >
            {tx.calculate}
          </button>

          {/* Results */}
          {calculated && rates && (
            <div className="mt-6 pt-6 border-t border-[#E2DDD4]">
              <p className="text-sm text-[#6B7280] mb-4">
                {tx.estimatesFor}{" "}
                <span className="font-medium text-[#0B1D3A]">{country}</span>
                {" · "}{weight} kg
              </p>

              <div className="grid gap-3">
                {METHODS.map(method => {
                  const rate = rates[method.key]
                  const methodTx = tx.methods[method.key]
                  const minCost = Math.round(rate.min * weight)
                  const maxCost = Math.round(rate.max * weight)
                  return (
                    <div key={method.key} className="flex items-center justify-between p-3 bg-[#FAF7F2] rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{method.icon}</span>
                        <div>
                          <p className="font-medium text-[#0B1D3A]">{methodTx.label}</p>
                          <p className="text-xs text-[#6B7280]">{methodTx.desc}</p>
                        </div>
                      </div>
                      <div className={`${isRTL ? "text-start" : "text-end"}`}>
                        <p className="font-semibold text-[#0B1D3A]">
                          AED {minCost}–{maxCost}
                        </p>
                        <p className="text-xs text-[#6B7280]">{rate.days}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 p-3 bg-[#FEF3C7] rounded-lg flex gap-2">
                <span className="text-amber-600">⚠️</span>
                <p className="text-xs text-[#92400E]">
                  {tx.warning}
                </p>
              </div>
            </div>
          )}

          {calculated && !rates && (
            <p className="mt-6 text-center text-sm text-[#6B7280]">
              {tx.noData}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
