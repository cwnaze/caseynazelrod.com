<script lang="ts">
	import type { Project } from '$lib/data/projects';
	import { resolveImage } from '$lib/images';

	let {
		project,
		priority = false,
		onOpenGallery
	}: {
		project: Project;
		priority?: boolean;
		onOpenGallery?: (slug: string, trigger: HTMLElement) => void;
	} = $props();

	const thumbnail = $derived(project.images[0]);
	const hasGallery = $derived(project.images.length > 1);
</script>

<article
	class="border border-green bg-surface p-4 shadow-[4px_4px_0_0_var(--color-green)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--color-green-bright)] motion-reduce:transition-none motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0"
>
	{#if thumbnail}
		{#if hasGallery && onOpenGallery}
			<button
				type="button"
				aria-label="View {project.title} image gallery"
				class="mb-4 block w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright"
				onclick={(e) => onOpenGallery(project.slug, e.currentTarget)}
			>
				<enhanced:img
					src={resolveImage(thumbnail.src)}
					alt={thumbnail.alt}
					loading={priority ? 'eager' : 'lazy'}
					class="aspect-video w-full object-cover"
				/>
			</button>
		{:else}
			<enhanced:img
				src={resolveImage(thumbnail.src)}
				alt={thumbnail.alt}
				loading={priority ? 'eager' : 'lazy'}
				class="mb-4 aspect-video w-full object-cover"
			/>
		{/if}
	{/if}

	<div class="flex items-baseline justify-between gap-2">
		<h3 class="glitch-hover font-sans text-lg font-bold text-text">{project.title}</h3>
		<span class="font-mono text-sm text-text-muted">{project.year}</span>
	</div>

	<p class="mt-2 font-sans text-sm text-text-muted">{project.summary}</p>

	<ul class="mt-4 flex flex-wrap gap-2 font-mono text-xs">
		{#each project.techStack as tech (tech)}
			<li class="border border-purple-deep px-2 py-1 text-purple">{tech}</li>
		{/each}
	</ul>

	<div class="mt-4 flex items-center gap-4 font-mono text-sm">
		{#if project.links?.demo}
			<a
				href={project.links.demo}
				target="_blank"
				rel="noopener noreferrer"
				class="btn-shadow-hover border border-green-bright px-3 py-1 text-green-bright hover:bg-green-bright hover:text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright"
			>
				Live Demo
			</a>
		{/if}
		{#if project.links?.repo}
			<a
				href={project.links.repo}
				target="_blank"
				rel="noopener noreferrer"
				class="text-text underline-offset-4 hover:text-green-bright hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright"
			>
				Repo
			</a>
		{/if}
	</div>
</article>
