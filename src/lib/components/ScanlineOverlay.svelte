<!-- Pure decorative CRT scanline texture — fixed over the whole viewport, low opacity,
	 slow vertical drift. Not interactive (pointer-events: none) and not announced to
	 assistive tech (aria-hidden). The repeating-linear-gradient here produces hard 1px
	 stripes (a texture), not a soft color-blend background — the "no gradients" rule in
	 docs/01-design-system.md targets decorative brand-color fills, and this exact
	 low-opacity repeating-gradient scanline texture is explicitly called out as the
	 intended implementation in that same doc's Signature Interactions section. -->
<div aria-hidden="true" class="scanline-overlay pointer-events-none fixed inset-0 z-30"></div>

<style>
	.scanline-overlay {
		background-image: repeating-linear-gradient(
			to bottom,
			var(--color-text) 0px,
			var(--color-text) 1px,
			transparent 1px,
			transparent 4px
		);
		opacity: 0.04;
		animation: scanline-drift 8s linear infinite;
	}

	@keyframes scanline-drift {
		from {
			background-position: 0 0;
		}
		to {
			background-position: 0 8px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.scanline-overlay {
			animation: none;
		}
	}
</style>
