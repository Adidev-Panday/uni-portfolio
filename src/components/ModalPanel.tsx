'use client'
// Shared editorial confirmation-panel shell: slides up from the bottom
// edge instead of scaling in from the center, --paper background with
// a hairline rule under the heading. Used by the admissions-officer
// flow and the Projects/Research confirmation modals so all three
// share one restyled shell instead of three centered rounded cards.
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
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={panelTransition}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={`fixed inset-x-0 bottom-0 z-[201] mx-auto w-full ${maxWidthClass} bg-paper border-t border-rule px-6 sm:px-10 py-8 sm:py-10 max-h-[85dvh] overflow-y-auto`}
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
    </motion.div>
  )
}
