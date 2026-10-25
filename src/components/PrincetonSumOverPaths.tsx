'use client'
// Princeton-only "sum over paths" diagram: a Feynman-diagram riff on the
// essay thesis (many possible versions of Adi fan out from one point,
// most cancel, one survives and lands at Princeton). Renders null for
// every other school -- the parent only mounts this for Princeton.
//
// Two independent layouts share one animation clock: a horizontal fan
// for md+ and a vertical stack for mobile, since forcing one coordinate
// system to serve both orientations (via transforms) made the labels
// impossible to hand-position without collisions.
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'

type CancelPath = { key: string; label: string; peakX: number; peakY: number; side: 'above' | 'below' | 'left' | 'right'; d: string }
type Node = { x: number; y: number; year: string; text: string }

// ---------------------------------------------------------------------
// Desktop geometry (viewBox 0 0 1100 520)
// ---------------------------------------------------------------------
const D_VIEW_W = 1100
const D_VIEW_H = 520
const D_ORIGIN = { x: 70, y: 260 }
// Pulled in from the true edge (x=1030 of 1100) so the bold
// "PLAN-A: MAE @ PRINCETON" label, which is wide, has margin to clear
// the viewport at narrower desktop widths without clipping.
const D_TARGET = { x: 960, y: 260 }

// The early stretch of each "above" curve hugs the baseline (control1
// stays near y=255-258) so the steep rise toward the peak happens past
// x=450, clear of the first survivor node's label stack. Peaks land at
// x=640, spaced 85px+ apart vertically.
const D_CANCELED: CancelPath[] = [
  { key: 'lawyer', label: 'LAWYER-ADI (mom’s wish)', peakX: 640, peakY: 40, side: 'above', d: 'M70,260 C280,248 640,40 900,95' },
  { key: 'cricket', label: 'CRICKET-ADI (age 12)', peakX: 640, peakY: 130, side: 'above', d: 'M70,260 C300,253 640,130 900,175' },
  { key: 'violin', label: 'VIOLIN-ONLY-ADI (dropped physics)', peakX: 640, peakY: 210, side: 'above', d: 'M70,260 C320,258 640,210 900,235' },
  { key: 'resentful', label: 'RESENTFUL-TEEN-ADI (said yes to the ride)', peakX: 640, peakY: 380, side: 'below', d: 'M70,260 C300,267 640,380 900,330' },
  { key: 'youtube', label: 'YOUTUBE-STATIC-ADI (never built airflowns)', peakX: 640, peakY: 460, side: 'below', d: 'M70,260 C280,272 640,460 900,390' },
]

// Flatter survivor arc, kept within a y=200-320 "center channel" so it
// never shares vertical space with the canceled paths' peaks (which
// live above y=210 or below y=380) or crosses their early, near-flat
// stretch.
const D_SURVIVOR_D = 'M70,260 C320,242 720,300 960,260'
const D_NODES: Node[] = [
  { x: 230, y: 248, year: '2026', text: 'built airflowns.netlify.app' },
  { x: 620, y: 300, year: '2026', text: 'cold-emailed Prof. Hultmark' },
  { x: 830, y: 270, year: '2027', text: 'Team Orbital, TigerCub launch' },
]

// ---------------------------------------------------------------------
// Mobile geometry (viewBox 0 0 380 760), vertical stack
// ---------------------------------------------------------------------
const M_VIEW_W = 380
const M_VIEW_H = 760
const M_ORIGIN = { x: 190, y: 50 }
const M_TARGET = { x: 190, y: 710 }

// Peaks stay well clear of the viewport edges (roughly x=90..280 out of
// a 380-wide viewBox), since these are HTML labels sized in real pixels
// against the rendered container width, not SVG units that scale down.
const M_CANCELED: CancelPath[] = [
  { key: 'lawyer', label: 'LAWYER-ADI', peakX: 120, peakY: 170, side: 'left', d: 'M190,50 C150,110 120,170 135,260' },
  { key: 'cricket', label: 'CRICKET-ADI', peakX: 135, peakY: 250, side: 'left', d: 'M190,50 C160,160 135,250 150,320' },
  { key: 'violin', label: 'VIOLIN-ONLY-ADI', peakX: 155, peakY: 330, side: 'left', d: 'M190,50 C170,200 155,330 165,380' },
  { key: 'resentful', label: 'RESENTFUL-TEEN-ADI', peakX: 260, peakY: 250, side: 'right', d: 'M190,50 C220,160 260,250 245,320' },
  { key: 'youtube', label: 'YOUTUBE-STATIC-ADI', peakX: 245, peakY: 170, side: 'right', d: 'M190,50 C230,110 245,170 230,260' },
]

