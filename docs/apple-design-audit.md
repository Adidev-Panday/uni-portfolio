# Apple Design audit

Pass 1 of the fluid-interface overhaul. Findings below are grouped by surface, each
with a file path, the specific violation, and the skill section it breaks.

## Hero (`src/components/Hero.tsx`)

- Entrance timing/easing (§4): `fadeUp()` uses a one-off cubic-bezier tween, not a
  spring. The headline, tagline, and CTA row are not things a user grabs, so a tween
  is acceptable, but the easing curve should be confirmed ease-out (it is: control
  points front-load the motion, so no fix needed here beyond consistency).
- CTA buttons (§4, §6): `active:scale-95 transition-all duration-200` (lines
  112-114). CSS `:active` does not reliably fire on pointer-down on touch devices
  and cannot be interrupted/blended. Needs `whileTap` with a critically damped
  spring, scale 0.97, matching the Quick Reference default.
- Ambient blobs and scroll indicator (§14): looping `scale`/`y` keyframe animations
  (lines 52-59, 132-137) never check `prefers-reduced-motion`. A vestibular-sensitive
  visitor gets a permanently breathing background with no opt-out.
- Per-school hero glow (`globals.css` `#hero::after`): static, no motion, fine.

## Navbar (`src/components/Navbar.tsx`)

- Scrolled chrome (§12): already does the right thing structurally
  (`backdrop-blur-md` plus translucent bg under `data-scrolled`), but closes with a
  hard `border-b` (line 58) instead of a soft scroll-edge mask, and has no
  `prefers-reduced-transparency` / `prefers-contrast` fallback.
- Nav-pill (`layoutId="nav-pill"`, lines 99 and 126): spring config
  `stiffness 380, damping 30` gives a damping ratio around 0.77, underdamped. The
  pill overshoots sliding between tabs even though this is a plain click, not a
  flick, which violates "no bounce unless momentum-driven" (§4, Rules).
- Mobile menu (lines 159-187): `ease: 'easeInOut'` tween on a drawer-like reveal.
  §4 says anything the user interacts with (a dropdown is a drawer) should spring.
- Hamburger icon swap (Menu to X, line 147): no transition at all. Not itself
  wrong, but inconsistent with the icon-swap pattern used elsewhere (ThemeToggle).
- No `-webkit-tap-highlight-color` reset anywhere in the app: mobile Safari/Chrome
  flash a gray/blue highlight box on every tap target (§6, "fix tap highlight
  flashes").
- Tailwind's `hover:` utilities compile to plain `:hover`, so on touch devices a
  tapped link can stay visually "hovered" until the user taps elsewhere (§6,
  "hover states on touch devices must not stick"). This affects every `hover:` in
  the codebase, not just Navbar, but Navbar's link states are the most visible case.

## ScrollReveal / SectionHeader (`src/components/ScrollReveal.tsx`,
`src/components/SectionHeader.tsx`)

- `ScrollReveal` plays once on first view and isn't grabbed/dragged, so a tween is
  defensible, but it has no reduced-motion short-circuit (§14): a user with
  `prefers-reduced-motion: reduce` still gets a 32px slide on every section.
- `SectionHeader`/`WhySchool` h2 have no `font-optical-sizing: auto` (§15). Tracking
  is already size-appropriate (`tracking-tight`/`tracking-tighter` per component),
  so that part is already compliant; flagged here for completeness.

## Section reveals: About, Why Aerospace, Projects, Research, Links, CV, Contact,
Why [School]

- All route through `ScrollReveal`, so the one fix there (reduced motion) covers
  every section uniformly. No section has its own bespoke violation beyond that.
- `WhySchool` wrapper (`src/components/WhySchool.tsx` line 28): the whole-section
  mount/unmount uses `ease: 'easeInOut'` tween on `height`/`opacity`. A section
  appearing or disappearing because a school was picked is exactly the kind of
  "drawer" the spring rule targets.

## Project cards (`src/components/Projects.tsx`)

- Card hover lift (line 71): `{ type: 'spring', stiffness: 400, damping: 25 }`
  gives a damping ratio around 0.625, underdamped. Hovering a card is not
  momentum-driven, so this should be critically damped.
- Whole-card click target: correctly implemented (role="button", keyboard
  support), no violation.
- Confirmation modal buttons (lines 213, 219, 228): same `active:scale-95
  transition-all duration-150` CSS pattern as Hero. Needs `whileTap` spring.
- Modal enter/exit (`cardAnim`, lines 12-17): tween with a custom bezier, not a
  spring. Violates §4's blanket rule for modals/popups.
