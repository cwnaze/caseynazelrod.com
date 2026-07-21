<script lang="ts">
	const PETAL_ANGLES = [0, 60, 120, 180, 240, 300];
	// Small purple blossom accents scattered through the canopy — same 6-petal shape as before,
	// just scaled down, so the tree isn't purely one color.
	const BLOSSOMS = [
		{ id: 'a', cx: 100, cy: 128, scale: 0.4 },
		{ id: 'b', cx: 152, cy: 172, scale: 0.35 }
	];
	// Each leaf's ellipse is drawn with its near edge exactly at (attachX, attachY) and its
	// rotation pivots around that same point (see transform-origin in the markup), so it always
	// reads as attached to the canopy rather than floating near it.
	const LEAVES = [
		{ id: 'l1', attachX: 65, attachY: 165, angle: -55 },
		{ id: 'l2', attachX: 58, attachY: 120, angle: 190 },
		{ id: 'l3', attachX: 85, attachY: 145, angle: -95 },
		{ id: 'l4', attachX: 75, attachY: 195, angle: 155 },
		{ id: 'l5', attachX: 92, attachY: 205, angle: -140 },
		{ id: 'l6', attachX: 120, attachY: 95, angle: -80 },
		{ id: 'l7', attachX: 120, attachY: 140, angle: 100 },
		{ id: 'l8', attachX: 105, attachY: 112, angle: -25 },
		{ id: 'l9', attachX: 135, attachY: 112, angle: 25 },
		{ id: 'l10', attachX: 118, attachY: 172, angle: -170 },
		{ id: 'l11', attachX: 140, attachY: 195, angle: 15 },
		{ id: 'l12', attachX: 172, attachY: 168, angle: -50 },
		{ id: 'l13', attachX: 178, attachY: 122, angle: 205 },
		{ id: 'l14', attachX: 160, attachY: 140, angle: 55 },
		{ id: 'l15', attachX: 150, attachY: 200, angle: -15 },
		{ id: 'l16', attachX: 183, attachY: 150, angle: 150 }
	];
</script>

<!-- Purely decorative, fully-drawn botanical illustration to the right of Hero's text — unlike
	 ScrollVine this one isn't scroll-tied (that's the page-wide scrollbar-vine's job now), it's
	 static apart from a slow, continuous idle sway (see .hero-bloom in layout.css). Hovering a
	 leaf rustles that leaf; hovering a blossom rustles its petals — both via the
	 .hero-leaf/.hero-petal keyframes in layout.css, not a rigid scale/spin of the whole shape. -->
<div aria-hidden="true" class="hero-bloom hidden lg:block">
	<svg width="240" height="420" viewBox="0 0 240 420" fill="none">
		<path
			d="M120 410 C 116 380 124 350 120 320 C 117 300 122 280 120 260 C 118 245 121 232 120 220"
			stroke="var(--color-green)"
			stroke-width="6"
			stroke-linecap="round"
		/>
		<path
			d="M120 220 C 100 205 75 195 65 165 C 58 145 62 130 58 120"
			stroke="var(--color-green)"
			stroke-width="3"
			stroke-linecap="round"
		/>
		<path
			d="M120 220 C 118 195 122 170 120 140 C 119 125 121 110 120 95"
			stroke="var(--color-green)"
			stroke-width="3"
			stroke-linecap="round"
		/>
		<path
			d="M120 220 C 140 205 162 195 172 168 C 178 148 174 132 178 122"
			stroke="var(--color-green)"
			stroke-width="3"
			stroke-linecap="round"
		/>

		{#each LEAVES as leaf (leaf.id)}
			<g class="hero-leaf">
				<ellipse
					cx={leaf.attachX + 15}
					cy={leaf.attachY}
					rx="15"
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
