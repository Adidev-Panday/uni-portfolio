// Lightweight canvas confetti burst. No external dependency: this keeps the
// Princeton easter eggs (school selection + Locomotive cheer finale) cheap
// and self-contained. Cleans up after itself and respects reduced motion.

type ConfettiPiece = {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  vr: number
  size: number
  color: string
  shape: 'rect' | 'circle'
}

const DEFAULT_COLORS = ['#FF8F1C', '#E77500', '#1A1A1A', '#F5F1E8']

export function fireConfetti(colors: string[] = DEFAULT_COLORS) {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const canvas = document.createElement('canvas')
  canvas.style.position = 'fixed'
  canvas.style.inset = '0'
  canvas.style.width = '100vw'
  canvas.style.height = '100vh'
  canvas.style.pointerEvents = 'none'
  canvas.style.zIndex = '9999'
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = window.innerWidth * dpr
  canvas.height = window.innerHeight * dpr
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    canvas.remove()
    return
  }
  ctx.scale(dpr, dpr)

  const originX = window.innerWidth / 2
  const originY = window.innerHeight * 0.35
  const pieces: ConfettiPiece[] = Array.from({ length: 70 }, () => {
    const angle = Math.random() * Math.PI * 2
    const speed = 3 + Math.random() * 6
    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      rotation: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      size: 5 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }
  })

  const gravity = 0.15
  const drag = 0.995
  const maxFrames = 130
  let frame = 0

  function tick() {
    if (!ctx) return
    frame++
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const fade = frame > maxFrames - 30 ? Math.max(0, (maxFrames - frame) / 30) : 1

    for (const p of pieces) {
      p.vy += gravity
      p.vx *= drag
      p.vy *= drag
      p.x += p.vx
      p.y += p.vy
      p.rotation += p.vr

      ctx.save()
      ctx.globalAlpha = fade
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.fillStyle = p.color
      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
      } else {
        ctx.beginPath()
        ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    }

    if (frame < maxFrames) {
      requestAnimationFrame(tick)
    } else {
      canvas.remove()
    }
  }

  requestAnimationFrame(tick)
}
