// Shared section header — number label, title, optional subtitle, accent bar.
// Used at the top of every section for visual consistency.
interface SectionHeaderProps {
  number?: string  // e.g. "01." — omit to hide the number label
  title: string
  subtitle?: string
}

export default function SectionHeader({ number, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-12 section-header">
      {number && (
        <span className="text-accent font-mono text-xs tracking-widest uppercase">
          {number}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">
          {subtitle}
        </p>
      )}
      {/* Gradient accent underline — colours driven by CSS custom properties */}
      <div className="h-px w-16 mt-4 accent-gradient-bar" />
    </div>
  )
}
