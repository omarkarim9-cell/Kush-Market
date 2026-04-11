"use client"

import Link from "next/link"
import { useLang } from "@/contexts/lang-context"
import { t } from "@/lib/translations"

export function Footer() {
  const { lang, isRTL } = useLang()
  const tx = t[lang].footer

  return (
    <footer 
      className="bg-navy text-white/50 text-center py-6 px-8 text-[13px]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <p>
        {tx.rights}{" "}
        <Link href="https://kush-edu.com" className="text-gold hover:underline">
          kush-edu.com
        </Link>
      </p>
    </footer>
  )
}
