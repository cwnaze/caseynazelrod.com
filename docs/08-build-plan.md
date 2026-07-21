# 08 — Build Plan

## Purpose
Sequence implementation into independently reviewable phases, from an empty repo (current state) to a deployed static site, so each phase can be a self-contained PR/review checkpoint. This plan is decomposed 1:1 into Ralph user stories in `agents/prd.json` — each phase below maps to one or more Ralph-sized stories (one story = one autonomous-agent iteration).

## Requirements
- FR-1: Each phase must be completable and independently verifiable (build passes, no broken intermediate state) before the next phase begins.
- FR-2: Phases are ordered so that later phases only ever depend on earlier ones, never the reverse.
- FR-3: Design tokens (01) and data models (04, 05) are established before the components that consume them, so components are written against a stable contract.
- FR-4: Every commit must pass typecheck, lint, and build — resolved per "Resolved Decisions" below (industry-standard CI gate, no exceptions).

## Phases

### Phase 1 — Scaffold
- Initialize SvelteKit project (`npx sv create`) with TypeScript, in this repo (currently empty aside from `.git`).
- Install and configure `@sveltejs/adapter-static`; confirm `svelte.config.js` sets `adapter: adapter-static` and the root `+layout.js`/`+page.js` sets `export const prerender = true`.
- Install and configure Tailwind CSS (`tailwindcss`, `@tailwindcss/vite` or the SvelteKit-recommended integration) alongside ESLint, Prettier (with `prettier-plugin-tailwindcss` for class sorting), and `svelte-check` for typecheck — standard, unopinionated defaults since this is a fresh repo.
- **Acceptance:** `npm run build` produces a static `build/` output with a placeholder page using at least one Tailwind utility class; `npm run check` (typecheck) and `npm run lint` pass.

### Phase 2 — Design Tokens & Global Styles
- Implement `tailwind.config.ts` theme extension (colors, fonts, `borderRadius: none`) per `01-design-system.md`; emit the mirrored `:root` CSS custom properties for JS/canvas consumers (scanline, glitch effects).
- Self-host and load JetBrains Mono + Inter with `font-display: swap`.
- **Acceptance:** A bare test page renders the base background, text color, and both font families correctly; contrast spot-checked against the audit table in `01-design-system.md`.

### Phase 3 — Data Models
- Create `src/lib/data/projects.ts`, `src/lib/data/certs.ts`, `src/lib/data/hero.ts`, `src/lib/data/about.ts`, and `src/lib/data/contact.ts` with the interfaces from `03-hero-about.md`, `04-software-section.md`, and `05-cybersecurity-section.md`, populated with placeholder/seed entries (real content follows in Phase 10).
- All schema fields resolved in the section PRDs (status, category, year, experience, etc.) are final at this point — this phase is the last point where the interfaces can change cheaply, before components are built against them.
- **Acceptance:** Typecheck passes on the data files in isolation; seed data renders correctly if temporarily dumped as JSON in a scratch page.

### Phase 4 — Page Shell & Nav
- Build `+page.svelte` composing four section placeholders (`#hero`, `#about`, `#software`, `#cybersecurity`) and `Nav.svelte` with the `IntersectionObserver` active-section logic, two-state (transparent-over-hero → docked) behavior, and mobile hamburger overlay from `02-layout-and-nav.md`.
- Implement smooth-scroll navigation, hash updates, and the back-to-top affordance (logo click).
- **Acceptance:** Scrolling through placeholder sections correctly highlights the matching nav item at all three breakpoints; keyboard nav (Tab + Enter) reaches and activates each nav link; mobile hamburger overlay opens/closes correctly.

### Phase 5 — Hero & About
- Build `HeroSection.svelte` (CRT boot-sequence + typed-text effect, placeholder resume/GitHub/LinkedIn links) and `AboutSection.svelte` + `ExperienceList.svelte` (currently-building line, Finback 670 / InvitaHealth experience entries) per `03-hero-about.md`, using placeholder copy clearly marked for later replacement.
- **Acceptance:** Both sections render correctly at all breakpoints; boot/typing effect respects `prefers-reduced-motion`; Lighthouse accessibility check passes on this page state.

### Phase 6 — Software Section
- Build `ProjectCard.svelte`, `Lightbox.svelte`, `SoftwareSection.svelte` per `04-software-section.md`, wired to seed `projects.ts` data (CivSail, Nexus placeholders), with the preview-lightbox vs. live-demo-link distinction, swipe navigation on touch, and `year` display.
- Add `@sveltejs/enhanced-img` for responsive, modern-format project images.
- Implement focus-trap and keyboard navigation for the lightbox.
- **Acceptance:** All acceptance criteria in `04-software-section.md` pass; adding a throwaway test project to `projects.ts` requires no component edits.

### Phase 7 — Cybersecurity Section
- Build `CertCard.svelte` (active/expiring-soon/in-progress states), `Accomplishments.svelte`, `ToolsList.svelte` (grouped by category), `CybersecuritySection.svelte` per `05-cybersecurity-section.md`.
- **Acceptance:** All acceptance criteria in `05-cybersecurity-section.md` pass; adding a throwaway test cert requires no component edits; the "expiring soon" badge renders correctly against a seed cert with a near-future `expiryDate`.

