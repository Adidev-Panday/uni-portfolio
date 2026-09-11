// Soft "lights coming on" flourish: a warm glow blooms across the screen
// and fades. Used as a literal nod to Berkeley's motto "Fiat Lux" when the
// Berkeley theme is selected. No dependency, cleans up after itself, and
// respects reduced motion.

export function fireLightsOn(color: string = '#FDB515') {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const glow = document.createElement('div')
  glow.style.position = 'fixed'
  glow.style.inset = '0'
  glow.style.pointerEvents = 'none'
  glow.style.zIndex = '9998'
  glow.style.background = `radial-gradient(ellipse 70% 60% at 50% 32%, ${color}66 0%, ${color}22 40%, transparent 72%)`
  glow.style.opacity = '0'
  glow.style.transition = 'opacity 0.6s ease'
  document.body.appendChild(glow)

  requestAnimationFrame(() => {
    glow.style.opacity = '1'
    setTimeout(() => {
      glow.style.opacity = '0'
      setTimeout(() => glow.remove(), 700)
    }, 600)
  })
}
