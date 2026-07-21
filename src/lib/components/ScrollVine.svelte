<script lang="ts">
	const SEGMENTS = 14;
	const SEG_HEIGHT = 80;
	const CENTER_X = 30;
	const WAVE = 14;
	const VIEW_HEIGHT = SEGMENTS * SEG_HEIGHT;

	function buildStem() {
		let d = `M ${CENTER_X} ${VIEW_HEIGHT}`;
		const leaves: { x: number; y: number; side: 1 | -1 }[] = [];

		for (let i = SEGMENTS; i >= 1; i--) {
			const yBottom = i * SEG_HEIGHT;
			const yTop = (i - 1) * SEG_HEIGHT;
			const side: 1 | -1 = i % 2 === 0 ? 1 : -1;
			const cy1 = yBottom - SEG_HEIGHT * 0.3;
			const cy2 = yBottom - SEG_HEIGHT * 0.7;
			d += ` C ${CENTER_X + side * WAVE} ${cy1} ${CENTER_X - side * WAVE} ${cy2} ${CENTER_X} ${yTop}`;
			leaves.push({ x: CENTER_X, y: yBottom - SEG_HEIGHT * 0.5, side });
		}

		return { d, leaves };
	}

	const { d: stemPath, leaves } = buildStem();

	let pathEl: SVGPathElement | undefined = $state();
	// Placeholder larger than any realistic path length — see HeroSection history: keeps the
	// stem fully hidden until the real length is measured, regardless of how far off this
	// guess is (exact match only matters once we start revealing it partially).
	let pathLength = $state(6000);
	let progress = $state(0);
	let reduced = $state(false);

	function leafGrowth(index: number) {
		const threshold = index / leaves.length;
		return Math.min(Math.max((progress - threshold) / (1 / leaves.length), 0), 1);
	}

	$effect(() => {
		if (pathEl) pathLength = pathEl.getTotalLength();
	});

	$effect(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) {
			progress = 1;
			return;
		}

		function onScroll() {
			const max = document.documentElement.scrollHeight - window.innerHeight;
			progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
		}
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	});

	const growth = $derived(Math.max(progress, reduced ? 1 : 0.02));
	const dashoffset = $derived(pathLength * (1 - growth));
</script>

<!-- Full-page scroll-progress indicator, styled as a growing vine instead of a plain bar — the
	 stem fills in from the bottom of the page to the top as the visitor scrolls through the
	 entire document, with leaves fading in evenly along the way. Fixed to the viewport so it
	 always spans the current window, independent of any single section's height.
	 pointer-events-none because it's a page-wide overlay and must never block clicks on
	 underlying content. -->
<div aria-hidden="true" class="pointer-events-none fixed inset-y-0 right-2 z-40 hidden xl:block">
	<svg
		width="40"
		height="100%"
		viewBox="0 0 60 {VIEW_HEIGHT}"
		preserveAspectRatio="none"
		fill="none"
	>
		<path
			bind:this={pathEl}
			d={stemPath}
			stroke="var(--color-green)"
			stroke-width="3"
			stroke-linecap="round"
			vector-effect="non-scaling-stroke"
			stroke-dasharray={pathLength}
			stroke-dashoffset={dashoffset}
			style="transition: {reduced ? 'none' : 'stroke-dashoffset 100ms linear'};"
		/>

		{#each leaves as leaf, i (leaf.x + '-' + leaf.y)}
			{@const g = leafGrowth(i)}
			<ellipse
				cx={leaf.x + leaf.side * 16}
				cy={leaf.y}
				rx="16"
				ry="7"
				fill="var(--color-green-bright)"
				style="opacity: {g}; transform-box: fill-box; transform-origin: center;
					transform: rotate({leaf.side === 1 ? -20 : 200}deg) scale({0.5 + g * 0.5});
					transition: {reduced ? 'none' : 'opacity 200ms linear, transform 200ms linear'};"
			/>
		{/each}
	</svg>
</div>
