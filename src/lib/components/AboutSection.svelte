<script lang="ts">
	import { about } from '$lib/data/about';
	import ExperienceList from '$lib/components/ExperienceList.svelte';
	import { reveal } from '$lib/actions/reveal';
</script>

<section id="about" class="px-8 py-16">
	<div class="mx-auto max-w-6xl">
		<h2 use:reveal class="glitch-hover font-mono text-sm text-green-bright">$ whoami</h2>

		<div class="mt-8 grid grid-cols-1 gap-12 md:grid-cols-2">
			<div use:reveal class="max-w-xl space-y-4 font-sans text-text">
				{#each about.narrative as paragraph, i (i)}
					<p>{paragraph}</p>
				{/each}

				<p class="font-mono text-sm text-green-bright">
					$ currently building: {about.currentlyBuilding}
				</p>
			</div>

			<div use:reveal>
				<h3 class="glitch-hover mb-4 font-mono text-sm text-text-muted uppercase">Experience</h3>
				<ExperienceList items={about.experience} />
			</div>
		</div>
	</div>
</section>
