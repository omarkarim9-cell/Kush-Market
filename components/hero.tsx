"use client"

import { useLang } from "@/contexts/lang-context"
import { t } from "@/lib/translations"

export function Hero() {
  const { lang, isRTL } = useLang()
  const tx = t[lang].hero

  return (
    <div 
      className="bg-navy px-8 py-14 pb-12 text-center relative overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 70% 50%, rgba(196,154,60,0.12) 0%, transparent 70%)"
        }}
      />
      
      <div className="relative z-10">
        <span className="inline-block bg-gold/15 text-gold2 border border-gold/30 text-xs font-medium tracking-[1.5px] uppercase px-4 py-1.5 rounded-full mb-4">
          {tx.badge}
        </span>
        
        <h1 className="font-serif text-[clamp(28px,4vw,42px)] text-white mb-3.5 leading-tight">
          {lang === "ar" ? (
            <>متجر <em className="text-gold2">كوش</em></>
          ) : (
            <>Kush <em className="text-gold2">Shop</em></>
          )}
        </h1>
        
        <p className="text-white/65 text-[15px] max-w-[500px] mx-auto font-light">
          {tx.subtitle}
        </p>
      </div>
    </div>
  )
}
