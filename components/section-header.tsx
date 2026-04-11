"use client"

import { useLang } from "@/contexts/lang-context"

interface SectionHeaderProps {
  title: string
  subtitle: string
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  const { isRTL } = useLang()
  
  return (
    <div className="mb-9 text-center" dir={isRTL ? "rtl" : "ltr"}>
      <div className="w-12 h-[3px] bg-gold rounded-sm mb-2.5 mx-auto" />
      <h2 className="font-serif text-[26px] font-semibold text-navy mb-1.5">{title}</h2>
      <p className="text-muted-foreground text-sm">{subtitle}</p>
    </div>
  )
}
