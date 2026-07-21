# 05 — Cybersecurity Section

## Purpose
Define the certification card schema, the accomplishments/tools display, and the TypeScript data model backing this section, mirroring the content-driven approach used for Software.

## Requirements

### Functional
- FR-1: Section renders certifications as a grid/list of cards sourced from `data/certs.ts`, each showing at minimum: certification name, issuing body, and issue (and/or expiry) date.
- FR-2: **Resolved:** certs have public verification links — each cert card displays a "Verify" link/affordance where `verifyUrl` is present.
- FR-3: **Resolved:** Accomplishments is a separate list from certs, surfacing the owner's CTF and competition placements (e.g. "1st Place, [Competition] 2025") as a distinct, notable-achievement block — not folded into the cert grid.
- FR-4: **Resolved:** Tools are grouped by category (e.g. Offensive, Defensive, Forensics/GRC — exact categories TBD per owner's actual tool list) rather than one flat tag list, since a grouped display reads as more deliberate/expert than an undifferentiated tag cloud.
- FR-5: **Resolved:** status tracking is needed. The owner currently has 2 active certs, both **expiring soon**, plus a 3rd certification (CPTS) currently **in-progress**. Cert cards must visually flag "expiring soon" (e.g. within a configurable threshold like 90 days of `expiryDate`) distinctly from a plain "active" cert, and distinctly from "in-progress" (no `expiryDate` yet, not yet earned).

### Non-Functional
- NFR-1: Cert issuer logos (if used) are optimized/lazy-loaded like project images; if no logos are available, cards render cleanly with text only (logo is optional, not required, in the data model).
- NFR-2: Section layout is visually distinct from the Software section (different card treatment or arrangement) so the two sections don't feel like a duplicate template, while still using the same design tokens.

## Certs Data Model
```ts
// src/lib/data/certs.ts

export type CertStatus = "active" | "expired" | "in-progress"; // resolved: needed

export interface Certification {
  id: string;                // unique slug, e.g. "sec-plus"
  name: string;               // e.g. "CompTIA Security+"
  issuer: string;             // e.g. "CompTIA"
  issueDate?: string;          // ISO date; omitted if status = "in-progress"
  expiryDate?: string;         // ISO date, omitted if non-expiring or in-progress
  status: CertStatus;
  credentialId?: string;
  verifyUrl?: string;          // resolved: certs have public verify links
  logo?: string;                // optional — no logo assets yet, cards render text-only for now
}
// "Expiring soon" is a derived display state, not a distinct CertStatus value:
// a cert with status "active" and expiryDate within EXPIRY_WARNING_DAYS (e.g. 90) renders
// a visually distinct "expiring soon" badge, computed at render time from expiryDate — not stored.

export interface Accomplishment {
  id: string;
  title: string;                // e.g. "1st Place, Regional CTF 2024"
  description?: string;
  date?: string;                 // ISO date
  link?: string;                 // e.g. writeup, article, or event page
}

export interface SecurityTool {
  name: string;                  // e.g. "Burp Suite"
  category: string;              // resolved: grouped display, e.g. "Offensive" | "Defensive" | "Forensics" | "GRC"
}

export const certifications: Certification[] = [
  // entries here
];

export const accomplishments: Accomplishment[] = [
  // entries here
];

export const securityTools: SecurityTool[] = [
  // entries here
];
```

## Component Spec

### `CybersecuritySection.svelte`
- Props: none (imports `certifications`, `accomplishments`, `securityTools` directly).
- State: none required unless certs also get a lightbox/detail-expansion interaction (not specified — see open question); if certs stay flat cards with no modal, this component is purely presentational composition.
- Renders: section heading, `CertCard` grid, an `Accomplishments` list/block, a `ToolsList` tag display.

### `CertCard.svelte`
- Props: `cert: Certification`.
- Renders: name, issuer, formatted date range, status indicator (if in scope), verify link (if present), optional logo.

### `Accomplishments.svelte`
- Props: `items: Accomplishment[]`.
- Renders: a list (not necessarily card-grid — could be a simpler timeline/list treatment to visually differentiate from cert cards) of accomplishment entries.

### `ToolsList.svelte`
- Props: `tools: SecurityTool[]`.
- Renders: tag/pill list, optionally grouped by `category` if that field is in scope.

## Acceptance Criteria
- [ ] Adding a new cert, accomplishment, or tool requires only a data-file edit, no component changes.
- [ ] Cert cards display correctly whether or not optional fields (`logo`, `verifyUrl`, `expiryDate`, `credentialId`) are present, with no broken layout for missing optional data.
- [ ] Verify links (where present) open in a new tab with `rel="noopener noreferrer"`.
- [ ] Section is visually distinguishable from the Software section while reusing the same design tokens (not an identical card template).
- [ ] Typecheck/lint passes.
- [ ] Verify in browser using dev-browser skill.

## Resolved Decisions
1. Certs have public verify URLs — link out where present.
2. Cert status tracking is needed (active/expired/in-progress + derived "expiring soon").
3. Accomplishments = CTF and competition placements (see open question 1 for exact entries).
4. Tools are grouped by category.
5. No logo/badge assets yet — cards render text-only for v1.
6. Launch scale: 2 certs (both expiring soon) + CPTS in-progress (3rd) — small enough for a simple grid, no filter/pagination needed.

## Open Questions
1. Exact list of CTF/competition placements to include as Accomplishments (name, placement, date, and optionally a writeup/link) — needed to populate `accomplishments` with real entries instead of placeholders.
2. Names of the 2 active certifications (and their real issue/expiry dates, issuer, and verify URLs) plus confirmation that CPTS is the correct name/issuer for the in-progress 3rd entry.
3. Real tool list with category assignments (e.g. which tools count as "Offensive" vs. "Defensive" vs. "Forensics"/"GRC") to populate `securityTools`.
4. Exact `EXPIRY_WARNING_DAYS` threshold for the "expiring soon" badge (default assumption: 90 days) — confirm or adjust.