- Modal spatial consistency (§7): the modal always scales from the viewport
  center regardless of which card was clicked. Since each card is a distinct,
  visible trigger at a different screen position, the modal should open from (and
  close back to) that card's position, not a fixed center-screen origin.
- Backdrop (line 162): no "push the page back" depth cue, just a flat dim, no
  scale/blur on the content behind it (§12, "dim to focus... pushes it back
  slightly").

## Admissions-officer popup, school picker, theme transition, easter eggs
(`src/components/AdmissionsModal.tsx`, `PrincetonEasterEggs.tsx`,
`HarvardEasterEggs.tsx`, `BerkeleyEasterEggs.tsx`)

- `cardAnim` (lines 27-32): identical tween-not-spring issue as the project modal.
- Yes/No buttons (lines 164, 170), picker list buttons (line 217), Back button:
  CSS `active:scale` pattern, same fix as above.
- Reset pill (lines 243-263): translucent (`bg-white/90 backdrop-blur-sm`) with no
  reduced-transparency/contrast fallback.
- School theme switch: flipping `data-school` on `<html>` changes dozens of CSS
  custom properties that feed `background-color`/`border-color`/`color` all over
  the page. None of those properties have a `transition`, so the switch is an
  instant, full-page color snap: the exact "abrupt... jump" §14 and the craft
  checklist call out (this also covers the plain dark/light toggle, which is
  already partially eased on `body` via `transition-colors duration-300` but not
  on any descendant element, so most text/border colors still snap).
- Princeton/Harvard/Berkeley finale lines (`PrincetonCheerOverlay`,
  `HarvardRevealOverlay`, `BerkeleyOskiOverlay`): the last line animates with a
  scale-overshoot keyframe array (e.g. `scale: [1, 1.12, 1]`, `[1, 1.08, 1]`,
  `[1, 1.15, 1]`). These are triggered by a click or typed word, not a flick or
  drag. Per the Rules ("do not add bounce/overshoot to anything that was not
  momentum-driven") this should settle, not boing, even though it's a celebratory
  moment.
- Princeton/Harvard/Berkeley nav-underline sweep (`globals.css`, plain CSS
  `transition: width 0.2s ease` on `::after`): a hover micro-interaction, not a
  drag target. Low priority, left as CSS (documented, not fixed, see Pass 2 notes).

## Admin page (`src/app/admin/page.tsx`)

- Save status (lines 225-241, 485-499): plain conditional text, no transition at
  all on mount/unmount of the "Saved!" / "Error" / "Saving..." strings. Minor: a
  low-traffic internal tool, not part of the public-facing "feel," deprioritized.
- No `active:`/`whileTap` feedback issue here since the Save button already relies
  on native `<button disabled>` styling, which is acceptable for a utility form.

## Light/dark toggle (`src/components/ThemeToggle.tsx`)

- Icon swap (line 43): default Framer Motion tween easing (no explicit `ease`,
  defaults to `easeInOut`, which has an ease-in component on entry) on the
  sun/moon cross-fade. Press feedback (`whileTap={{ scale: 0.9 }}`, line 37) is
  already correct: Framer Motion's `whileTap` already fires on pointer-down, so
  no change needed there.
- The toggle itself causes the sitewide instant color-snap described above under
  AdmissionsModal.

## Why Aerospace gallery (`src/components/WhyAerospace.tsx`)

- Image hover scale (`group-hover:scale-105 transition-transform duration-500`,
  lines 29, 44, 63): plain CSS transition on a hover-only, non-draggable image,
  acceptable as-is. Springs are for things users touch/grab; a hover zoom is a
  simple, non-reversible-mid-gesture effect. No fix needed.

## "Viewing in [School] colours. Reset" pill (`AdmissionsModal.tsx`, lines 243-263)

- Covered above (reduced-transparency/contrast gap). Enter/exit uses a plain
  `y: -6 to 0` tween, which is fine (not a drag target, no bounce needed already).

## Global / cross-cutting

- No `prefers-reduced-motion` handling anywhere: not in `globals.css`, not via
  Framer Motion's `useReducedMotion`/`MotionConfig`. This is the single biggest
  gap. Every spring, every scroll reveal, every ambient loop plays at full
  amplitude regardless of OS setting.
- No `prefers-reduced-transparency` or `prefers-contrast` handling anywhere.
- No global `-webkit-tap-highlight-color` reset.
- Tailwind's `hover:` variant is not scoped to `@media (hover: hover)`, so every
  hover effect sitewide can stick on touch.
- `font-optical-sizing` is never set.
