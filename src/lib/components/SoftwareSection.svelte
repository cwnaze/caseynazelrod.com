<script lang="ts">
	import { projects } from '$lib/data/projects';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
</script>

<section id="software" class="min-h-screen p-8 py-24">
	<h2 class="font-mono text-sm text-green-bright">$ ls ./projects</h2>

	<div class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
		{#each projects as project, i (project.slug)}
			<ProjectCard {project} priority={i === 0} />
		{/each}
	</div>
</section>
