<script lang="ts">
	let grown = $state(false);
	let scrollProgress = $state(0);

	$effect(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) {
			grown = true;
			return;
		}
		// Small delay so the "grow in" animation starts alongside the rest of Hero's
		// boot-complete fade-in, rather than firing before the page has settled.
		const timeoutId = setTimeout(() => (grown = true), 400);
		return () => clearTimeout(timeoutId);
	});

	$effect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		function onScroll() {
			scrollProgress = Math.min(window.scrollY / window.innerHeight, 1);
		}
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<!-- Purely decorative, larger-scale botanical illustration for the right side of Hero — grows
	 in via stroke-dashoffset once the page settles, and subtly rotates/drifts as the user
	 scrolls past Hero (a much smaller, secondary effect than the grow-in). -->
<div
	aria-hidden="true"
	class="hidden lg:block"
	style="transform: rotate({scrollProgress * 6}deg) translateY({scrollProgress * -16}px);"
>
	<svg
		width="160"
		height="420"
		viewBox="0 0 120 400"
		fill="none"
		class="hero-growth text-green {grown ? 'is-grown' : ''}"
	>
		<path
			d="M60 380 V60
				M60 340 C 35 340 25 315 20 290
				M60 340 C 85 340 95 315 100 290
				M60 280 C 38 280 30 258 26 238
				M60 280 C 82 280 90 258 94 238
				M60 220 C 40 220 33 200 30 184
				M60 220 C 80 220 87 200 90 184
				M60 160 C 42 160 36 144 34 130
				M60 160 C 78 160 84 144 86 130
				M60 100 C 45 100 41 88 39 78
				M60 100 C 75 100 79 88 81 78
				M60 60 C 54 60 52 54 52 50
				M60 60 C 66 60 68 54 68 50"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
		/>
	</svg>
</div>