### Phase 8 — Contact Form & Footer
- Build `ContactForm.svelte` and `Footer.svelte` per `00-overview.md`'s contact resolution: form posts to a placeholder endpoint defined in `data/contact.ts` (a single config value), with idle/submitting/success/error states — swapping in the real Resend-backed endpoint later requires only editing that config, not the component.
- **Acceptance:** Submitting the form with the placeholder endpoint shows a success state in the UI without a runtime server (consistent with the static/`adapter-static` deploy target); form is keyboard-operable and its fields have associated labels.

### Phase 9 — Signature Interactions & Polish Pass
- Implement the Signature Interactions from `01-design-system.md`: scanline overlay, glitch-on-hover for headings/nav, growth-accent micro-animation, and the scroll-reveal action (`reveal.ts`) wired to headings/cards across all sections with the resolved stagger behavior.
- Full visual QA pass: verify no blur/gradient/glassmorphism has crept in, all hover/active/focus states are correct, `prefers-reduced-motion` disables/reduces every added animation.
- **Acceptance:** Manual pass through every interactive element in the app confirms design-system compliance; Lighthouse Accessibility/Best Practices ≥ 95; toggling `prefers-reduced-motion` in DevTools visibly disables boot/scanline/glitch/reveal animation.

### Phase 10 — Placeholder-Realistic Content
- Replace the minimal seed data in `projects.ts`, `certs.ts`, `hero.ts`, `about.ts` with fuller **placeholder-but-realistic** content using the owner's real project/cert/employer names (CivSail, Nexus, Finback 670, InvitaHealth, CPTS) and plausible dates/descriptions/tech stacks — clearly marked as placeholder (e.g. a `PLACEHOLDER_COPY` marker in comments) so it's easy to find and swap for the owner's real copy later, without blocking the build on that copy being ready now.
- **Acceptance:** Every section renders complete, plausible-looking content (no empty states, no Lorem ipsum) while every invented fact (dates, descriptions, placements) is traceable back to a `PLACEHOLDER_COPY` marker for later replacement.

### Phase 10.5 — Real Content (future, owner-driven)
- Once the owner supplies real copy/dates/assets (tracked as open questions in `03`–`05`), swap out the `PLACEHOLDER_COPY`-marked values file by file. Not part of the Ralph-automated build — a manual follow-up pass.
- **Acceptance:** No `PLACEHOLDER_COPY` markers remain anywhere in the deployed build.

### Phase 11 — Deploy
- Deploy to the platform's default subdomain first (GitHub Pages or Netlify — per `00-overview.md`, custom domain DNS is the owner's responsibility later).
- Set up CI (GitHub Actions) running typecheck, lint, and build as a required check on every PR, with a separate deploy step publishing `build/` on push to `main`.
- **Acceptance:** Production URL serves the site correctly over HTTPS; Lighthouse scores from `00-overview.md`'s success criteria are met on the live URL, not just locally; PRs are blocked from merging if typecheck/lint/build fail.

## Ralph Integration
- `agents/prd.json` decomposes Phases 1–11 into individually-sized user stories (see file for exact breakdown — several phases split into 2+ stories where a phase is too large for one agent iteration, e.g. Software section splits into card+data wiring, lightbox, and image-optimization stories).
- `agents/progress.txt` is seeded fresh (no unrelated prior-project history) and accumulates Ralph's per-story learnings as the build proceeds.
- `agents/ralph.md` (already present in this repo) is the generic driver; no project-specific changes needed there — it reads `prd.json`/`progress.txt` from its own directory.
- Run via `.claude/workflows/ralph-loop.js`, which spawns one fresh agent per story in priority order until all stories pass.

## Acceptance Criteria (plan-level)
- [ ] Each phase above has its own PR/commit boundary and passes its stated acceptance check before the next phase starts.
- [ ] No phase requires reopening an already-"done" earlier phase except to fix a genuine defect (schema changes are front-loaded to Phase 3, not discovered in Phase 6/7).
- [ ] Final Phase 11 acceptance criteria match the success criteria defined in `00-overview.md`.
- [ ] `agents/prd.json` stories map 1:1 (or finer-grained) to the phases above, in dependency order.

## Resolved Decisions
1. No existing lint/format conventions to match (fresh repo) — greenfield SvelteKit + ESLint + Prettier + `svelte-check` defaults, industry-standard.
2. Phase 3 does not block on open content questions (real dates, real copy, real project/cert details) — it ships with typed placeholder/seed data; only the *schema* (field names/types) must be final, per FR-3 above. Content is backfilled in Phase 10.
3. Real content (Phase 10) is batched at the end, after every section is structurally complete — avoids re-touching already-reviewed component code mid-build for a content change.
4. CI runs typecheck/lint/build as a required PR check (not just on deploy) — standard practice, prevents broken code from reaching `main`.

## Open Questions
None outstanding — all four prior open questions resolved above. Remaining unknowns are content-level (owner-supplied copy/dates/asset), tracked in each section PRD's own Open Questions, not build-sequencing questions.
