"use client"

import { useLang } from "@/contexts/lang-context"
import { t } from "@/lib/translations"

export function Footer() {
  const { lang } = useLang()
  const tx = t[lang].footer

  return (
    <footer className="bg-navy text-white/50 text-center py-6 px-8 text-sm">
      <p>
        {tx.rights} &nbsp;|&nbsp;{" "}
        <a href="https://kush-edu.com" className="text-gold hover:underline">kush-edu.com</a>
        &nbsp;|&nbsp;{" "}
        <a href="mailto:info@kush-edu.com" className="text-gold hover:underline">info@kush-edu.com</a>
        &nbsp;|&nbsp;{" "}
        <a href="/terms" className="text-gold hover:underline">
          {lang === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}
        </a>
      </p>
    </footer>
  )
}
