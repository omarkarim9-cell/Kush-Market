"use client"

import { useLang } from "@/contexts/lang-context"
import { t } from "@/lib/translations"

export function HowItWorks() {
  const { lang } = useLang()
  const tx = t[lang].how

  return (
    <section id="how-it-works" className="mb-14">
      <div style={{ width: 48, height: 3, background: "#C49A3C", borderRadius: 2, marginBottom: 10 }} />
      <h2 className="font-serif text-navy mb-1.5" style={{ fontSize: 26, fontWeight: 600 }}>{tx.title}</h2>
      <p className="text-muted-foreground text-sm mb-9">{tx.subtitle}</p>

      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        {tx.steps.map((step, i) => (
          <div key={i} className="bg-white border border-border rounded-xl p-7 text-center">
            <div className="w-[42px] h-[42px] bg-navy text-gold2 font-serif text-lg font-semibold rounded-full flex items-center justify-center mx-auto mb-4">
              {step.num}
            </div>
            <h3 className="text-sm font-medium text-navy mb-1.5">{step.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
