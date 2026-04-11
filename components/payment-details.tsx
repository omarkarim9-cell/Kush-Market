"use client"

import { SectionHeader } from "./section-header"
import { useLang } from "@/contexts/lang-context"
import { t } from "@/lib/translations"

const wiseDetails = [
  { key: "accountName", value: "PLACEHOLDER NAME" },
  { key: "email", value: "placeholder@email.com" },
  { key: "currency", value: "AED / USD / GBP" },
  { key: "reference", value: "KUSH-SHOP" },
]

const bokDetails = [
  { key: "accountName", value: "PLACEHOLDER NAME" },
  { key: "accountNumber", value: "000000000" },
  { key: "iban", value: "SD0000000000000" },
]

export function PaymentDetails() {
  const { lang, isRTL } = useLang()
  const tx = t[lang].payment

  return (
    <section id="payment" className="mb-10" dir={isRTL ? "rtl" : "ltr"}>
      <SectionHeader title={tx.title} subtitle={tx.subtitle} />

      <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
        {/* Wise Card */}
        <div className="bg-white border border-border rounded-[14px] p-7">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-lg bg-[#9FE870] flex items-center justify-center text-lg">
              {"💸"}
            </div>
            <div>
              <h3 className="text-[15px] font-medium text-navy">{tx.wise.title}</h3>
              <p className="text-xs text-muted-foreground">{tx.wise.sub}</p>
            </div>
          </div>

          <div className="space-y-0">
            {wiseDetails.map((item, index) => (
              <div
                key={item.key}
                className={`flex justify-between items-start py-2 gap-3 ${
                  index < wiseDetails.length - 1 ? "border-b border-gray" : ""
                }`}
              >
                <span className="text-xs text-muted-foreground shrink-0">
                  {tx.fields[item.key as keyof typeof tx.fields]}
                </span>
                <span className="text-[13px] font-medium text-navy text-end break-all">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bank of Khartoum Card */}
        <div className="bg-white border border-border rounded-[14px] p-7">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-lg bg-[#FDE68A] flex items-center justify-center text-lg">
              {"🏦"}
            </div>
            <div>
              <h3 className="text-[15px] font-medium text-navy">{tx.bok.title}</h3>
              <p className="text-xs text-muted-foreground">{tx.bok.sub}</p>
            </div>
          </div>

          <div className="space-y-0">
            {bokDetails.map((item, index) => (
              <div
                key={item.key}
                className={`flex justify-between items-start py-2 gap-3 ${
                  index < bokDetails.length - 1 ? "border-b border-gray" : ""
                }`}
              >
                <span className="text-xs text-muted-foreground shrink-0">
                  {tx.fields[item.key as keyof typeof tx.fields]}
                </span>
                <span className="text-[13px] font-medium text-navy text-end break-all">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
