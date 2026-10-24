'use client'
// Shared editorial confirmation-panel shell: centered in the viewport,
// --paper background with a hairline border and a hairline rule under
// the heading. Used by the admissions-officer flow and the Projects/
// Research confirmation modals so all three share one restyled shell.
import { motion } from 'motion/react'

export const panelTransition = { type: 'spring', bounce: 0, duration: 0.35 } as const

export function ModalBackdrop({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      key="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="modal-scrim fixed inset-0 z-[200] bg-ink/55"
      onClick={onClick}
      aria-hidden="true"
    />
  )
}

interface ModalPanelProps {
  titleId: string
  title: string
  onClose: () => void
  children: React.ReactNode
  maxWidthClass?: string
}

export function ModalPanel({
  titleId,
  title,
  onClose,
  children,
  maxWidthClass = 'max-w-lg',
}: ModalPanelProps) {
  return (
    <motion.div
      key="panel"
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 8 }}
      transition={panelTransition}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
    >
      <div
        className={`relative w-full ${maxWidthClass} bg-paper border border-rule rounded px-6 sm:px-10 py-8 sm:py-10 max-h-[85dvh] overflow-y-auto pointer-events-auto`}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-6 font-mono text-xs text-muted hover:text-ink transition-colors"
          aria-label="Dismiss"
        >
          close
        </button>
        <h2 id={titleId} className="font-serif text-2xl text-ink pr-16">
          {title}
        </h2>
        <div className="h-px bg-rule mt-4 mb-6" />
        {children}
      </div>
    </motion.div>
  )
}
