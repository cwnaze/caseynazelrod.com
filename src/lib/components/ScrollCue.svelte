<script lang="ts">
	function scrollToAbout() {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		document.getElementById('about')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
	}
</script>

<!-- Reuses the same sprout glyph as GrowthAccent, but here it's an interactive, continuously
	 bouncing "scroll down" affordance anchored to the bottom of the Hero section, rather than
	 a one-shot reveal-on-scroll accent between sections. -->
<button
	type="button"
	onclick={scrollToAbout}
	aria-label="Scroll to About section"
	class="scroll-cue absolute inset-x-0 bottom-8 mx-auto flex w-fit text-green transition-colors hover:text-green-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright"
>
	<svg width="28" height="36" viewBox="0 0 32 36" fill="none">
		<path
			d="M16 34 V16 M16 16 C10 16 8 10 8 6 M16 16 C22 16 24 10 24 6"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
		/>
	</svg>
</button>
