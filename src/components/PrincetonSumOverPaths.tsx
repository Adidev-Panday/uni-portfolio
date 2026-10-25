'use client'
// Princeton-only "sum over paths" diagram: a Feynman-diagram riff on the
// essay thesis (many possible versions of Adi fan out from one point,
// most cancel, one survives and lands at Princeton). Renders null for
// every other school -- the parent only mounts this for Princeton.
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'

const VIEW_W = 900
const VIEW_H = 280
const ORIGIN = { x: 50, y: 140 }
const TARGET = { x: 840, y: 140 }

type CancelPath = {
  key: string
  label: string
  labelX: number
  labelY: number
  d: string
}

// Five canceled paths, fanning out above and below the surviving one,
// each tapering off (via a fade gradient) before the right third of
// the diagram.
const CANCELED_PATHS: CancelPath[] = [
  {
    key: 'lawyer',
    label: 'LAWYER-ADI (mom’s wish)',
    labelX: 300,
    labelY: 18,
    d: `M ${ORIGIN.x} ${ORIGIN.y} C 250 20, 430 10, 600 32`,
  },
  {
    key: 'cricket',
    label: 'CRICKET-ADI (age 12)',
    labelX: 300,
    labelY: 68,
    d: `M ${ORIGIN.x} ${ORIGIN.y} C 230 70, 400 58, 570 78`,
  },
  {
    key: 'violin',
    label: 'VIOLIN-ONLY-ADI (dropped physics)',
    labelX: 300,
    labelY: 108,
    d: `M ${ORIGIN.x} ${ORIGIN.y} C 220 112, 380 104, 540 110`,
  },
  {
    key: 'resentful',
    label: 'RESENTFUL-TEEN-ADI (said yes to the ride)',
    labelX: 300,
    labelY: 196,
    d: `M ${ORIGIN.x} ${ORIGIN.y} C 230 190, 400 204, 560 200`,
  },
  {
    key: 'youtube',
    label: 'YOUTUBE-STATIC-ADI (never built airflowns)',
    labelX: 300,
    labelY: 246,
    d: `M ${ORIGIN.x} ${ORIGIN.y} C 250 250, 420 262, 580 238`,
  },
]

const SURVIVOR_D = `M ${ORIGIN.x} ${ORIGIN.y} C 260 118, 480 160, ${TARGET.x} ${TARGET.y}`

type Node = { x: number; y: number; label: string }

const SURVIVOR_NODES: Node[] = [
  { x: 260, y: 120, label: '2026 · BUILT airflowns.netlify.app' },
  { x: 500, y: 158, label: '2026 · COLD-EMAILED PROF. HULTMARK' },
  { x: 770, y: 140, label: '2027 · TEAM ORBITAL, TIGERCUB LAUNCH' },
]

// A straight line's length is just the distance formula, so these can be
// computed up front without a DOM measurement pass.
function approxCurveLength(d: string): number {
  const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? []
  // [startX, startY, c1x, c1y, c2x, c2y, endX, endY]
  const [sx, sy, , , , , ex, ey] = nums
  const straight = Math.hypot(ex - sx, ey - sy)
  return straight * 1.18 // curves run a bit longer than their chord
}

