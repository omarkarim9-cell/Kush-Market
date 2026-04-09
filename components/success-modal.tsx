"use client"

import { useEffect } from "react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-navy/60 z-[999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-10 max-w-[420px] w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <div className="w-[60px] h-[60px] bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-5">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1A7A4A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className="font-serif text-[22px] text-navy mb-2.5">Order Request Received!</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Thank you! Please complete your payment using the details provided, then WhatsApp us your
          receipt. We&apos;ll confirm your order within 24 hours.
        </p>

        <button
          onClick={onClose}
          className="bg-navy text-gold2 px-7 py-2.5 rounded-lg text-sm font-medium hover:bg-navy2 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
