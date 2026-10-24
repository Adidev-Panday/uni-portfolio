// Shared section header: mono eyebrow (number + hairline rule), then a
// large serif title, then an optional mono metadata line. Used at the
// top of every section so the editorial pattern stays consistent.
interface SectionHeaderProps {
  number?: string  // e.g. "01." (omit to hide the number label)
  title: string
  subtitle?: string
}

export default function SectionHeader({ number, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-12 section-header">
      {number && (
        <div className="flex items-baseline gap-4 mb-5">
          <span className="font-mono text-xs text-muted tracking-widest shrink-0">
            {number}
          </span>
          <div className="h-px flex-1 bg-rule" />
        </div>
      )}
      <h2 className="font-serif text-ink text-[clamp(2.5rem,5vw,5rem)] leading-[1.02] tracking-[-0.02em]">
        {title}
      </h2>
      {subtitle && (
        <p className="font-mono text-xs text-muted mt-3 tracking-wide">
          {subtitle}
        </p>
      )}
    </div>
  )
}
