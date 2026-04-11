"use client"

import { useLang } from "@/contexts/lang-context"
import { t } from "@/lib/translations"

export function ProofBox() {
  const { lang, isRTL } = useLang()
  const tx = t[lang].proof

  return (
    <div 
      className="bg-navy rounded-[14px] px-9 py-8 flex items-start gap-5 mb-14 max-sm:flex-col"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center shrink-0">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#E0B84A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </div>

      <div>
        <h3 className="text-base font-medium text-white mb-1.5">
          {tx.title}
        </h3>
        <p className="text-[13px] text-white/60 leading-relaxed">
          {tx.desc1}{" "}
          <a href="https://wa.me/971501234567" className="text-gold2 hover:underline">
            +971 50 123 4567
          </a>
          . {tx.desc2}
        </p>
      </div>
    </div>
  )
}
