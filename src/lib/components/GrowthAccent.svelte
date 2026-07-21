<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
</script>

<!-- Purely decorative botanical accent marking a section transition — a small line-drawn
	 sprout that "grows in" via the shared .reveal/.growth-accent CSS in layout.css. -->
<div aria-hidden="true" use:reveal class="my-8 flex justify-center text-green">
	<svg width="32" height="32" viewBox="0 0 32 32" fill="none" class="growth-accent">
		<path
			d="M16 30 V16 M16 16 C10 16 8 10 8 6 M16 16 C22 16 24 10 24 6"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
		/>
	</svg>
</div>
