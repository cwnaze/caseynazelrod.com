<script lang="ts">
	const SEGMENTS = 14;
	const SEG_HEIGHT = 80;
	const CENTER_X = 30;
	const WAVE = 14;
	const VIEW_HEIGHT = SEGMENTS * SEG_HEIGHT;
	const VIEW_WIDTH = 60;
	// How close the pointer has to be (in the vine's own coordinate units) before a leaf's
	// rustle burst triggers. Tracked globally (see handlePointerMove) rather than via
	// pointermove/pointerleave on the SVG itself, since the vine is pointer-events-none — it
	// must never intercept clicks on the page content it overlays.
	const RUSTLE_RADIUS = 40;
	const RUSTLE_DURATION_MS = 1800;
	const SHAKE_DURATION_MS = 650;

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
	let svgEl: SVGSVGElement | undefined = $state();
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

	let wasFullyScrolled = false;
	let globalShakeStart: number | null = null;

	$effect(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) {
			progress = 1;
			return;
		}

		function onScroll() {
			const max = document.documentElement.scrollHeight - window.innerHeight;
			const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
			// A little celebratory shake across every leaf the moment the visitor reaches the
			// very bottom of the page — a rising edge, so it fires once per arrival rather than
			// continuously while sitting at the bottom.
			if (p >= 0.999 && !wasFullyScrolled) {
				globalShakeStart = performance.now();
			}
			wasFullyScrolled = p >= 0.999;
			progress = p;
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

	type LeafHandle = {
		node: SVGEllipseElement;
		x: number;
		y: number;
		side: 1 | -1;
		index: number;
		phase: number;
		wasNear: boolean;
		rustleStart: number | null;
	};
	let leafHandles: LeafHandle[] = [];

	// Svelte action: registers each leaf's DOM node so the rAF loop below can drive its
	// opacity/transform directly (needs to blend continuously with scroll-driven growth, the
	// idle wind, hover rustle, and the full-scroll shake all at once — not something separate
	// CSS animations layered on top of each other could do cleanly).
	function registerLeaf(
		node: SVGEllipseElement,
		leaf: { x: number; y: number; side: 1 | -1; index: number }
	) {
		const handle: LeafHandle = {
			node,
			...leaf,
			phase: (leaf.index / leaves.length) * Math.PI * 2 * 3,
			wasNear: false,
			rustleStart: null
		};
		leafHandles.push(handle);
		return {
			destroy() {
				leafHandles = leafHandles.filter((h) => h !== handle);
			}
		};
	}

	// Plain (non-reactive) — updated from a window-level pointermove listener, not Svelte
	// state. Tracked globally rather than via events on the SVG itself, since the vine stays
	// pointer-events-none throughout (it's a full-page overlay and must never block clicks).
	let mouseX = -9999;
	let mouseY = -9999;

	function handlePointerMove(e: PointerEvent) {
		if (!svgEl) return;
		const rect = svgEl.getBoundingClientRect();
		mouseX = ((e.clientX - rect.left) / rect.width) * VIEW_WIDTH;
		mouseY = ((e.clientY - rect.top) / rect.height) * VIEW_HEIGHT;
	}

	$effect(() => {
		if (reduced) return;
		window.addEventListener('pointermove', handlePointerMove, { passive: true });
		return () => window.removeEventListener('pointermove', handlePointerMove);
	});

	// Every leaf sways gently in a continuous, gusty idle wind (its own phase so leaves aren't
	// in lockstep, times a shared envelope combining two slow, unrelated-period sine waves —
	// the same model as the Hero tree). A leaf plays a single decaying rustle burst the moment
	// the pointer newly comes within RUSTLE_RADIUS of it, and can't be re-triggered until that
	// burst finishes. Separately, every leaf gets one small shared shake burst when the page
	// reaches full scroll.
	$effect(() => {
		if (reduced) return;

		let rafId: number;
		function frame(t: number) {
			const gust = Math.max(
				0.3,
				1 +
					0.5 * Math.sin((t / 5300) * Math.PI * 2) +
					0.25 * Math.sin((t / 2100) * Math.PI * 2 + 2.1)
			);

			let shakeAngle = 0;
			if (globalShakeStart !== null) {
				const elapsed = t - globalShakeStart;
				if (elapsed >= SHAKE_DURATION_MS) {
					globalShakeStart = null;
				} else {
					const progressFrac = elapsed / SHAKE_DURATION_MS;
					const decay = Math.exp(-progressFrac * 2.5);
					shakeAngle = 14 * decay * Math.sin((elapsed / 1000) * 9 * Math.PI * 2);
				}
			}

			for (const leaf of leafHandles) {
				const g = leafGrowth(leaf.index);
				const dx = leaf.x - mouseX;
				const dy = leaf.y - mouseY;
				const isNear = dx * dx + dy * dy < RUSTLE_RADIUS * RUSTLE_RADIUS;
				if (isNear && !leaf.wasNear && leaf.rustleStart === null) {
					leaf.rustleStart = t;
				}
				leaf.wasNear = isNear;

				let windAngle: number;
				if (leaf.rustleStart !== null) {
					const elapsed = t - leaf.rustleStart;
					if (elapsed >= RUSTLE_DURATION_MS) {
						leaf.rustleStart = null;
						windAngle = 5 * gust * Math.sin((t / 2200) * Math.PI * 2 + leaf.phase);
					} else {
						const progressFrac = elapsed / RUSTLE_DURATION_MS;
						const decay = Math.exp(-progressFrac * 2);
						windAngle = 18 * decay * Math.sin((elapsed / 1000) * 7 * Math.PI * 2);
					}
				} else {
					windAngle = 5 * gust * Math.sin((t / 2200) * Math.PI * 2 + leaf.phase);
				}

				const baseAngle = leaf.side === 1 ? -20 : 200;
				const scale = 0.5 + g * 0.5;
				leaf.node.style.opacity = g.toFixed(3);
				leaf.node.style.transform =
					`rotate(${(baseAngle + windAngle + shakeAngle).toFixed(2)}deg) ` +
					`scale(${scale.toFixed(3)})`;
			}
			rafId = requestAnimationFrame(frame);
		}
		rafId = requestAnimationFrame(frame);

		return () => cancelAnimationFrame(rafId);
	});
</script>

<!-- Full-page scroll-progress indicator, styled as a growing vine instead of a plain bar — the
	 stem fills in from the bottom of the page to the top as the visitor scrolls through the
	 entire document, with leaves fading in evenly along the way. Fixed to the viewport so it
	 always spans the current window, independent of any single section's height.
	 pointer-events-none because it's a page-wide overlay and must never block clicks on
	 underlying content — mouse tracking for the leaf rustle below is done via a window-level
	 listener instead of events on the SVG, specifically so this can stay pointer-events-none. -->
<div aria-hidden="true" class="pointer-events-none fixed inset-y-0 right-2 z-40 hidden xl:block">
	<svg
		bind:this={svgEl}
		width="40"
		height="100%"
		viewBox="0 0 {VIEW_WIDTH} {VIEW_HEIGHT}"
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
			<ellipse
				use:registerLeaf={{ x: leaf.x, y: leaf.y, side: leaf.side, index: i }}
				cx={leaf.x + leaf.side * 16}
				cy={leaf.y}
				rx="16"
				ry="7"
				fill="var(--color-green-bright)"
				style="transform-box: fill-box; transform-origin: center;"
			/>
		{/each}
	</svg>
</div>
