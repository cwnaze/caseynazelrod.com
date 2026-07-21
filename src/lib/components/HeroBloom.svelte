<script lang="ts">
	const PETAL_ANGLES = [0, 60, 120, 180, 240, 300];
	const GOLDEN_ANGLE = 137.508;
	const CANOPY_CENTER = { x: 162, y: 160 };
	const CANOPY_RADIUS = { x: 128, y: 78 };

	// Deterministic phyllotaxis (sunflower-seed) scatter — not Math.random(), which would
	// render different positions on the server vs. after hydration.
	function bulbPositions(count: number) {
		return Array.from({ length: count }, (_, i) => {
			const angleDeg = i * GOLDEN_ANGLE + 15;
			const angleRad = (angleDeg * Math.PI) / 180;
			const frac = Math.sqrt((i + 0.5) / count);
			return {
				id: `bulb${i}`,
				cx: Math.round(CANOPY_CENTER.x + Math.cos(angleRad) * frac * CANOPY_RADIUS.x),
				cy: Math.round(CANOPY_CENTER.y + Math.sin(angleRad) * frac * CANOPY_RADIUS.y),
				r: 14 + (i % 4) * 3
			};
		});
	}

	function blossomPositions(count: number) {
		return Array.from({ length: count }, (_, i) => {
			const angleDeg = i * GOLDEN_ANGLE + 40;
			const angleRad = (angleDeg * Math.PI) / 180;
			const frac = 0.3 + (i / count) * 0.55;
			return {
				id: `b${i}`,
				cx: Math.round(CANOPY_CENTER.x + Math.cos(angleRad) * frac * CANOPY_RADIUS.x),
				cy: Math.round(CANOPY_CENTER.y + Math.sin(angleRad) * frac * CANOPY_RADIUS.y),
				scale: 0.32 + (i % 3) * 0.05
			};
		});
	}

	const BULBS = bulbPositions(11);
	const BLOSSOMS = blossomPositions(6);

	// Canopy "body" — a spread of distinct, irregularly-placed lobes (not concentric circles
	// around one point) so the silhouette reads as a wide, lumpy canopy rather than one uniform
	// blob. Bulbs and blossoms render on top of this for texture and hover interactivity.
	const CANOPY_LOBES = [
		{ cx: 165, cy: 160, r: 65 },
		{ cx: 70, cy: 170, r: 40 },
		{ cx: 110, cy: 110, r: 46 },
		{ cx: 165, cy: 90, r: 44 },
		{ cx: 220, cy: 110, r: 46 },
		{ cx: 255, cy: 170, r: 40 },
		{ cx: 90, cy: 210, r: 38 },
		{ cx: 150, cy: 225, r: 42 },
		{ cx: 210, cy: 210, r: 38 }
	];
</script>

<!-- Purely decorative, fully-drawn tree to the right of Hero's text — unlike ScrollVine this
	 isn't scroll-tied (that's the page-wide scrollbar-vine's job now), it's static apart from a
	 slow, continuous idle sway (see .hero-bloom in layout.css). Hovering a green foliage bulb
	 rustles it (a scale wobble, since a plain rotation wouldn't read on a circle); hovering a
	 blossom rustles its petals — via .hero-bulb/.hero-petal keyframes in layout.css. Bulb/blossom
	 positions are a deterministic phyllotaxis scatter (see bulbPositions/blossomPositions above),
	 not random, so server and client render identically. -->
<div aria-hidden="true" class="hero-bloom hidden lg:block">
	<svg width="280" height="380" viewBox="0 0 340 460" fill="none">
		<path
			d="M140 430 C 138 390 142 350 142 320 C 143 290 146 260 150 225 L 174 225 C 178 260 181 290 182 320 C 182 350 186 390 184 430 Z"
			fill="var(--color-bark)"
		/>
		<path
			d="M154 415 C 152 385 156 355 154 325 C 153 300 155 270 158 235"
			stroke="var(--color-bark-bright)"
			stroke-width="2"
			stroke-linecap="round"
		/>
		<path
			d="M170 410 C 172 380 169 350 171 322 C 172 298 170 268 167 238"
			stroke="var(--color-bark-bright)"
			stroke-width="2"
			stroke-linecap="round"
		/>

		{#each CANOPY_LOBES as lobe (lobe.cx + '-' + lobe.cy)}
			<circle cx={lobe.cx} cy={lobe.cy} r={lobe.r} fill="var(--color-green)" />
		{/each}

		{#each BULBS as bulb (bulb.id)}
			<g class="hero-bulb">
				<circle cx={bulb.cx} cy={bulb.cy} r={bulb.r} fill="var(--color-green-bright)" />
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
