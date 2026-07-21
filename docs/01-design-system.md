# 01 — Design System

## Purpose
Define the visual language ("terminal/CRT meets botanical") as concrete, implementable tokens: color, typography, spacing, borders/shadows, component states, and accessibility constraints — so every component pulls from the same source instead of inventing one-off styles.

## Requirements

### Functional
- FR-1: All colors are defined once as CSS custom properties on `:root` in a single tokens file, never hardcoded as hex in component styles.
- FR-2: A monospace font is used for accent text (nav labels, section labels, code-like details, badges); a separate readable sans or serif is used for body copy so long paragraphs (About Me) don't fatigue in monospace.
- FR-3: All interactive elements (links, buttons, cards) expose distinct hover, active, and focus-visible states using the palette below — never relying on color alone (see accessibility notes).
- FR-4: Borders are thin (1–2px), hard-edged (no border-radius, or a deliberately minimal 0–2px radius — see open question), and shadows are solid offset blocks with zero blur (`box-shadow: 4px 4px 0 var(--color)`), never `filter: blur()` or soft/glassmorphic shadows.
- FR-5: No gradients, no glow (`box-shadow` blur > 0, `filter: drop-shadow` with blur, or `text-shadow` glow), no translucent/backdrop-blur ("glassmorphism") surfaces anywhere in the design.

### Non-Functional
- NFR-1: All text/background color pairings used for body or label text must meet WCAG AA (4.5:1 normal text, 3:1 large text ≥ 18.66px bold / 24px regular).
- NFR-2: Tokens must support a single dark theme only (no light-mode toggle is in scope) but should be structured (named custom properties, not raw hex inline) so a future light theme is a token swap, not a rewrite.
- NFR-3: Focus states must be visible via keyboard (`:focus-visible`) with at least 3:1 contrast against the adjacent background, independent of hover styling.

