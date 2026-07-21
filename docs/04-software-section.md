# 04 — Software Development Section

## Purpose
Define the project card schema, the image gallery/lightbox behavior, and the TypeScript data model backing this section, so adding a project is purely a `data/projects.ts` edit.

## Requirements

### Functional
- FR-1: Section renders a responsive grid of project cards, one per entry in `data/projects.ts`, in the array's declared order (no independent sort logic unless a `featured`/`order` field is specified — see model below).
- FR-2: Each project card displays at minimum: title, short description, tech-stack tags, and a thumbnail image; optionally links out (live demo, GitHub repo) and/or opens a gallery.
- FR-3: Clicking a project's thumbnail (or a dedicated "view gallery" affordance) opens a lightbox showing that project's full image set, navigable (next/prev) without closing the lightbox.
- FR-4: Lightbox is keyboard-operable: `Escape` closes, `ArrowLeft`/`ArrowRight` navigate, focus is trapped within the lightbox while open and returned to the triggering element on close.
- FR-5: **Resolved:** every project card shows a **preview** (its thumbnail/gallery images, opened via the lightbox on click) distinct from a **live demo** — a separate, clearly-labeled "Live Demo" button/link that takes the visitor to the actual interactive product (external URL), per the owner's direction. The two affordances are not conflated: clicking the image previews screenshots in-place; clicking "Live Demo" navigates away to the real product. With only 2 launch projects (CivSail, Nexus), both are expected to have a real `links.demo` URL — the single-image lightbox edge case is deprioritized but the model still supports it gracefully (hide gallery affordance if `images.length <= 1`, still show "Live Demo" if `links.demo` is set).

### Non-Functional
- NFR-1: Images are lazy-loaded (`loading="lazy"`) except the first visible card's thumbnail, and served at a reasonable pre-optimized size (no full-resolution unoptimized screenshots). **Resolved:** no existing pipeline/CDN — build-time optimization via `@sveltejs/enhanced-img` is added to the build plan (Phase 6), generating responsive `srcset`/`sizes` and modern formats (AVIF/WebP with fallback) at build time with no external service dependency.
- NFR-2: Lightbox open/close does not shift background page layout (use a fixed-position overlay, and lock body scroll while open without causing a horizontal scrollbar jump — compensate for scrollbar width removal).
- NFR-3: Grid must reflow per the breakpoints defined in `02-layout-and-nav.md` (e.g. 1-up mobile, 2-up tablet, 3-up desktop).

## Projects Data Model
```ts
// src/lib/data/projects.ts

export interface ProjectImage {
  src: string;       // path under /static, e.g. "/images/projects/foo/1.png"
  alt: string;        // required, meaningful alt text — not "screenshot"
  caption?: string;   // optional caption shown in lightbox
}

export interface Project {
  slug: string;              // unique, url-safe id, e.g. "threat-dashboard"
  title: string;
  summary: string;           // short card-level description (1–2 sentences)
  description?: string;      // longer copy, optional — shown if a project detail expansion exists
  techStack: string[];       // e.g. ["SvelteKit", "TypeScript", "PostgreSQL"]
  images: ProjectImage[];    // first image is used as the card thumbnail
  links?: {
    demo?: string;
    repo?: string;
    writeup?: string;
  };
  year: number;               // resolved: required, shown on every card (e.g. 2025)
}
// Note: no `featured` tier — resolved as unnecessary at 2-project launch scale (CivSail, Nexus);
// both render equal-weight in one grid. Revisit only if the project count grows significantly.

export const projects: Project[] = [
  // entries here
];
```

## Component Spec

### `SoftwareSection.svelte`
- Props: none (imports `projects` from the data module directly, per the content-driven principle).
- State: `$state` for `activeProjectSlug: string | null` (or `activeImageIndex`) controlling which project's lightbox is open, if any.
- Renders: section heading, a grid of `ProjectCard` components (one per `projects` entry), and a single `Lightbox` component controlled by the active-project state (not one lightbox instance per card).

### `ProjectCard.svelte`
- Props: `project: Project`.
- State: none required (purely presentational; hover state handled via CSS, click handled by an event dispatched up to `SoftwareSection`).
- Renders: thumbnail (`project.images[0]`), title, summary, tech-stack tag list, optional demo/repo link icons.

### `Lightbox.svelte`
- Props: `images: ProjectImage[]`, `activeIndex: number`, `onClose: () => void`, `onNavigate: (index: number) => void`.
- State: none owned internally beyond transient UI state (e.g. whether a swipe/drag is in progress on mobile, if that's in scope — see open question); active index is controlled by the parent so `SoftwareSection` remains the single source of truth.
- Behavior: traps focus, listens for `Escape`/arrow keys while mounted, restores focus to the trigger element on close (track the trigger element via a bound reference passed in or stored before opening).

## Acceptance Criteria
- [ ] Adding a new project requires only a new entry in `projects.ts` (plus its image files) — no changes to any `.svelte` file.
- [ ] Project grid reflows correctly at all three breakpoints.
- [ ] Lightbox opens on thumbnail click, navigates via arrow keys and on-screen next/prev controls, and closes via `Escape`, a close button, and a backdrop click.
- [ ] Focus is trapped in the lightbox while open and restored to the triggering card on close.
- [ ] Background scroll is locked while the lightbox is open, without introducing horizontal layout shift.
- [ ] All images have non-empty, meaningful `alt` text sourced from the data model (not auto-generated filenames).
- [ ] Typecheck/lint passes.
- [ ] Verify in browser using dev-browser skill.

## Resolved Decisions
1. Preview (in-page gallery/lightbox) is distinct from Live Demo (external link to the real product) — both surfaced per card.
2. No `featured` tier — 2 launch projects render equal-weight.
3. `year` is required and shown on every card.
4. Touch/gesture support: swipe-to-navigate added to the lightbox on touch devices (in addition to on-screen buttons/keyboard) — low implementation cost, meaningfully improves the "impressive" feel on mobile, per the owner's "use your best judgment to make it look good and impressive" direction.
5. Image pipeline: `@sveltejs/enhanced-img` added to the build plan (Phase 6) for responsive, modern-format images at build time.
6. Launch scale confirmed: 2 projects (CivSail, Nexus) — no pagination/"show more" needed; both render in the grid at once.

## Open Questions
1. Should project cards expand inline (accordion) for the longer `description`, or is `description` only ever shown in the lightbox/detail view? With only 2 projects, is a richer per-project detail view (e.g. a short case-study block below the fold of the card) worth the extra build effort, or is card + gallery + demo link enough for v1?
2. Real content needed: final `summary`/`description` copy, tech stacks, and image assets for CivSail and Nexus, plus their actual `links.demo` / `links.repo` URLs.
