<script lang="ts">
	const PETAL_ANGLES = [0, 60, 120, 180, 240, 300];
	const FLOWERS = [
		{ id: 'top', cx: 110, cy: 70, scale: 1 },
		{ id: 'left', cx: 55, cy: 150, scale: 0.62 },
		{ id: 'right', cx: 165, cy: 172, scale: 0.7 }
	];
	// Each leaf's ellipse is drawn with its near edge exactly at (attachX, attachY) — a point
	// that sits directly on one of the stem/branch paths below — and its rotation pivots
	// around that same point (see transform-origin in the markup), so the base of the leaf
	// never drifts off the stem regardless of the angle.
	const LEAVES = [
		{ id: 'main', attachX: 108, attachY: 300, angle: -35 },
		{ id: 'branchA', attachX: 56, attachY: 195, angle: 195 },
		{ id: 'branchB', attachX: 162, attachY: 202, angle: -30 }
	];
</script>

<!-- Purely decorative, fully-drawn botanical illustration to the right of Hero's text — unlike
	 ScrollVine this one isn't scroll-tied (that's the page-wide scrollbar-vine's job now), it's
	 static apart from a slow, continuous idle sway (see .hero-bloom in layout.css). Hovering a
	 flower rustles its petals; hovering a leaf rustles that leaf — both via the
	 .hero-petal/.hero-leaf keyframes below, not a rigid scale/spin of the whole shape. -->
<div aria-hidden="true" class="hero-bloom hidden lg:block">
	<svg width="220" height="420" viewBox="0 0 220 420" fill="none">
		<path
			d="M110 410 C 106 370 114 340 108 300 C 104 280 112 265 110 250 C 104 220 116 190 108 150 C 102 120 116 95 110 70"
			stroke="var(--color-green)"
			stroke-width="3"
			stroke-linecap="round"
		/>
		<path
			d="M110 250 C 90 235 60 222 56 195 C 52 175 58 160 55 150"
			stroke="var(--color-green)"
			stroke-width="3"
			stroke-linecap="round"
		/>
		<path
			d="M110 250 C 130 240 156 226 162 202 C 167 182 163 180 165 172"
			stroke="var(--color-green)"
			stroke-width="3"
			stroke-linecap="round"
		/>

		{#each LEAVES as leaf (leaf.id)}
			<g class="hero-leaf">
				<ellipse
					cx={leaf.attachX + 18}
					cy={leaf.attachY}
					rx="18"
					ry="7"
					fill="var(--color-green-bright)"
					style="--base-angle: {leaf.angle}deg; transform-origin: {leaf.attachX}px {leaf.attachY}px;
						transform: rotate(var(--base-angle));"
				/>
			</g>
		{/each}

		{#each FLOWERS as flower (flower.id)}
			<g class="hero-flower">
				{#each PETAL_ANGLES as angle (angle)}
					<ellipse
						class="hero-petal"
						cx={flower.cx}
						cy={flower.cy - 26 * flower.scale}
						rx={14 * flower.scale}
						ry={26 * flower.scale}
						fill="var(--color-purple)"
						style="--base-angle: {angle}deg; transform-origin: {flower.cx}px {flower.cy}px;
							transform: rotate(var(--base-angle));"
					/>
				{/each}
				<circle
					cx={flower.cx}
					cy={flower.cy}
					r={12 * flower.scale}
					fill="var(--color-green-bright)"
				/>
			</g>
		{/each}
	</svg>
</div>
