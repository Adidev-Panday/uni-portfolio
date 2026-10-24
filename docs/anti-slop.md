# Anti-slop rulebook

This site used to read as "built by Claude": indigo-to-purple accents,
`rounded-2xl` everywhere, Inter, a centered hero with three pill buttons,
uniform section padding, soft glow shadows, glassmorphism as decoration.
This document is the checklist that keeps it from drifting back.

Treat every rule below as mandatory, not aspirational. If a change
reintroduces something on the never list, it gets reverted, not debated.

## Never use

- Indigo, violet, or purple as the primary brand color in the base theme.
- Any "indigo to purple," "purple to pink," or "blue to purple" gradient.
  Any decorative gradient on text, buttons, backgrounds, or badges, period.
- Inter, Poppins, or Roboto.
- `rounded-2xl` or `rounded-3xl` on cards. Default radius is small
  (4–8px, i.e. `rounded` / `rounded-md`) or zero.
- Soft diffuse "glow" shadows under buttons and cards.
- Glassmorphism (`backdrop-filter: blur` + translucent white/black) as
  decoration. It stays only where functionally necessary (sticky nav over
  the hero photo) — nowhere else.
- Three equally sized cards in a row with icons in colored circles.
- A centered hero with tagline + headline + body + two primary buttons.
- Uniform vertical padding on every section. Vary density deliberately.
- Thin-line Lucide-style icons as decoration. Icons stay functional only
  (external-link arrow, download arrow).
- Emoji as section decoration.

## Tokens (`src/styles/tokens.css`)

Everything is driven by five variables: `--ink`, `--paper`, `--accent`
(as `--accent-rgb` / `--accent-fill`), `--rule`, `--muted`. No raw hex
anywhere else in the base theme. School themes may override the accent
variables on top of this when active — see globals.css.

## Color discipline

`--accent` appears on at most 2 elements per screen. Everything else is
`--ink` on `--paper` (or inverted in dark mode). Scarcity of color is the
signal that a human, not a model, made the call. Section separation comes
from a hairline `--rule` divider or a 3–5% lightness shift in `--paper`,
never a color wash or gradient.

## Typography

- Display / headings: Fraunces (serif, optical sizing on, soft axis).
- Body: IBM Plex Sans.
- Labels, section numbers, metadata, dates: JetBrains Mono, always
  `--muted`, always small.

## Surfaces

- Card radius: 6px default, never 24px.
- Shadows: one flat elevation at most — `0 1px 0 var(--rule)`. No glow.
- Default to no card. If a hairline rule can separate content from its
  neighbor, use that instead of a container.

## Layout

12-column grid with real asymmetry — sections vary column span and
density on purpose. Every section carries an editorial eyebrow: a mono
section number + hairline rule, in `--muted`, not `--accent`.

## Links / buttons

External-link arrows are an inline mono `↗`, not a boxed icon. Real
`text-decoration: underline` with `text-underline-offset: 4px`, not
animated bars. A required primary button is a tight rectangle,
`--accent` fill, `--paper` text, 4px radius, zero shadow, hover inverts
colors over 150ms.