export default function PrincetonSumOverPaths() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' })
  const [reducedMotion, setReducedMotion] = useState(false)
  const [drawn, setDrawn] = useState(false)
  const [canceledFaded, setCanceledFaded] = useState(false)
  const [nodesShown, setNodesShown] = useState(0)

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (!inView) return
    if (reducedMotion) {
      setDrawn(true)
      setCanceledFaded(true)
      setNodesShown(SURVIVOR_NODES.length)
      return
    }
    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => setDrawn(true), 30))
    // Draw-in: 800ms + up to 150ms*5 stagger, then the cancel fade (400ms).
    const drawEnd = 800 + 150 * CANCELED_PATHS.length
    timers.push(setTimeout(() => setCanceledFaded(true), drawEnd))
    SURVIVOR_NODES.forEach((_, i) => {
      timers.push(setTimeout(() => setNodesShown(i + 1), drawEnd + 450 + i * 220))
    })
    return () => timers.forEach(clearTimeout)
  }, [inView, reducedMotion])

  const triggered = reducedMotion ? true : inView

  return (
    <div ref={ref} className="max-w-[900px] mx-auto">
      <div className="relative w-full" style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="psop-cancel-fade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
              <stop offset="62%" stopColor="currentColor" stopOpacity="0.9" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Five canceled paths */}
          <g
            className="text-muted"
            style={{
              color: 'color-mix(in srgb, currentColor 40%, transparent)',
              transition: reducedMotion ? 'none' : 'opacity 400ms ease-out',
              opacity: !triggered ? 1 : canceledFaded ? 0.25 : 1,
            }}
          >
            {CANCELED_PATHS.map((p, i) => {
              const len = approxCurveLength(p.d)
              return (
                <path
                  key={p.key}
                  d={p.d}
                  fill="none"
                  stroke="url(#psop-cancel-fade)"
                  strokeWidth={1}
                  strokeDasharray={len}
                  strokeDashoffset={reducedMotion ? 0 : drawn ? 0 : len}
                  style={{
                    transition: reducedMotion
                      ? 'none'
                      : `stroke-dashoffset 800ms ease-out ${i * 150}ms`,
                  }}
                />
              )
            })}
          </g>

          {/* The surviving path */}
          {(() => {
            const len = approxCurveLength(SURVIVOR_D)
            return (
              <path
                d={SURVIVOR_D}
                fill="none"
                stroke="#E77500"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray={len}
                strokeDashoffset={reducedMotion ? 0 : drawn ? 0 : len}
                style={{
                  transition: reducedMotion
                    ? 'none'
                    : `stroke-dashoffset 800ms ease-out ${CANCELED_PATHS.length * 150}ms`,
                }}
              />
            )
          })()}

          {/* Origin dot */}
          <circle cx={ORIGIN.x} cy={ORIGIN.y} r={5} fill="#FF8F1C" />

          {/* Survivor nodes */}
          {SURVIVOR_NODES.map((n, i) => (
            <motion.circle
              key={i}
              cx={n.x}
              cy={n.y}
              r={4.5}
              fill="#FF8F1C"
              initial={{ scale: 0 }}
              animate={{ scale: nodesShown > i ? 1 : 0 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.2 }}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            />
          ))}

          {/* Target */}
          <motion.circle
            cx={TARGET.x}
            cy={TARGET.y}
            r={7}
            fill="#E77500"
            animate={
              triggered && !reducedMotion ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }
            }
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>

        {/* HTML label overlay, positioned by percentage so text stays
            crisp and can wrap/shrink independently of SVG scaling. */}
        <div className="absolute inset-0">
          <span
            className="absolute -translate-x-1/2 translate-y-2 font-mono text-[9px] sm:text-[10px] text-muted whitespace-nowrap"
            style={{ left: `${(ORIGIN.x / VIEW_W) * 100}%`, top: `${(ORIGIN.y / VIEW_H) * 100}%` }}
          >
            12-YEAR-OLD ADI
          </span>

          {CANCELED_PATHS.map((p) => (
            <span
              key={p.key}
              className="absolute -translate-x-1/2 -translate-y-full font-mono text-[8px] sm:text-[9px] text-muted leading-tight text-center max-w-[9rem] sm:max-w-[11rem] whitespace-normal transition-opacity duration-300"
              style={{
                left: `${(p.labelX / VIEW_W) * 100}%`,
                top: `${(p.labelY / VIEW_H) * 100}%`,
                opacity: !triggered ? 0 : canceledFaded ? 0.4 : 0.7,
              }}
            >
              {p.label}
            </span>
          ))}

          {SURVIVOR_NODES.map((n, i) => (
            <span
              key={i}
              className="absolute -translate-x-1/2 font-mono text-[8px] sm:text-[9px] text-[#E77500] leading-tight text-center max-w-[8rem] sm:max-w-[10rem] whitespace-normal transition-opacity duration-300"
              style={{
                left: `${(n.x / VIEW_W) * 100}%`,
                top: `${(n.y / VIEW_H) * 100}%`,
                transform: i === 2 ? 'translate(-50%, -115%)' : 'translate(-50%, 10px)',
                opacity: nodesShown > i ? 1 : 0,
              }}
            >
              {n.label}
            </span>
          ))}

          <span
            className="absolute -translate-x-1/2 translate-y-2 font-mono text-[9px] sm:text-[10px] font-semibold text-[#E77500] whitespace-nowrap"
            style={{ left: `${(TARGET.x / VIEW_W) * 100}%`, top: `${(TARGET.y / VIEW_H) * 100}%` }}
          >
            PLAN-A: MAE @ PRINCETON
          </span>
        </div>
      </div>

      <p className="mt-8 font-serif italic text-muted text-sm sm:text-base text-center max-w-[48ch] mx-auto">
        Feynman: a particle moving between two points takes every possible path. Most cancel. One survives.
      </p>
    </div>
  )
}
