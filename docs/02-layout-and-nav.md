# 02 — Layout & Navigation

## Purpose
Specify the page's overall structure, the sticky nav's behavior and active-section detection, responsive breakpoints, and scroll-triggered reveal interactions.

## Requirements

### Functional
- FR-1: The page renders four full sections in a fixed vertical order: `#hero`, `#about`, `#software`, `#cybersecurity`, each a direct child of the main scroll container with a stable `id` for anchor navigation.
- FR-2: A sticky nav bar is pinned to the top (or a sticky side rail on desktop — see open question) for the entire scroll duration after the hero, showing links to About, Software, Cybersecurity (Hero is "home," typically not a separate nav link, or represented by a logo/name — see open question).
- FR-3: The nav highlights exactly one "active" item at a time, corresponding to whichever section currently occupies the largest visible portion of the viewport, using `IntersectionObserver` (not scroll-position math).
- FR-4: Clicking a nav item smooth-scrolls to the corresponding section and updates the URL hash without a full navigation/reload (`history.pushState` or an anchor with `scroll-behavior: smooth`).
- FR-5: On mobile, the sticky nav collapses to either a condensed bar or a hamburger-triggered overlay — see open question for which pattern fits the terminal aesthetic best.
- FR-6: Sections reveal on scroll (fade/slide into place) the first time they enter the viewport, using `IntersectionObserver` with a one-time trigger (does not re-animate on scroll-back-up) — respecting `prefers-reduced-motion`.

### Non-Functional
- NFR-1: Active-section detection must not visibly lag or flicker between two sections when they're near-equally visible (define a stable threshold/rootMargin so transitions are decisive, not jittery).
- NFR-2: Nav and scroll-reveal logic must not cause layout shift — reveal animations use `opacity`/`transform` only, never properties that affect layout (`height`, `margin`).
- NFR-3: All logic implemented with Svelte 5 runes (`$state` for active section id, `$effect` to wire up the `IntersectionObserver` on mount and tear it down on destroy) — no legacy stores.

## Page Structure
```
+page.svelte
├── Nav.svelte          (sticky, fixed position, always mounted)
├── main
│   ├── HeroSection.svelte        id="hero"
│   ├── AboutSection.svelte       id="about"
│   ├── SoftwareSection.svelte    id="software"
│   └── CybersecuritySection.svelte id="cybersecurity"
└── Footer.svelte        (contact/links, per 00-overview open question on contact method)
```

## Sticky Nav Behavior
- Nav becomes visually "docked" (e.g. adds a border-bottom + background fill) once the user scrolls past the hero, versus a more transparent/overlaid treatment while still within the hero — **open question: confirm this two-state nav behavior is wanted, vs. a single consistent nav style throughout.**
- Nav shows the site owner's name/handle (monospace, e.g. `casey@nazelrod:~$`) as a home anchor, plus 3 links: About, Software, Cybersecurity.
- Active item styling: per `01-design-system.md`, pair a color change with a non-color indicator (e.g. a `[ ]` bracket wrapper or underline) to satisfy WCAG 1.4.1.

## IntersectionObserver Active-Section Logic
- One observer watches all four section elements.
- `threshold`: an array (e.g. `[0, 0.25, 0.5, 0.75, 1]`) or a single mid-value threshold (e.g. `0.4`) — **recommend** using `rootMargin: "-45% 0px -45% 0px"` with a single low threshold so a section is considered "active" once it crosses the vertical center of the viewport, which produces more decisive single-section activation than percentage-visible thresholds (avoids the "two sections both 50% visible" ambiguity).
- On each observer callback, if an entry `isIntersecting`, set `activeSection = entry.target.id` via `$state`; do not unset on `isIntersecting === false` (prevents flicker to "no active section" during fast scrolls between sections).
- Observer is created in an `$effect` in `Nav.svelte` (or a shared layout-level scope) on mount, and disconnected in the effect's cleanup function.

## Responsive Breakpoints
| Name | Range | Notes |
|---|---|---|
| `mobile` | < 640px | Single-column, nav collapses (see open question), hero stacks name/title/CTA vertically. |
| `tablet` | 640–1023px | Two-column where relevant (e.g. project cards grid at 2-up), nav stays horizontal top bar. |
| `desktop` | ≥ 1024px | Full multi-column grids (project cards 3-up, cert cards grid), nav horizontal top bar or side rail per open question. |

Breakpoints exposed as CSS custom media or plain `@media (min-width: ...)` queries matching the pixel values above — **open question: confirm exact breakpoint values match any existing design reference, or these defaults are fine.**

## Scroll-Reveal Interactions
- Each section's direct children that should reveal (headings, cards, images) get a `data-reveal` attribute; a shared `IntersectionObserver` (or per-element observers if simpler) adds a `.is-visible` class the first time the element crosses ~20% into the viewport.
- Animation: opacity 0→1 and a small upward translate (e.g. `translateY(12px)→0`) over ~400ms, staggered slightly for grids (e.g. 60ms per card index) — **open question: confirm stagger is wanted or if all elements in a section should reveal simultaneously.**
- Once revealed, an element does not hide again on scroll-up (one-shot reveal, observer unobserves the element after triggering).

## Acceptance Criteria
- [ ] Exactly one nav item is marked active at any scroll position, with no flicker between adjacent sections during continuous scroll.
- [ ] Clicking each nav link scrolls to the correct section and updates `location.hash` without a full page reload.
- [ ] Nav remains visible/usable at all three breakpoints; mobile pattern (collapsed bar vs. hamburger) is implemented per the resolved open question.
- [ ] Scroll-reveal animations run once per element and do not re-trigger on scroll-up.
- [ ] With `prefers-reduced-motion: reduce` set, scroll-reveal and nav-highlight transitions are instant (no animated transform/opacity transition).
- [ ] No layout shift (CLS) introduced by reveal animations, verified via Lighthouse or manual DevTools CLS check.

## Resolved Decisions
Owner deferred sections 5–17 (nav/layout/animation specifics) to designer judgment with the mandate "make it look unique, no AI-glow, make it stand out (WOW reaction), include cool animations." Resolved as follows:
1. **Nav placement:** top sticky bar, full-width, on both mobile and desktop (no side rail — simpler and keeps the terminal "header bar" read consistent across breakpoints).
2. **Hero as nav item:** the owner's handle/logo in the nav (e.g. `casey@nazelrod:~$`) acts as a "scroll to top" link; About/Software/Cybersecurity are the three explicit nav links.
3. **Two-state nav:** yes — transparent/borderless while within Hero, then gains its `--color-surface` background + bottom border once the user scrolls past Hero, reinforcing the "docked terminal window" feel called for by the WOW direction.
4. **Mobile nav:** hamburger-triggered overlay styled as a full-screen terminal panel (monospace menu list, scanline texture per `01-design-system.md`), not a condensed bar — a plain condensed bar would read too close to a generic mobile nav.
5. **Scroll-reveal stagger:** yes, grids (project cards, cert cards) stagger ~60ms per item; standalone elements (headings) reveal individually with no stagger needed.
6. **Breakpoints:** default values (640/1024px) confirmed, no change.
7. **Back-to-top:** yes — a small fixed-position control appears once the user scrolls past Hero (reuses the nav's logo/handle click behavior rather than introducing a second redundant control — see open question below).

## Open Questions
1. Is reusing the nav's clickable logo/handle as the only "back to top" affordance sufficient, or do you also want a separate floating back-to-top button (e.g. bottom-right corner) for users who've scrolled far and don't want to look back up at the nav?
