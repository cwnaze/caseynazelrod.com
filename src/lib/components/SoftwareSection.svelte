<script lang="ts">
	import { projects } from '$lib/data/projects';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';

	let activeProjectSlug = $state<string | null>(null);
	let activeImageIndex = $state(0);
	let triggerElement = $state<HTMLElement | null>(null);

	const activeProject = $derived(projects.find((p) => p.slug === activeProjectSlug) ?? null);

	function openGallery(slug: string, trigger: HTMLElement) {
		activeProjectSlug = slug;
		activeImageIndex = 0;
		triggerElement = trigger;
	}

	function closeGallery() {
		activeProjectSlug = null;
	}
</script>

<section id="software" class="min-h-screen p-8 py-24">
	<h2 class="font-mono text-sm text-green-bright">$ ls ./projects</h2>

	<div class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
		{#each projects as project, i (project.slug)}
			<ProjectCard {project} priority={i === 0} onOpenGallery={openGallery} />
		{/each}
	</div>
</section>

{#if activeProject}
	<Lightbox
		images={activeProject.images}
		activeIndex={activeImageIndex}
		onClose={closeGallery}
		onNavigate={(i) => (activeImageIndex = i)}
		{triggerElement}
	/>
{/if}
