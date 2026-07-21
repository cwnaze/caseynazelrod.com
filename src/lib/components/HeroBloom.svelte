<script lang="ts">
	const PETAL_ANGLES = [0, 60, 120, 180, 240, 300];
	const GOLDEN_ANGLE = 137.508;
	const CANOPY_CENTER = { x: 130, y: 155 };
	const CANOPY_RADIUS = { x: 95, y: 85 };

	// Deterministic phyllotaxis (sunflower-seed) scatter — not Math.random(), which would
	// render different leaf positions on the server vs. after hydration. Distributes leaves
	// evenly across the canopy ellipse and points each one outward from center.
	function leafPositions(count: number) {
		return Array.from({ length: count }, (_, i) => {
			const angleDeg = i * GOLDEN_ANGLE;
			const angleRad = (angleDeg * Math.PI) / 180;
			const frac = Math.sqrt((i + 0.5) / count);
			return {
				id: `l${i}`,
				attachX: Math.round(CANOPY_CENTER.x + Math.cos(angleRad) * frac * CANOPY_RADIUS.x),
				attachY: Math.round(CANOPY_CENTER.y + Math.sin(angleRad) * frac * CANOPY_RADIUS.y),
				angle: Math.round(angleDeg % 360)
			};
		});
	}

	function blossomPositions(count: number) {
		return Array.from({ length: count }, (_, i) => {
			const angleDeg = i * GOLDEN_ANGLE + 40;
			const angleRad = (angleDeg * Math.PI) / 180;
			const frac = 0.35 + (i / count) * 0.35;
			return {
				id: `b${i}`,
				cx: Math.round(CANOPY_CENTER.x + Math.cos(angleRad) * frac * CANOPY_RADIUS.x),
				cy: Math.round(CANOPY_CENTER.y + Math.sin(angleRad) * frac * CANOPY_RADIUS.y),
				scale: 0.32 + (i % 3) * 0.05
			};
		});
	}

	const LEAVES = leafPositions(30);
	const BLOSSOMS = blossomPositions(6);

	// Canopy "body" — overlapping filled circles in the base green, giving the foliage a solid
	// silhouette so gaps between individual leaves don't show bare background through it. Leaves
	// and blossoms render on top of this for texture and hover interactivity.
	const CANOPY_LOBES = [
		{ cx: 130, cy: 110, r: 58 },
		{ cx: 80, cy: 145, r: 50 },
		{ cx: 180, cy: 145, r: 50 },
		{ cx: 95, cy: 195, r: 44 },
		{ cx: 165, cy: 195, r: 44 },
		{ cx: 130, cy: 180, r: 52 }
	];
</script>

<!-- Purely decorative, fully-drawn tree to the right of Hero's text — unlike ScrollVine this
	 isn't scroll-tied (that's the page-wide scrollbar-vine's job now), it's static apart from a
	 slow, continuous idle sway (see .hero-bloom in layout.css). Hovering a leaf rustles that
	 leaf; hovering a blossom rustles its petals — both via the .hero-leaf/.hero-petal keyframes
	 in layout.css. Leaf/blossom positions are a deterministic phyllotaxis scatter (see
	 leafPositions/blossomPositions above), not random, so server and client render identically. -->
<div aria-hidden="true" class="hero-bloom hidden lg:block">
	<svg width="260" height="440" viewBox="0 0 260 440" fill="none">
		<path
			d="M108 430 C 106 390 110 350 110 320 C 111 290 114 260 118 225 L 142 225 C 146 260 149 290 150 320 C 150 350 154 390 152 430 Z"
			fill="var(--color-bark)"
		/>
		<path
			d="M122 415 C 120 385 124 355 122 325 C 121 300 123 270 126 235"
			stroke="var(--color-bark-bright)"
			stroke-width="2"
			stroke-linecap="round"
		/>
		<path
			d="M138 410 C 140 380 137 350 139 322 C 140 298 138 268 135 238"
			stroke="var(--color-bark-bright)"
			stroke-width="2"
			stroke-linecap="round"
		/>

		{#each CANOPY_LOBES as lobe (lobe.cx + '-' + lobe.cy)}
			<circle cx={lobe.cx} cy={lobe.cy} r={lobe.r} fill="var(--color-green)" />
		{/each}

		{#each LEAVES as leaf (leaf.id)}
			<g class="hero-leaf">
				<ellipse
					cx={leaf.attachX + 13}
					cy={leaf.attachY}
					rx="13"
					ry="6"
					fill="var(--color-green-bright)"
					style="--base-angle: {leaf.angle}deg; transform-origin: {leaf.attachX}px {leaf.attachY}px;
						transform: rotate(var(--base-angle));"
				/>
			</g>
		{/each}

		{#each BLOSSOMS as blossom (blossom.id)}
			<g class="hero-flower">
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
