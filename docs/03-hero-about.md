# 03 — Hero & About Sections

## Purpose
Define content requirements and component specs for the first two sections a visitor sees: the Hero (immediate identity/positioning) and About Me (narrative depth on the dual dev/security background).

## Hero Section

### Purpose
Communicate, within one viewport and under 3 seconds of attention, who the site owner is and the two disciplines they work across.

### Functional Requirements
- FR-1: Displays name, a role/title line (e.g. "Software Developer & Cybersecurity Practitioner"), and a short one-line positioning statement.
- FR-2: **Resolved:** uses the CRT boot-sequence + typed-text effect defined in `01-design-system.md`'s Signature Interactions — 2–3 simulated terminal lines type in before the final name/title/subtitle resolves. Final text exists in the DOM immediately (not solely revealed by animation timing) so it's accessible and indexable regardless of animation state.
- FR-3: **Resolved — placeholder values for v1:** CTA/link row includes a resume link (`/resume.pdf`, placeholder file until a real resume is supplied), a GitHub link (placeholder URL `https://github.com/placeholder`), a LinkedIn link (placeholder URL `https://linkedin.com/in/placeholder`), and a "View Projects" CTA that scrolls to Software. All placeholder URLs must be trivially swappable from one place (see content-source decision below) — not hardcoded per-usage.
- FR-4: Renders fully above-the-fold on both mobile and desktop with no layout shift once fonts load (use `font-display: swap` plus a matched fallback stack, or preload the primary font).

### Non-Functional
- NFR-1: No blocking animation delays perceived content — if a typed-text effect is used, the final text must also exist in the DOM immediately (e.g. via `aria-live` or a no-JS fallback) so it's readable/indexable without waiting for the animation and accessible to screen readers.
- NFR-2: Hero must remain legible against the base background at all breakpoints (reuses design-system tokens, no new colors).

### Component Spec: `HeroSection.svelte`
- Props: none. **Resolved:** copy and links live in `src/lib/data/hero.ts` (a typed config, not a repeating array) — consistent with the content-driven principle and making the placeholder resume/GitHub/LinkedIn URLs a single edit point.
  ```ts
  // src/lib/data/hero.ts
  export interface HeroContent {
    bootLines: string[];        // terminal boot lines typed before the final content
    name: string;
    title: string;
    tagline: string;
    resumeUrl: string;          // placeholder for v1
    githubUrl: string;          // placeholder for v1
    linkedinUrl: string;        // placeholder for v1
  }
  export const hero: HeroContent = { /* ... */ };
  ```
- State: `$state` for typed-text/boot-sequence progress (current line index, current character index), driven by an `$effect` timer on mount; respects `prefers-reduced-motion` by skipping straight to the fully-typed state.
- Structure: boot-line region (transient), name/title (h1), subtitle/positioning line (p), CTA button row, social icon row.

### Acceptance Criteria
- [ ] Hero content is fully visible without scrolling on a 375×667 mobile viewport and a 1440×900 desktop viewport.
- [ ] If a typed-text animation is used, full text is present in the DOM and accessible to screen readers immediately (not solely revealed via animation timing).
- [ ] All CTA/social links are keyboard-focusable with visible focus states per `01-design-system.md`.
- [ ] Typecheck/lint passes.
- [ ] Verify in browser using dev-browser skill.

## About Me Section

### Purpose
Give a fuller narrative: background, what drives the dual dev/security focus, and enough personality to differentiate from a generic resume page.

### Functional Requirements
- FR-1: Displays a short biographical narrative (2–4 paragraphs or an equivalent structured format) covering background and current focus.
- FR-2: **Resolved:** no portrait/avatar image for v1 — no photo asset exists yet. Layout must not assume/reserve dead space for one; can be added later without a structural rework.
- FR-3: **Resolved — include:** a "currently focused on" line/block, monospace-styled, e.g. `$ currently building: a full agentic development suite (Hermes agent)`. Content lives alongside the rest of About's copy (see content-source decision below).
- FR-4: **Resolved — include, as a distinct Experience subsection, not a skills-tag snapshot:** rather than a redundant tech-tag list (Software/Cybersecurity already cover tools/tech in depth), About surfaces a compact **Experience** timeline of the owner's two internships (Finback 670, InvitaHealth) — role, org, and dates, no lengthy prose per entry (that level of detail belongs in Software/resume, not here).

### Non-Functional
- NFR-1: Body copy uses the body/sans (or serif) font per design system, not the monospace accent font, for readability over paragraph length.
- NFR-2: Section respects the responsive column behavior (single column mobile; optional two-column text+image split on desktop).

### Component Spec: `AboutSection.svelte`
- Props: none. **Resolved:** narrative, "currently" line, and experience entries live in `src/lib/data/about.ts`:
  ```ts
  // src/lib/data/about.ts
  export interface ExperienceEntry {
    role: string;
    org: string;              // e.g. "InvitaHealth"
    startDate: string;         // ISO date
    endDate?: string;          // omitted if current
  }
  export interface AboutContent {
    narrative: string[];        // one string per paragraph
    currentlyBuilding: string;   // e.g. "a full agentic development suite (Hermes agent)"
    experience: ExperienceEntry[];
  }
  export const about: AboutContent = { /* ... */ };
  ```
- Structure: section heading (`$ whoami`-style terminal label), narrative block, "currently building" line, `Experience` sub-list (renders `about.experience`).
- **Ordering (found during US-008 self-review):** `about.experience` is not required to be pre-sorted in the data file — `ExperienceList.svelte` sorts a copy most-recent-first at render time (ongoing/no-`endDate` entries always rank above any entry with an `endDate`, then by `endDate` descending, then `startDate` descending), matching standard resume convention. Don't rely on array order when adding a new entry to `about.ts`.

### Acceptance Criteria
- [ ] Narrative text meets body-copy contrast requirements from `01-design-system.md`.
- [ ] If an image is included, it has meaningful `alt` text (not "profile photo").
- [ ] Layout reflows correctly from single-column (mobile) to any two-column variant (desktop) with no overlap or overflow.
- [ ] Typecheck/lint passes.
- [ ] Verify in browser using dev-browser skill.

## Open Questions
1. Real narrative copy for About (background story, dev+security framing) is still needed — placeholder prose will be used in the build until supplied. Should placeholder copy be clearly marked (e.g. an HTML comment or a `TODO_REAL_COPY` sentinel string) so it's easy to grep for before launch?
2. Real dates for the two internships (Finback 670, InvitaHealth start/end dates) needed for `about.ts`'s `experience` array.
3. Confirm placeholder resume/GitHub/LinkedIn URLs are fine to ship to a preview/staging deploy, or should they be visually marked as placeholders (e.g. a small "coming soon" badge) so a preview link doesn't look broken to an early viewer.
