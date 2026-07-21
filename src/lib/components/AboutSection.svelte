<script lang="ts">
	import { about } from '$lib/data/about';
	import ExperienceList from '$lib/components/ExperienceList.svelte';
</script>

<section id="about" class="min-h-screen p-8 py-24">
	<h2 class="glitch-hover font-mono text-sm text-green-bright">$ whoami</h2>

	<div class="mt-8 grid grid-cols-1 gap-12 md:grid-cols-2">
		<div class="max-w-xl space-y-4 font-sans text-text">
			{#each about.narrative as paragraph, i (i)}
				<p>{paragraph}</p>
			{/each}

			<p class="font-mono text-sm text-green-bright">
				$ currently building: {about.currentlyBuilding}
			</p>
		</div>

		<div>
			<h3 class="mb-4 font-mono text-sm text-text-muted uppercase">Experience</h3>
			<ExperienceList items={about.experience} />
		</div>
	</div>
</section>
