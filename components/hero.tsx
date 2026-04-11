"use client"

import { useLang } from "@/contexts/lang-context"
import { t } from "@/lib/translations"

export function Hero() {
  const { lang } = useLang()
  const tx = t[lang].hero

  return (
    <div className="bg-navy py-16 px-8 text-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(196,154,60,0.12) 0%, transparent 70%)" }} />
      <div className="inline-block bg-gold/15 text-gold2 border border-gold/30 text-xs font-medium tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
        {tx.badge}
      </div>
      <h1 className="font-serif text-white mb-4" style={{ fontSize: "clamp(28px, 4vw, 42px)", lineHeight: 1.2 }}>
        {lang === "ar" ? (
          <>{tx.title}</>
        ) : (
          <>Kush <em className="text-gold2 italic">Shop</em></>
        )}
      </h1>
      <p className="text-white/65 text-sm max-w-lg mx-auto font-light">
        {tx.subtitle}
      </p>
    </div>
  )
}
