# 07 — Component Inventory

## Purpose
Enumerate every Svelte component in the site, its props/state, and which data it consumes, as a single reference cross-cutting the per-section PRDs (03–05) and the layout/nav PRD (02).

## Requirements
- FR-1: This inventory must stay in sync with actual component files as the build proceeds — treat it as a checklist during `08-build-plan.md` execution, updating it if a component is split, merged, or renamed.
- FR-2: Every component listed here maps to exactly one `.svelte` file under `src/lib/components/` (or `src/routes/` for the page shell), with no undocumented components introduced without updating this file.

## Inventory

| Component | Path (proposed) | Props | State (`$state`) | Data consumed | Defined in |
|---|---|---|---|---|---|
| `+page.svelte` | `src/routes/+page.svelte` | — | — | none directly (composes sections) | 02 |
| `Nav.svelte` | `src/lib/components/Nav.svelte` | — | `activeSection: string` | none (reads DOM section ids) | 02 |
| `HeroSection.svelte` | `src/lib/components/HeroSection.svelte` | — | `displayedBootLines: string[]`, `bootComplete: boolean` | `data/hero.ts` | 03 |
| `AboutSection.svelte` | `src/lib/components/AboutSection.svelte` | — | none | `data/about.ts` | 03 |
| `ExperienceList.svelte` | `src/lib/components/ExperienceList.svelte` | `items: ExperienceEntry[]` | none | passed via prop (`about.ts` experience array) | 03 |
| `SoftwareSection.svelte` | `src/lib/components/SoftwareSection.svelte` | — | `activeProjectSlug: string \| null`, `activeImageIndex: number`, `triggerElement: HTMLElement \| null` | `data/projects.ts` | 04 |
| `ProjectCard.svelte` | `src/lib/components/ProjectCard.svelte` | `project: Project`, `priority?: boolean`, `onOpenGallery?: (slug, trigger) => void` | none | passed via prop | 04 |
| `Lightbox.svelte` | `src/lib/components/Lightbox.svelte` | `images: ProjectImage[]`, `activeIndex: number`, `onClose`, `onNavigate`, `triggerElement: HTMLElement \| null` | `dialogEl` (bound ref), `touchStartX: number \| null` | passed via prop | 04 |
| `CybersecuritySection.svelte` | `src/lib/components/CybersecuritySection.svelte` | — | none (unless certs get a detail modal — TBD) | `data/certs.ts` | 05 |
| `CertCard.svelte` | `src/lib/components/CertCard.svelte` | `cert: Certification` | none | passed via prop | 05 |
| `Accomplishments.svelte` | `src/lib/components/Accomplishments.svelte` | `items: Accomplishment[]` | none | passed via prop | 05 |
| `ToolsList.svelte` | `src/lib/components/ToolsList.svelte` | `tools: SecurityTool[]` | none | passed via prop | 05 |
| `ContactForm.svelte` | `src/lib/components/ContactForm.svelte` | — | `$state` for field values + submit status (idle/submitting/success/error) | posts to a configurable placeholder endpoint (`data/contact.ts` config: submit URL), swappable for Resend later | 00, 08 |
| `Footer.svelte` | `src/lib/components/Footer.svelte` | — | none | renders `ContactForm`, placeholder resume/GitHub/LinkedIn links from `data/hero.ts` | 02 |
| `ScanlineOverlay.svelte` | `src/lib/components/ScanlineOverlay.svelte` | — | none | none (pure decorative CSS, `aria-hidden`) | 01 |

## Shared/Utility Modules (non-component)
| Module | Path (proposed) | Purpose |
|---|---|---|
| `data/projects.ts` | `src/lib/data/projects.ts` | Project data model + entries (04) |
| `data/certs.ts` | `src/lib/data/certs.ts` | Cert/accomplishment/tool data model + entries (05) |
| `data/hero.ts` | `src/lib/data/hero.ts` | Hero copy + boot-lines + placeholder link config (03) |
| `data/about.ts` | `src/lib/data/about.ts` | About copy + Experience entries config (03) |
| `data/contact.ts` | `src/lib/data/contact.ts` | Contact form submit-endpoint config (placeholder now, Resend later) (00) |
| `routes/layout.css` | `src/routes/layout.css` | Tailwind v4 entry + `@theme` design tokens: color, typography (01) |
| `actions/reveal.ts` | `src/lib/actions/reveal.ts` | Svelte action wrapping the scroll-reveal `IntersectionObserver` (02) |
| `actions/portal.ts` | `src/lib/actions/portal.ts` | Moves a node to be a direct child of `document.body` on mount (used by `Lightbox.svelte` so it isn't nested inside page content, letting the rest of the page be marked `inert` while it's open) (04) |

## Acceptance Criteria
- [ ] Every component that exists in the codebase at the end of the build has a corresponding row in this table (or the table is updated in the same PR that adds/renames a component).
- [ ] No component holds `$state` that duplicates data already owned by a parent (state lives at the lowest common owner, passed down via props) — e.g. `SoftwareSection` owns lightbox state, not `ProjectCard` or `Lightbox` independently.
- [ ] All data-consuming components import directly from `src/lib/data/*`, with no prop-drilling of entire data arrays through more than one intermediate layer where direct import is simpler.

## Resolved Decisions
1. `data/hero.ts` and `data/about.ts` are confirmed and in the table above.
2. `Footer.svelte` is in scope for v1 and owns the contact form.
3. Styling is Tailwind (per `00-overview.md`/`01-design-system.md`), not hand-rolled CSS — this doesn't change the dependency-minimalism preference for behavioral utilities like `reveal.ts`/`trapFocus.ts`, which stay hand-rolled (small, project-specific, no need for an external a11y-utility dependency).

## Open Questions
1. None outstanding at this layer — this file should be kept in sync as components are added/renamed during the build (see FR-1 above).
