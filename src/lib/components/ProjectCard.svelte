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
	const canExpand = $derived(project.images.length > 0 && !!onOpenGallery);
</script>

<article
	class="border border-green bg-surface p-4 shadow-[4px_4px_0_0_var(--color-green)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--color-green-bright)] motion-reduce:transition-none motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0"
>
	{#if thumbnail}
		{#if canExpand}
			<button
				type="button"
				aria-label="View full-size image of {project.title}"
				class="group relative mb-4 block w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright"
				onclick={(e) => onOpenGallery?.(project.slug, e.currentTarget)}
			>
				<enhanced:img
					src={resolveImage(thumbnail.src)}
					alt={thumbnail.alt}
					loading={priority ? 'eager' : 'lazy'}
					class="aspect-video w-full object-cover"
				/>
				<span
					class="absolute inset-0 flex items-center justify-center bg-base/0 opacity-0 transition-all duration-150 group-hover:bg-base/50 group-hover:opacity-100 motion-reduce:transition-none"
				>
					<svg
						aria-hidden="true"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						class="h-8 w-8 text-green-bright"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 8.25v-3a1.5 1.5 0 0 1 1.5-1.5h3m10.5 0h3a1.5 1.5 0 0 1 1.5 1.5v3m0 7.5v3a1.5 1.5 0 0 1-1.5 1.5h-3m-10.5 0h-3a1.5 1.5 0 0 1-1.5-1.5v-3"
						/>
					</svg>
				</span>
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
		{#if project.links?.site}
			<a
				href={project.links.site}
				target="_blank"
				rel="noopener noreferrer"
				class="btn-shadow-hover border border-green-bright px-3 py-1 text-green-bright hover:bg-green-bright hover:text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright"
			>
				Visit Site
			</a>
		{/if}
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
