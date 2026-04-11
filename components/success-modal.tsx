"use client"

import { useLang } from "@/contexts/lang-context"
import { t } from "@/lib/translations"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  const { lang } = useLang()
  const tx = t[lang].modal

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" style={{ background: "rgba(11,29,58,0.6)" }}>
      <div className="bg-white rounded-2xl p-10 max-w-[420px] w-full text-center">
        <div className="w-[60px] h-[60px] bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A7A4A" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="font-serif text-navy mb-2.5" style={{ fontSize: 22 }}>{tx.title}</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {tx.desc}{" "}
          <strong>+971 50 420 7781</strong>.{" "}
          {tx.desc2}
        </p>
        <button
          onClick={onClose}
          className="bg-navy text-gold2 border-none px-7 py-3 rounded-lg text-sm font-medium cursor-pointer"
        >
          {tx.btn}
        </button>
      </div>
    </div>
  )
}