## Styling Implementation: Tailwind
Owner has chosen Tailwind CSS over hand-rolled CSS custom properties. This project uses **Tailwind CSS v4** (`@tailwindcss/vite`), which is CSS-first — theme tokens are defined via an `@theme` block in the global stylesheet (`src/routes/layout.css`), not a `tailwind.config.ts` `theme.extend` object (that's the v3 pattern; confirmed not applicable once the actual scaffold was in place — see `agents/progress.txt`). Tailwind v4 automatically emits every `@theme` value as a real `:root, :host` CSS custom property in the compiled output, so no separate mirrored `:root` block is needed — JS/canvas consumers (scanline, glitch effects) read the same `var(--color-*)` names Tailwind utilities compile to.

```css
/* src/routes/layout.css (excerpt) */
@import 'tailwindcss';
@import '@fontsource-variable/jetbrains-mono';
@import '@fontsource-variable/inter';

@theme {
  --color-base: #111a10;
  --color-surface: #182415;
  --color-green: #5fa842;
  --color-green-bright: #84cc4f;
  --color-purple: #9b6dc4;
  --color-purple-deep: #6b4a8f;
  --color-text: #eaf0e4;
  --color-text-muted: #b9c2b3;

  --font-mono: 'JetBrains Mono Variable', 'IBM Plex Mono', ui-monospace, monospace;
  --font-sans: 'Inter Variable', 'Inter', ui-sans-serif, system-ui, sans-serif;
}
```

This generates utilities `bg-base`/`text-base`, `text-green`/`text-green-bright`, `text-purple`/`text-purple-deep`, `text-text`/`text-text-muted`, `bg-surface`, `font-mono`, `font-sans`, etc. Fonts are self-hosted via the `@fontsource-variable/jetbrains-mono` and `@fontsource-variable/inter` npm packages (variable-weight woff2, subset by `unicode-range`, `font-display: swap` built in) rather than hand-sourced font files.

**Corner radius:** no theme override needed — Tailwind ships no border-radius by default unless a `rounded-*` utility is explicitly applied, so "hard edges everywhere" is satisfied by simply never adding `rounded-*` classes, not by a config override.

## Contrast Audit (WCAG AA, computed against `--color-base` #111a10)
| Foreground | Ratio vs base | Normal text (4.5:1) | Large text/UI (3:1) |
|---|---|---|---|
| `--color-text` #eaf0e4 | 15.3:1 | ✅ Pass (AAA) | ✅ Pass |
| `--color-green-bright` #84cc4f | 9.1:1 | ✅ Pass (AAA) | ✅ Pass |
| `--color-green` #5fa842 | 6.1:1 | ✅ Pass (AA) | ✅ Pass |
| `--color-purple` #9b6dc4 | 4.56:1 | ⚠️ Pass, but barely (borderline — any small rendering variance can drop below 4.5) | ✅ Pass |
| `--color-purple-deep` #6b4a8f | 2.55:1 | ❌ **Fails** — do not use for body text or small labels on base | ❌ Fails even the 3:1 UI-component threshold |

**Flags:**
- `--color-purple` on base is AA-legal for body text but has almost no margin. Recommend reserving it for larger link text (≥16px) or pairing with an underline/weight change so legibility doesn't depend on the ratio alone.
- `--color-purple-deep` **must not** be used as text color on the base background — restrict it to borders, shadow color, and large decorative fills only. Use `--color-purple` (not `-deep`) wherever purple text/icons are needed on `--color-base`.
- Green-on-purple or purple-on-green combinations (e.g. green text on a purple-deep card surface) are not yet computed — flag as an open question below since card surface color isn't finalized.

## Typography
- **Accent/monospace font (resolved):** JetBrains Mono, self-hosted (variable weight, subset to Latin) — used for nav items, eyebrow/section labels, cert IDs, tool names, code snippets, and the terminal-effect hero copy.
- **Body font (resolved):** Inter — used for paragraph copy (About Me, project/experience descriptions). Chosen over a serif to keep the "terminal manual" feel functional/technical rather than literary.
- **Scale** (rem, base 16px):
  | Token | Size | Use |
  |---|---|---|
  | `--text-xs` | 0.75rem | badges, meta labels |
  | `--text-sm` | 0.875rem | nav items, captions |
  | `--text-base` | 1rem | body copy |
  | `--text-lg` | 1.25rem | subheadings, card titles |
  | `--text-xl` | 1.75rem | section headings |
  | `--text-2xl` | 2.5rem | hero name/title |
  | `--text-3xl` | 3.5rem | hero display (desktop only) |
- Line height: 1.5 for body, 1.2 for headings/mono accents.

## Spacing Scale
4px base unit, exposed as tokens: `--space-1: 4px` through `--space-12: 48px` in steps of 4 up to 24px, then 32/40/48/64/96 for section-level rhythm (`--space-section: 96px` desktop, `48px` mobile).

## Hard-Shadow / Border Treatment
- Border: `1px solid var(--color-border)` default on cards; `2px` on emphasized/hovered elements. **Resolved:** `border-radius: 0` everywhere, including buttons and inputs — fully square corners is part of the "not the generic AI look" mandate.
- Shadow: flat offset block, e.g. `box-shadow: 6px 6px 0 0 var(--color-shadow);` — no blur radius ever (3rd value in `box-shadow` shorthand must always be `0`).
- **Resolved:** on hover, cards/buttons translate (e.g. `transform: translate(-2px, -2px)`) while the shadow offset grows proportionally (the "lift" pattern) — confirmed as the desired hover physics, and extended per the Signature Interactions section below.

## Signature Interactions ("WOW" Direction)
Explicit design goal: a visitor's first reaction should be "wow," achieved through distinctive, on-theme motion — not generic AI-portfolio tropes (no neon glow, particle fields, gradient blobs, or glassmorphism). Concrete, implementable directions:

1. **CRT boot sequence on load** — Hero content is preceded by a brief (~600–900ms), skippable simulated terminal boot: 2–3 lines of monospace text typing in (e.g. `> initializing casey.dev...`, `> loading profile...`) before the real Hero content types/fades in. Must respect `prefers-reduced-motion` (skip straight to final state) and must not delay meaningful content beyond ~1s even in the animated case.
2. **Scanline overlay** — A very subtle, fixed-position CSS-only horizontal scanline texture (low-opacity repeating gradient, animated to drift slowly) over the whole page, reinforcing the CRT theme without competing with content contrast. Must stay decorative-only (`pointer-events: none`, `aria-hidden`) and be disabled under `prefers-reduced-motion`.
3. **Glitch-on-hover for headings** — Section headings/nav items briefly "glitch" (RGB channel split / character-jitter, ~150ms) on hover, using `--color-green-bright` / `--color-purple` channel offsets — a hard-edged, digital effect distinct from soft glow, reinforcing "terminal," not "AI."
4. **Growth-accent micro-animation** — A small recurring botanical motif (e.g. a single monospace/ASCII-style sprouting glyph, or an animated SVG line-drawing of a leaf/vine) accents section transitions, tying the "botanical" half of the theme into motion rather than only color.
5. **Card "lift" + shadow-grow on hover** — Per the resolved hard-shadow hover physics above, applied consistently to project cards, cert cards, and buttons — this is the site's baseline interaction language, with items 1–4 layered on top as the differentiators.

All of the above must degrade gracefully: under `prefers-reduced-motion: reduce`, boot sequence/scanline drift/glitch are disabled or replaced with instant/static equivalents, while the lift/shadow-grow hover reduces to a simple opacity or color change.

## Component States
| State | Treatment |
|---|---|
| Default | Border `--color-border`, shadow `--color-shadow` at rest offset (e.g. 4px/4px). |
| Hover | Text/icon shifts to `--color-green-bright` (or `--color-purple` → nothing further if already purple); shadow offset increases (e.g. 6px/6px) with matching translate, per above. |
| Active/pressed | Shadow offset collapses toward 0 (e.g. `translate(2px, 2px)` + `box-shadow: 2px 2px 0 0`), simulating a physical press. |
| Focus-visible | 2px outline in `--color-green-bright`, offset 2px from element edge, always visible regardless of mouse hover state — never `outline: none` without a replacement. |
| Disabled (if applicable) | Reduce opacity to ~50%, remove hover/active transforms, no shadow change. |

## Accessibility Notes
- Do not use `--color-purple-deep` for any text — see contrast audit above.
- Nav active-state indication must not rely on color alone (e.g. pair the active nav item's color change with an underline, bracket, or bullet marker) to satisfy WCAG 1.4.1 (Use of Color).
- Respect `prefers-reduced-motion`: hover/press transform + shadow animations should be disabled or reduced to opacity-only transitions when the user has reduced motion enabled.
- Verify actual rendered font: system monospace fallbacks can render thinner/lighter than the primary choice — spot check `--color-purple` at small sizes (nav, captions) once the real font is chosen, since contrast math above assumes solid fill, not thin strokes.

## Acceptance Criteria
- [ ] All colors used anywhere in the app resolve to one of the tokens defined above (no raw hex outside the tokens file).
- [ ] Automated contrast check (e.g. axe or Lighthouse) reports zero color-contrast violations on rendered pages.
- [ ] Every interactive element has a visibly distinct hover, active, and focus-visible state, verified by keyboard-only navigation.
- [ ] No `box-shadow`/`filter` in the codebase has a non-zero blur radius; no gradients or `backdrop-filter` are present.
- [ ] `prefers-reduced-motion: reduce` disables transform-based hover/press animation.

## Resolved Decisions
1. `--color-surface` = `#182415`; `--color-text-muted` = `#b9c2b3`.
2. Fonts: JetBrains Mono (self-hosted, monospace/accent) + Inter (body).
3. Corners: `border-radius: 0` everywhere, no exceptions.
4. Hover "lift" + growing shadow confirmed as baseline interaction, extended by the Signature Interactions above.
5. No new secondary/tertiary color added — the six-color palette stays as-is; status/warning states (e.g. "cert expiring soon" in `05-cybersecurity-section.md`) are expressed via `--color-purple`/`--color-green-bright` + iconography/text, not a new hue.

## Open Questions
1. `--color-purple` is legal AA (4.56:1) but with little margin — should it be restricted to ≥16px/bold text (nav, links, labels) and never used for small body-paragraph runs? (Recommend yes; flagging for explicit sign-off since it affects where copy can safely use the accent color.)
2. For the glitch-on-hover effect (Signature Interactions #3), is a subtle/tasteful implementation acceptable at v1, with intensity tuned during Phase 8 visual QA, or do you want to see/approve a prototype before it's applied broadly across headings and nav?

