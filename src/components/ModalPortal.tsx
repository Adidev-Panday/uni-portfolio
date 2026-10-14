'use client'
// Renders children into document.body instead of in place.
// A position: fixed modal is only truly fixed to the viewport if none of
// its ancestors have a transform/filter/perspective set, since any of
// those create a new containing block for fixed descendants. The modal
// push-back effect (body.modal-open main { transform: scale(...) })
// does exactly that to <main>, so any modal rendered inside it would
// render relative to <main>'s box instead of the viewport. Portaling
// straight to <body> sidesteps that entirely.
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export default function ModalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return createPortal(children, document.body)
}
