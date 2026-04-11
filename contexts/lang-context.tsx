"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Lang } from "@/lib/translations"

interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
  isRTL: boolean
}

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  isRTL: false,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en")

  useEffect(() => {
    const saved = localStorage.getItem("kush-lang") as Lang
    if (saved === "ar" || saved === "en") setLangState(saved)
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem("kush-lang", l)
  }

  const isRTL = lang === "ar"

  // Apply RTL to document
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr"
    document.documentElement.lang = lang
  }, [isRTL, lang])

  return (
    <LangContext.Provider value={{ lang, setLang, isRTL }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
