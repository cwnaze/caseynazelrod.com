<script lang="ts">
	const PETAL_ANGLES = [0, 60, 120, 180, 240, 300];
</script>

<!-- Purely decorative, fully-drawn botanical illustration to the right of Hero's text — unlike
	 ScrollVine this one isn't scroll-tied (that's the page-wide scrollbar-vine's job now), it's
	 static apart from a slow, continuous idle sway (see .hero-bloom in layout.css), like a plant
	 stirring in a light breeze. -->
<div aria-hidden="true" class="hero-bloom hidden lg:block">
	<svg width="200" height="400" viewBox="0 0 200 400" fill="none">
		<path
			d="M100 390 C 94 350 106 320 99 280 C 92 250 106 220 100 185"
			stroke="var(--color-green)"
			stroke-width="3"
			stroke-linecap="round"
		/>
		<ellipse
			cx="122"
			cy="315"
			rx="20"
			ry="8"
			fill="var(--color-green-bright)"
			transform="rotate(-25 122 315)"
		/>
		<ellipse
			cx="78"
			cy="245"
			rx="20"
			ry="8"
			fill="var(--color-green-bright)"
			transform="rotate(205 78 245)"
		/>

		{#each PETAL_ANGLES as angle (angle)}
			<ellipse
				cx="100"
				cy="46"
				rx="14"
				ry="26"
				fill="var(--color-purple)"
				transform="rotate({angle} 100 72)"
			/>
		{/each}
		<circle cx="100" cy="72" r="12" fill="var(--color-green-bright)" />
	</svg>
</div>