const M_SURVIVOR_D = 'M190,50 C120,260 260,480 190,710'
const M_NODES: Node[] = [
  { x: 150, y: 230, year: '2026', text: 'built airflowns.netlify.app' },
  { x: 235, y: 430, year: '2026', text: 'cold-emailed Prof. Hultmark' },
  { x: 160, y: 610, year: '2027', text: 'Team Orbital, TigerCub launch' },
]

// A straight-line distance is a good enough stand-in for a cubic
// bezier's length for a stroke-dashoffset draw animation -- the
// survivor curve is gentle, so the overshoot from the true arc length
// is small and invisible once eased.
function approxCurveLength(d: string): number {
  const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? []
  const [sx, sy, , , , , ex, ey] = nums
  return Math.hypot(ex - sx, ey - sy) * 1.18
}

const DRAW_MS = 1000
const STAGGER_MS = 100
const FADE_MS = 400
const CANCELED_REST_OPACITY = 0.4
const NODE_STAGGER_MS = 300

export default function PrincetonSumOverPaths() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' })
  const [reducedMotion, setReducedMotion] = useState(false)
  const [drawn, setDrawn] = useState(false)
  const [canceledFaded, setCanceledFaded] = useState(false)
  const [nodesShown, setNodesShown] = useState(0)
  const [sumFlash, setSumFlash] = useState(false)
  const [sumLine, setSumLine] = useState(false)
  const sumPlayingRef = useRef(false)
  const sumTypedRef = useRef('')
  const sumTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (!inView) return
    if (reducedMotion) {
      setDrawn(true)
      setCanceledFaded(true)
      setNodesShown(D_NODES.length)
      return
    }
    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => setDrawn(true), 30))
    const drawEnd = DRAW_MS + STAGGER_MS * D_CANCELED.length
    timers.push(setTimeout(() => setCanceledFaded(true), drawEnd))
    D_NODES.forEach((_, i) => {
      timers.push(setTimeout(() => setNodesShown(i + 1), drawEnd + 300 + i * NODE_STAGGER_MS))
    })
    return () => timers.forEach(clearTimeout)
  }, [inView, reducedMotion])

  // Easter egg: typing "sum" while the diagram exists (i.e. while the
  // Princeton theme is active, since the parent only mounts this
  // component then) lights the five canceled paths up in bright orange
  // for a moment, then lets them fade back to their muted state.
  const playSumReveal = () => {
    if (sumPlayingRef.current) return
    sumPlayingRef.current = true
    sumTimersRef.current.forEach(clearTimeout)
    sumTimersRef.current = []

    setSumFlash(true)
    setSumLine(true)

    if (reducedMotion) {
      sumTimersRef.current.push(
        setTimeout(() => {
          setSumFlash(false)
          setSumLine(false)
          sumPlayingRef.current = false
        }, 1200),
      )
      return
    }

    sumTimersRef.current.push(setTimeout(() => setSumFlash(false), 500))
    sumTimersRef.current.push(
      setTimeout(() => {
        setSumLine(false)
        sumPlayingRef.current = false
      }, 2500),
    )
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return
      if (e.key.length !== 1) return
      sumTypedRef.current = (sumTypedRef.current + e.key.toLowerCase()).slice(-3)
      if (sumTypedRef.current === 'sum') {
        sumTypedRef.current = ''
        playSumReveal()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion])

  useEffect(() => () => sumTimersRef.current.forEach(clearTimeout), [])

  const triggered = reducedMotion ? true : inView

  // Shared sub-renderer: one orientation's worth of SVG + label overlay.
  // viewW/viewH/origin/target/canceled/survivorD/nodes differ between
  // the desktop and mobile geometry; everything else (timing state) is
  // the same clock driving both.
  function renderDiagram(opts: {
    viewW: number
    viewH: number
    origin: { x: number; y: number }
    target: { x: number; y: number }
    canceled: CancelPath[]
    survivorD: string
    nodes: Node[]
  }) {
    const { viewW, viewH, origin, target, canceled, survivorD, nodes } = opts
    const survivorLen = approxCurveLength(survivorD)

    // aspect-ratio (not a flat min-height) keeps the SVG's own scaling in
    // lockstep with the percentage-positioned HTML label overlay at every
    // container width -- a fixed height would let the SVG's default
    // preserveAspectRatio letterbox independently of the labels below
    // max-width, drifting the two out of alignment. At the container's
    // design width (1100px desktop, ~380px mobile) this already lands
    // at the target ~520px / ~640px+ heights the layout calls for.
    return (
      <div className="relative w-full" style={{ aspectRatio: `${viewW} / ${viewH}` }}>
        <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${viewW} ${viewH}`} aria-hidden="true">
          <defs>
            {canceled.map((p, i) => (
              <clipPath key={`clip-${p.key}`} id={`psop-clip-${p.key}`} clipPathUnits="userSpaceOnUse">
                <rect
                  x={0}
                  y={0}
                  width={reducedMotion ? viewW : drawn ? viewW : 0}
                  height={viewH}
                  style={{
                    transition: reducedMotion ? 'none' : `width ${DRAW_MS}ms ease-out ${i * STAGGER_MS}ms`,
                  }}
                />
              </clipPath>
            ))}
          </defs>

          {/* Five canceled paths: dashed "ghost" lines, wiped in left to
              right via a clip-path rect, then settle to a muted rest
              opacity so their single peak-point labels stay legible. */}
          <g
            className="text-muted"
            style={{
              color: 'color-mix(in srgb, currentColor 50%, transparent)',
              transition: reducedMotion ? 'none' : `opacity ${FADE_MS}ms ease-out`,
              opacity: !triggered ? 0 : canceledFaded ? CANCELED_REST_OPACITY : 1,
            }}
          >
            {canceled.map((p) => (
              <path
                key={p.key}
                d={p.d}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                clipPath={`url(#psop-clip-${p.key})`}
              />
            ))}
          </g>

          {/* "sum" reveal: bright-orange ghosts of the five canceled
              paths, overlaid on top and only visible while flashing. */}
          <g aria-hidden="true">
            {canceled.map((p) => (
              <path
                key={`ghost-${p.key}`}
                d={p.d}
                fill="none"
                stroke="#FF8F1C"
                strokeWidth={1.8}
                strokeDasharray="4 4"
                style={{
                  opacity: sumFlash ? 1 : 0,
                  transition: reducedMotion ? 'opacity 400ms ease' : 'opacity 250ms ease',
                }}
              />
            ))}
          </g>

          {/* The surviving path: solid, heavier, with a soft glow. */}
          <path
            d={survivorD}
            fill="none"
            stroke="#E77500"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={survivorLen}
            strokeDashoffset={reducedMotion ? 0 : drawn ? 0 : survivorLen}
            style={{
              transition: reducedMotion ? 'none' : `stroke-dashoffset ${DRAW_MS}ms ease-out ${canceled.length * STAGGER_MS}ms`,
              filter: 'drop-shadow(0 0 12px rgba(231, 117, 0, 0.25))',
            }}
          />

          {/* Origin dot */}
          <circle cx={origin.x} cy={origin.y} r={7} fill="#FF8F1C" />

          {/* Survivor nodes: filled dot + a soft ring at 50% opacity */}
          {nodes.map((n, i) => (
            <g key={i}>
              <motion.circle
                cx={n.x}
                cy={n.y}
                r={7}
                fill="none"
                stroke="#E77500"
                strokeOpacity={0.5}
                strokeWidth={2}
                initial={{ scale: 0 }}
                animate={{ scale: nodesShown > i ? 1 : 0 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                style={{ transformOrigin: `${n.x}px ${n.y}px` }}
              />
              <motion.circle
                cx={n.x}
                cy={n.y}
                r={5}
                fill="#E77500"
                initial={{ scale: 0 }}
                animate={{ scale: nodesShown > i ? 1 : 0 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                style={{ transformOrigin: `${n.x}px ${n.y}px` }}
              />
            </g>
          ))}

          {/* Target: bigger filled circle, a 4px ring, and a glow halo */}
          <g style={{ filter: 'drop-shadow(0 0 16px rgba(231, 117, 0, 0.35))' }}>
            <circle cx={target.x} cy={target.y} r={13} fill="none" stroke="#E77500" strokeOpacity={0.45} strokeWidth={4} />
            <motion.circle
              cx={target.x}
              cy={target.y}
              r={9}
              fill="#E77500"
              animate={triggered && !reducedMotion ? { opacity: [0.75, 1, 0.75] } : { opacity: 1 }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </g>
        </svg>

        {/* HTML label overlay: crisp text, positioned by percentage so it
            scales with the SVG without inheriting its stroke-scaling. */}
        <div className="absolute inset-0">
          <span
            className="absolute -translate-x-1/2 translate-y-3 font-mono text-[12px] text-muted whitespace-nowrap"
            style={{ left: `${(origin.x / viewW) * 100}%`, top: `${(origin.y / viewH) * 100}%` }}
          >
            12-YEAR-OLD ADI
          </span>

          {canceled.map((p) => {
            const vertical = p.side === 'above' || p.side === 'below'
            const transform = p.side === 'above'
              ? 'translate(-50%, -135%)'
              : p.side === 'below'
                ? 'translate(-50%, 35%)'
                : p.side === 'left'
                  ? 'translate(-102%, -50%)'
                  : 'translate(2%, -50%)'
            return (
              <span
                key={p.key}
                className={`absolute font-mono text-[11px] tracking-wide text-muted leading-snug ${vertical ? 'text-center max-w-[11rem]' : 'text-right max-w-[8rem]'} whitespace-normal transition-opacity duration-300`}
                style={{
                  left: `${(p.peakX / viewW) * 100}%`,
                  top: `${(p.peakY / viewH) * 100}%`,
                  transform,
                  opacity: !triggered ? 0 : 0.6,
                  textAlign: p.side === 'right' ? 'left' : undefined,
                }}
              >
                {p.label}
              </span>
            )
          })}

          {nodes.map((n, i) => (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-[135%] font-mono text-[11px] leading-snug text-center max-w-[11rem] whitespace-normal transition-opacity duration-300"
              style={{
                left: `${(n.x / viewW) * 100}%`,
                top: `${(n.y / viewH) * 100}%`,
                opacity: nodesShown > i ? 1 : 0,
              }}
            >
              <span className="block text-muted">{n.year}</span>
              <span className="block text-[#E77500]/80">{n.text}</span>
            </div>
          ))}

          <span
            className="absolute -translate-x-1/2 translate-y-4 font-mono text-[14px] font-bold text-[#E77500] whitespace-nowrap"
            style={{ left: `${(target.x / viewW) * 100}%`, top: `${(target.y / viewH) * 100}%` }}
          >
            PLAN-A: MAE @ PRINCETON
          </span>
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} className="max-w-[1100px] mx-auto">
      <div className="hidden md:block">
        {renderDiagram({
          viewW: D_VIEW_W,
          viewH: D_VIEW_H,
          origin: D_ORIGIN,
          target: D_TARGET,
          canceled: D_CANCELED,
          survivorD: D_SURVIVOR_D,
          nodes: D_NODES,
        })}
      </div>
      <div className="block md:hidden">
        {renderDiagram({
          viewW: M_VIEW_W,
          viewH: M_VIEW_H,
          origin: M_ORIGIN,
          target: M_TARGET,
          canceled: M_CANCELED,
          survivorD: M_SURVIVOR_D,
          nodes: M_NODES,
        })}
      </div>

      <p className="mt-8 font-serif italic text-muted text-sm sm:text-base text-center max-w-[48ch] mx-auto">
        Feynman: a particle moving between two points takes every possible path. Most cancel. One survives.
      </p>

      <p
        className="mt-3 font-mono text-[11px] text-muted text-center transition-opacity duration-500"
        style={{ opacity: sumLine ? 1 : 0 }}
        aria-live="polite"
      >
        Every path, for a moment.
      </p>
    </div>
  )
}
