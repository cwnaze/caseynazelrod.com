<script lang="ts">
	const LEAVES: { x: number; y: number; side: 1 | -1; threshold: number }[] = [
		{ x: 115, y: 415, side: 1, threshold: 0.14 },
		{ x: 118, y: 330, side: -1, threshold: 0.26 },
		{ x: 120, y: 245, side: 1, threshold: 0.38 },
		{ x: 118, y: 165, side: -1, threshold: 0.5 },
		{ x: 120, y: 100, side: 1, threshold: 0.62 }
	];
	const BUDS: { x: number; y: number; threshold: number }[] = [
		{ x: 122, y: 45, threshold: 0.76 },
		{ x: 122, y: 12, threshold: 0.9 }
	];
	// Growth is scrubbed over a fixed pixel distance (not a fraction of viewport height) so the
	// whole illustration finishes growing within a small scroll delta, while it's still on
	// screen — Hero itself scrolls away in normal document flow, it isn't pinned/fixed.
	const SCROLL_RANGE_PX = 350;

	let pathEl: SVGPathElement | undefined = $state();
	// Placeholder larger than any realistic path length: keeps the stem fully hidden
	// (dashoffset === dasharray) until the real length is measured post-mount, regardless of
	// how far off this guess is — exact match only matters once we start revealing it partially.
	let pathLength = $state(2000);
	let scrollProgress = $state(0);
	let reduced = $state(false);

	function growthAt(threshold: number) {
		return Math.min(Math.max((scrollProgress - threshold) / 0.14, 0), 1);
	}

	$effect(() => {
		if (pathEl) pathLength = pathEl.getTotalLength();
	});

	$effect(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) {
			scrollProgress = 1;
			return;
		}

		function onScroll() {
			scrollProgress = Math.min(window.scrollY / SCROLL_RANGE_PX, 1);
		}
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	const stemGrowth = $derived(Math.max(scrollProgress, reduced ? 1 : 0.1));
	const stemDashoffset = $derived(pathLength * (1 - stemGrowth));
	const sway = $derived(reduced ? 0 : scrollProgress * 3);
	const drift = $derived(reduced ? 0 : scrollProgress * -10);
</script>

<!-- Purely decorative botanical illustration rooted at the bottom-right corner of Hero — a stem
	 that grows continuously upward as the visitor scrolls (dashoffset scrubbed directly from
	 scroll position over a short, fixed scroll distance so it finishes while still on screen),
	 with leaves and wildflower buds fading in along the way. Fully grown and static under
	 prefers-reduced-motion. -->
<div
	aria-hidden="true"
	class="absolute right-8 bottom-0 hidden lg:block xl:right-20"
	style="transform: rotate({sway}deg) translateY({drift}px);"
>
	<svg width="220" height="480" viewBox="0 0 240 520" fill="none">
		<path
			bind:this={pathEl}
			d="M120 500 L120 465 C 90 470 150 450 115 415 C 85 385 150 365 118 330 C 90 305 150 280 120 245 C 95 225 145 200 118 165 C 98 148 138 125 120 100 C 108 88 128 68 122 45 C 118 33 122 20 122 10"
			stroke="var(--color-green)"
			stroke-width="3"
			stroke-linecap="round"
			stroke-dasharray={pathLength}
			stroke-dashoffset={stemDashoffset}
			style="transition: {reduced ? 'none' : 'stroke-dashoffset 100ms linear'};"
		/>

		{#each LEAVES as leaf (leaf.x + '-' + leaf.y)}
			{@const g = growthAt(leaf.threshold)}
			<ellipse
				cx={leaf.x + leaf.side * 20}
				cy={leaf.y - 5}
				rx="22"
				ry="9"
				fill="var(--color-green-bright)"
				style="opacity: {g}; transform-box: fill-box; transform-origin: center;
					transform: rotate({leaf.side === 1 ? -25 : 205}deg) scale({0.5 + g * 0.5});
					transition: {reduced ? 'none' : 'opacity 200ms linear, transform 200ms linear'};"
			/>
		{/each}

		{#each BUDS as bud (bud.x + '-' + bud.y)}
			{@const g = growthAt(bud.threshold)}
			<g
				style="opacity: {g}; transform-box: fill-box; transform-origin: center; transform: scale({0.4 +
					g * 0.6});
					transition: {reduced ? 'none' : 'opacity 200ms linear, transform 200ms linear'};"
			>
				<circle cx={bud.x} cy={bud.y - 8} r="4" fill="var(--color-purple)" />
				<circle cx={bud.x} cy={bud.y + 8} r="4" fill="var(--color-purple)" />
				<circle cx={bud.x - 8} cy={bud.y} r="4" fill="var(--color-purple)" />
				<circle cx={bud.x + 8} cy={bud.y} r="4" fill="var(--color-purple)" />
				<circle cx={bud.x} cy={bud.y} r="5" fill="var(--color-green-bright)" />
			</g>
		{/each}
	</svg>
</div>
