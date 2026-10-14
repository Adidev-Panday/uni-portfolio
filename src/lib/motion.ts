// Shared Motion presets (Apple Design house style).
// Critically damped by default: no overshoot on anything that is not
// momentum-driven (hover, tap, modal/drawer open-close, layout pills).
// Reserve bounce for an actual flick/drag release, which nothing on this
// site currently has, so every preset below is bounce: 0.

export const springUI = { type: 'spring', bounce: 0, duration: 0.35 } as const

// Popup / modal / drawer enter-exit: fades and settles in place. Pair with
// a per-trigger `transformOrigin` at the call site for spatial consistency
// (§7) instead of always scaling from the viewport center.
export const modalCardAnim = {
  initial: { opacity: 0, scale: 0.93, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.93, y: 8 },
  transition: springUI,
}

// Press feedback: fires on pointer-down via Motion's whileTap, settles fast.
export const pressTap = { scale: 0.97 }
export const pressTransition = { type: 'spring', bounce: 0, duration: 0.15 } as const
