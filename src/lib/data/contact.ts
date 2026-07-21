export interface ContactConfig {
	submitUrl: string; // placeholder endpoint for v1 — swap for the real Resend-backed endpoint later
}

// PLACEHOLDER_COPY: this is a stub endpoint (no real backend yet, per docs/00-overview.md's
// contact resolution). Swapping this one value is the only change needed to point the
// contact form at a real backend.
export const contact: ContactConfig = {
	submitUrl: 'https://example.com/api/placeholder-contact-endpoint'
};
