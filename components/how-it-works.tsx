"use client"

import { SectionHeader } from "./section-header"
import { useLang } from "@/contexts/lang-context"
import { t } from "@/lib/translations"

export function HowItWorks() {
  const { lang, isRTL } = useLang()
  const tx = t[lang].how

  return (
    <section id="how-it-works" className="mb-14" dir={isRTL ? "rtl" : "ltr"}>
      <SectionHeader 
        title={tx.title} 
        subtitle={tx.subtitle} 
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
        {tx.steps.map((step, index) => (
          <div
            key={index}
            className="bg-white border border-border rounded-xl px-5 py-7 text-center"
          >
            <div className="w-[42px] h-[42px] bg-navy text-gold2 font-serif text-lg font-semibold rounded-full flex items-center justify-center mx-auto mb-4">
              {step.num}
            </div>
            <h3 className="text-[15px] font-medium text-navy mb-1.5">{step.title}</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
