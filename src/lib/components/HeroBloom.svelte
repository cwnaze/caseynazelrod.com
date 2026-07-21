<script lang="ts">
	const PETAL_ANGLES = [0, 60, 120, 180, 240, 300];
	const VIEW_WIDTH = 340;
	const VIEW_HEIGHT = 460;
	const TRUNK_FORK = { x: 170, y: 285 };
	// How close the pointer has to be (in the SVG's own coordinate units) before a leaf/blossom
	// starts rustling.
	const RUSTLE_RADIUS = 40;

	// Every branch tip / bend that grows a cluster of leaves — matches the strokes drawn below,
	// so foliage always reads as attached to an actual branch rather than floating nearby.
	const CLUSTER_POINTS = [
		{ x: 95, y: 205, count: 11 },
		{ x: 55, y: 150, count: 13 },
		{ x: 112, y: 138, count: 12 },
		{ x: 175, y: 150, count: 10 },
		{ x: 150, y: 88, count: 13 },
		{ x: 208, y: 108, count: 12 },
		{ x: 250, y: 205, count: 11 },
		{ x: 292, y: 150, count: 13 },
		{ x: 236, y: 138, count: 12 }
	];
	// A couple of clusters also get a small purple blossom nested among their leaves.
	const BLOSSOM_CLUSTER_INDICES = [1, 4, 7];

	function angleFromTrunk(x: number, y: number) {
		return (Math.atan2(y - TRUNK_FORK.y, x - TRUNK_FORK.x) * 180) / Math.PI;
	}

	// Leaves fan out from the cluster's own point, within a small radius, at an angle centered
	// on "away from the trunk" — deterministic (index-based), not Math.random(), so server and
	// client render identically.
	function buildLeaves() {
		const leaves: { id: string; attachX: number; attachY: number; angle: number }[] = [];
		CLUSTER_POINTS.forEach((cluster, ci) => {
			const baseAngle = angleFromTrunk(cluster.x, cluster.y);
			for (let i = 0; i < cluster.count; i++) {
				const spreadFrac = cluster.count === 1 ? 0.5 : i / (cluster.count - 1);
				const leafAngle = baseAngle + (spreadFrac - 0.5) * 150;
				const radius = 6 + ((i * 5) % 16);
				const rad = (leafAngle * Math.PI) / 180;
				leaves.push({
					id: `c${ci}-l${i}`,
					attachX: Math.round(cluster.x + Math.cos(rad) * radius),
					attachY: Math.round(cluster.y + Math.sin(rad) * radius),
					angle: Math.round(leafAngle)
				});
			}
		});
		return leaves;
	}

	function buildBlossoms() {
		return BLOSSOM_CLUSTER_INDICES.map((ci, i) => {
			const cluster = CLUSTER_POINTS[ci];
			return { id: `blossom-${ci}`, cx: cluster.x, cy: cluster.y, scale: 0.34 + (i % 2) * 0.05 };
		});
	}

	const LEAVES = buildLeaves();
	const BLOSSOMS = buildBlossoms();

	let svgEl: SVGSVGElement | undefined = $state();
	let mouseX = $state(-9999);
	let mouseY = $state(-9999);
	let rafPending = false;

	// $derived (not $effect) so this is also safely computed during SSR — the typeof guard
	// keeps it false on the server, where window doesn't exist.
	const reduced = $derived(
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
	);

	function updateMouse(clientX: number, clientY: number) {
		if (!svgEl) return;
		const rect = svgEl.getBoundingClientRect();
		mouseX = ((clientX - rect.left) / rect.width) * VIEW_WIDTH;
		mouseY = ((clientY - rect.top) / rect.height) * VIEW_HEIGHT;
	}

	function handlePointerMove(e: PointerEvent) {
		if (rafPending) return;
		rafPending = true;
		const { clientX, clientY } = e;
		requestAnimationFrame(() => {
			rafPending = false;
			updateMouse(clientX, clientY);
		});
	}

	function handlePointerLeave() {
		mouseX = -9999;
		mouseY = -9999;
	}

	function isNear(x: number, y: number) {
		const dx = x - mouseX;
		const dy = y - mouseY;
		return dx * dx + dy * dy < RUSTLE_RADIUS * RUSTLE_RADIUS;
	}
</script>

