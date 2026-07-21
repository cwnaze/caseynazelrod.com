<script lang="ts">
	const PETAL_ANGLES = [0, 60, 120, 180, 240, 300];
	const FLOWERS = [
		{ id: 'top', cx: 110, cy: 70, scale: 1 },
		{ id: 'left', cx: 55, cy: 150, scale: 0.62 },
		{ id: 'right', cx: 165, cy: 172, scale: 0.7 }
	];
</script>

<!-- Purely decorative, fully-drawn botanical illustration to the right of Hero's text — unlike
	 ScrollVine this one isn't scroll-tied (that's the page-wide scrollbar-vine's job now), it's
	 static apart from a slow, continuous idle sway (see .hero-bloom in layout.css). Each bloom
	 also has its own hover reaction (see .hero-flower) — scales up, spins, and swaps its petal
	 / center colors. Stems terminate exactly at each flower's center point so the join never
	 reads as a floating disconnected fragment. -->
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

		<ellipse
			cx="130"
			cy="300"
			rx="18"
			ry="7"
			fill="var(--color-green-bright)"
			transform="rotate(-20 130 300)"
		/>
		<ellipse
			cx="78"
			cy="205"
			rx="14"
			ry="6"
			fill="var(--color-green-bright)"
			transform="rotate(210 78 205)"
		/>
		<ellipse
			cx="145"
			cy="215"
			rx="14"
			ry="6"
			fill="var(--color-green-bright)"
			transform="rotate(-30 145 215)"
		/>

		{#each FLOWERS as flower (flower.id)}
			<g class="hero-flower">
				{#each PETAL_ANGLES as angle (angle)}
					<ellipse
						cx={flower.cx}
						cy={flower.cy - 26 * flower.scale}
						rx={14 * flower.scale}
						ry={26 * flower.scale}
						fill="var(--color-purple)"
						transform="rotate({angle} {flower.cx} {flower.cy})"
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
