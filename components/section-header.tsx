interface SectionHeaderProps {
  title: string
  subtitle: string
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-9">
      <div className="w-12 h-[3px] bg-gold rounded-sm mb-2.5" />
      <h2 className="font-serif text-[26px] font-semibold text-navy mb-1.5">{title}</h2>
      <p className="text-muted-foreground text-sm">{subtitle}</p>
    </div>
  )
}