<!-- Purely decorative tree to the right of Hero's text, styled after a flat-design tree
	 silhouette reference — one solid-color trunk/branch shape with wood-grain detail lines,
	 leaves clustered tightly at each branch tip/bend (never floating apart from the branch
	 structure), and a couple of purple blossoms nested among the leaves. It's static apart from
	 a slow idle sway (see .hero-bloom below) — but leaves/blossoms within RUSTLE_RADIUS of the
	 pointer rustle continuously as it moves nearby (see isNear/.is-near), not on a per-element
	 :hover. Disabled entirely under prefers-reduced-motion. -->
<div aria-hidden="true" class="hero-bloom hidden lg:block">
	<svg
		bind:this={svgEl}
		width="260"
		height="350"
		viewBox="0 0 {VIEW_WIDTH} {VIEW_HEIGHT}"
		fill="none"
		role="presentation"
		onpointermove={reduced ? undefined : handlePointerMove}
		onpointerleave={reduced ? undefined : handlePointerLeave}
	>
		<!-- Trunk, primary/secondary branches, and root flare — all the same solid bark color and
			 no outline, so overlapping strokes read as one continuous silhouette. -->
		<path d="M170 435 V 285" stroke="var(--color-bark)" stroke-width="30" stroke-linecap="round" />
		<path
			d="M170 430 L 122 440 M170 430 L 218 440"
			stroke="var(--color-bark)"
			stroke-width="14"
			stroke-linecap="round"
		/>
		<path
			d="M170 285 L 95 205 M170 285 L 175 150 M170 285 L 250 205"
			stroke="var(--color-bark)"
			stroke-width="18"
			stroke-linecap="round"
		/>
		<path
			d="M95 205 L 55 150 M95 205 L 112 138"
			stroke="var(--color-bark)"
			stroke-width="10"
			stroke-linecap="round"
		/>
		<path
			d="M175 150 L 150 88 M175 150 L 208 108"
			stroke="var(--color-bark)"
			stroke-width="9"
			stroke-linecap="round"
		/>
		<path
			d="M250 205 L 292 150 M250 205 L 236 138"
			stroke="var(--color-bark)"
			stroke-width="10"
			stroke-linecap="round"
		/>

		<!-- Wood-grain detail: thin lighter lines running with the trunk, plus a knot. -->
		<path
			d="M158 425 C 156 390 160 355 158 320 C 157 305 159 292 161 285"
			stroke="var(--color-bark-bright)"
			stroke-width="2"
			stroke-linecap="round"
		/>
		<path
			d="M182 420 C 184 385 180 350 182 318 C 183 302 181 292 179 285"
			stroke="var(--color-bark-bright)"
			stroke-width="2"
			stroke-linecap="round"
		/>
		<ellipse cx="168" cy="365" rx="6" ry="9" stroke="var(--color-bark-bright)" stroke-width="1.5" />

		{#each LEAVES as leaf (leaf.id)}
			<g class="hero-leaf {isNear(leaf.attachX, leaf.attachY) ? 'is-near' : ''}">
				<ellipse
					cx={leaf.attachX + 11}
					cy={leaf.attachY}
					rx="11"
					ry="4"
					fill="var(--color-green-bright)"
					style="--base-angle: {leaf.angle}deg; transform-origin: {leaf.attachX}px {leaf.attachY}px;
						transform: rotate(var(--base-angle));"
				/>
			</g>
		{/each}

		{#each BLOSSOMS as blossom (blossom.id)}
			<g class="hero-flower {isNear(blossom.cx, blossom.cy) ? 'is-near' : ''}">
				{#each PETAL_ANGLES as angle (angle)}
					<ellipse
						class="hero-petal"
						cx={blossom.cx}
						cy={blossom.cy - 26 * blossom.scale}
						rx={14 * blossom.scale}
						ry={26 * blossom.scale}
						fill="var(--color-purple)"
						style="--base-angle: {angle}deg; transform-origin: {blossom.cx}px {blossom.cy}px;
							transform: rotate(var(--base-angle));"
					/>
				{/each}
				<circle
					cx={blossom.cx}
					cy={blossom.cy}
					r={12 * blossom.scale}
					fill="var(--color-green-bright)"
				/>
			</g>
		{/each}
	</svg>
</div>
