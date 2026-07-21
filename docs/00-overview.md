# 00 — Overview

## Purpose
Define the goals, audience, tech stack, and high-level architecture for caseynazelrod.com, a single-page scroll portfolio positioning the owner as both a software developer and a cybersecurity practitioner.

## Goals
- Present a single, credible narrative that spans two disciplines (software dev + cybersecurity) without the page reading as two portfolios stapled together.
- Make it trivial to add a new project or certification later by editing a typed data array, never markup.
- Ship a fast, static, zero-backend site that can be redeployed from a `git push` with no server to maintain.
- Establish a distinct visual identity ("terminal/CRT meets botanical") that reads as deliberate and hand-built, not template-generated.

## Target Audience
- Hiring managers / technical recruiters scanning quickly for signal (skim in under 60 seconds).
- Engineering peers and security peers who will read project details and cert credentials closely.
- Conference/community contacts following a link from a bio or resume.

## Success Criteria
- Lighthouse Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95 on the deployed static build (mobile + desktop).
- Zero layout shift (CLS ~0) on initial load; hero renders above-the-fold with no flash of unstyled content.
- A new project or cert can be added by a single edit to `data/projects.ts` or `data/certs.ts` with no component changes required.
- Site is fully navigable via sticky nav + keyboard, with the active section correctly highlighted while scrolling.
- Builds and deploys via CI to GitHub Pages or Netlify with no manual steps beyond a push.

## Tech Stack & Rationale
| Choice | Rationale |
|---|---|
| Svelte 5 + SvelteKit | Runes (`$state`, `$effect`, `$derived`) give fine-grained reactivity with less boilerplate than stores; SvelteKit's file-based routing is overkill for one page but gives `adapter-static` for free plus a clean project scaffold. |
| `@sveltejs/adapter-static` | Site is fully static content (no user data, no auth, no server logic) — prerendering to static HTML/CSS/JS is the simplest, cheapest, most portable deploy target. |
| TypeScript | Content (`projects.ts`, `certs.ts`) is data-driven; typed interfaces catch malformed entries at build time instead of at runtime in the browser. |
| Tailwind CSS v4 | Chosen by owner over hand-rolled CSS. Palette/spacing/shadow tokens are centralized in a CSS `@theme` block (`src/routes/layout.css`) so the bespoke look stays consistent — Tailwind is used as a utility layer over custom tokens, not swapped for a generic component kit/UI library. |
| No backend / no CMS | Content changes are infrequent and made by the owner directly in code; a CMS adds operational surface area for no real benefit at this scale. |

## High-Level Architecture
- Single route (`/`, i.e. `src/routes/+page.svelte`) composed of section components rendered in scroll order: Hero → About → Software → Cybersecurity.
- A `Nav.svelte` component is fixed/sticky and reads scroll position via `IntersectionObserver` to highlight the active section; it does not own routing (no client-side route changes, just scroll + hash anchors).
- Content lives in `src/lib/data/projects.ts` and `src/lib/data/certs.ts`, imported directly by section components — no fetch, no API layer.
- Static assets (project screenshots, cert badges) live under `static/` and are referenced by path from the data files.
- Global design tokens (colors, typography) live in a single `@theme` block in `src/routes/layout.css`, imported once at the root layout, per `01-design-system.md`.

## Deploy Target
- Build output: fully static via `adapter-static` (`fallback` disabled — this is a single prerendered page, not an SPA needing a 404 fallback).
- **Resolved (superseding the earlier GitHub Pages plan):** owner is hosting on **Vercel** directly (via Vercel's own dashboard/Git integration), not GitHub Pages. No repo-side deploy workflow or `BASE_PATH`/subpath handling is needed — Vercel serves the project from the domain root (both its default `*.vercel.app` preview/production URL and the eventual custom domain), so none of the GitHub Pages project-subpath complications apply. `.github/workflows/ci.yml` (typecheck/lint/build gate on every PR) still applies regardless of hosting provider; there is no `.github/workflows/deploy.yml` — deployment is owned entirely by Vercel's own build pipeline, outside this repo's CI.
- **DNS:** owner will configure `caseynazelrod.com` DNS themselves once the project is complete — the build plan and CI setup should not block on this; deploy to Vercel's default subdomain first, custom domain wiring happens after.

## Contact / Form
- Contact is handled via a form (not `mailto:` only). For v1, the form submits to a placeholder backend (a stub API endpoint that logs/no-ops, or a static-friendly placeholder service) — the owner will wire it to Resend later. The form component and its submit handler should be built so swapping the backend endpoint/service is a config change, not a component rewrite.
- **Resolved (US-014):** `ContactForm.svelte` does a real client-side `fetch(contact.submitUrl, { mode: 'no-cors', ... })`, not a `console.log`-only stub or a SvelteKit server route (not possible under `adapter-static` anyway). `no-cors` mode resolves successfully (an opaque response) as long as the network layer can reach the host at all, even though `contact.submitUrl` isn't a real, CORS-aware backend yet — this is what lets the form show a genuine success state today with zero server. When a real Resend-backed endpoint exists, switch the fetch back to normal `cors` mode and check `response.ok` instead of assuming success on no-cors's opaque response.

## Experience (added — not in original section list)
The owner has two internships (Finback 670, InvitaHealth) to surface alongside the two software projects (CivSail, Nexus). Rather than add a fifth top-level scroll section, these are modeled as a compact **Experience** timeline/list nested within the **About Me** section (see `03-hero-about.md`), keeping the four-section scroll structure intact.

## Ralph / Autonomous Build
This project is driven by the Ralph autonomous loop (`agents/ralph.md` + `agents/prd.json` + `agents/progress.txt`, run via `.claude/workflows/ralph-loop.js`). `08-build-plan.md`'s phases are decomposed 1:1 into Ralph user stories sized for a single agent iteration each — see `agents/prd.json`.

## Non-Goals
- No blog, no CMS, no multi-page routing beyond the single scroll page.
- No contact form backend (use a `mailto:` link or third-party form service if a form is wanted at all — see open question).
- No analytics/tracking beyond an optional privacy-respecting, cookieless option (see open question).

## Resolved Decisions
1. DNS — owner configures after project completion; not a build blocker.
2. Styling — Tailwind CSS v4, tokens centralized in a CSS `@theme` block (not `tailwind.config.ts` — v4 is CSS-first).
3. Analytics — none for v1.
4. Contact — form UI with a placeholder/stub backend now, Resend integration later.
5. Repo — confirmed empty; build starts from scaffold (`08-build-plan.md` Phase 1).

## Open Questions
None outstanding — the contact-form placeholder-backend question is resolved above (US-014).
