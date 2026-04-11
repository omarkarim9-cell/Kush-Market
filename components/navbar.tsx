"use client"

import Link from "next/link"
import Image from "next/image"
import { useLang } from "@/contexts/lang-context"
import { t } from "@/lib/translations"

export function Navbar() {
  const { lang, setLang, isRTL } = useLang()
  const tx = t[lang].nav

  return (
    <nav 
      className="bg-navy px-8 flex items-center justify-between h-[68px] sticky top-0 z-50"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Link href="https://kush-edu.com" className="flex items-center gap-2.5">
        <Image
          src="https://kush-edu.com/wp-content/uploads/2025/07/Ad-Kush-logo.jpg"
          alt="Kush logo"
          width={38}
          height={38}
          className="h-[38px] w-auto"
        />
        <span className="font-serif text-lg text-gold2 tracking-wide">
          {lang === "ar" ? "كوش" : "KUSH"}
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-6">
        <ul className="flex gap-8 list-none">
          <li>
            <Link
              href="#products"
              className="text-white/75 text-sm font-normal hover:text-gold2 transition-colors"
            >
              {tx.shop}
            </Link>
          </li>
          <li>
            <Link
              href="#how-it-works"
              className="text-white/75 text-sm font-normal hover:text-gold2 transition-colors"
            >
              {tx.howItWorks}
            </Link>
          </li>
          <li>
            <Link
              href="#order-form"
              className="text-white/75 text-sm font-normal hover:text-gold2 transition-colors"
            >
              {tx.order}
            </Link>
          </li>
          <li>
            <Link
              href="#payment"
              className="text-white/75 text-sm font-normal hover:text-gold2 transition-colors"
            >
              {tx.payment}
            </Link>
          </li>
          <li>
            <Link
              href="https://wa.me/971501234567"
              target="_blank"
              className="bg-gold text-navy px-5 py-2 rounded-md text-sm font-medium hover:bg-gold2 transition-colors"
            >
              {tx.whatsapp}
            </Link>
          </li>
        </ul>

        {/* Language toggle */}
        <button
          onClick={() => setLang(lang === "en" ? "ar" : "en")}
          className="flex items-center gap-1.5 border border-white/20 rounded-full px-3 py-1.5 text-sm text-white/80 hover:border-gold hover:text-gold2 transition-colors"
        >
          <span>{lang === "en" ? "🇦🇪" : "🇬🇧"}</span>
          <span>{lang === "en" ? "عربي" : "EN"}</span>
        </button>
      </div>

      {/* Mobile language toggle */}
      <button
        onClick={() => setLang(lang === "en" ? "ar" : "en")}
        className="md:hidden flex items-center gap-1.5 border border-white/20 rounded-full px-3 py-1.5 text-sm text-white/80"
      >
        <span>{lang === "en" ? "🇦🇪" : "🇬🇧"}</span>
        <span>{lang === "en" ? "عربي" : "EN"}</span>
      </button>
    </nav>
  )
}
