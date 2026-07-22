<script lang="ts">
	import { hero } from '$lib/data/hero';
	import ScrollCue from '$lib/components/ScrollCue.svelte';
	import HeroBloom from '$lib/components/HeroBloom.svelte';

	const CHAR_DELAY_MS = 10;
	const LINE_PAUSE_MS = 100;
	const FINAL_PAUSE_MS = 150;

	let displayedBootLines = $state<string[]>([]);
	let bootComplete = $state(false);

	function prefersReducedMotion() {
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	function sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	function scrollToSoftware() {
		document
			.getElementById('software')
			?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
	}

	$effect(() => {
		if (prefersReducedMotion()) {
			bootComplete = true;
			return;
		}

		let cancelled = false;
		// Plain (non-reactive) accumulator — reading $state here instead would make this
		// effect depend on displayedBootLines, and writing to it would then re-trigger
		// the very effect that's writing it.
		const lines: string[] = [];

		async function typeLine(line: string) {
			for (let i = 1; i <= line.length; i++) {
				if (cancelled) return;
				lines[lines.length - 1] = line.slice(0, i);
				displayedBootLines = [...lines];
				await sleep(CHAR_DELAY_MS);
			}
		}

		async function run() {
			for (const line of hero.bootLines) {
				if (cancelled) return;
				lines.push('');
				await typeLine(line);
				await sleep(LINE_PAUSE_MS);
			}
			await sleep(FINAL_PAUSE_MS);
			if (!cancelled) bootComplete = true;
		}

		run();

		return () => {
			cancelled = true;
		};
	});
</script>

<section id="hero" class="relative flex min-h-screen flex-col justify-center p-8">
	<div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-12">
		<div class="min-w-0 flex-1">
			<div aria-hidden="true" class="mb-4 font-mono text-sm text-green-bright">
				{#each displayedBootLines as line, i (i)}
					<p class="glitch-hover">{line}</p>
				{/each}
			</div>

			<div
				inert={!bootComplete}
				class="transition-opacity duration-500 motion-reduce:transition-none {bootComplete
					? 'opacity-100'
					: 'opacity-0'}"
			>
				<h1 class="glitch-hover font-sans text-3xl font-bold sm:text-4xl">
					{hero.name}
				</h1>
				<p class="mt-2 font-mono text-lg text-green-bright">{hero.title}</p>
				<hr class="mt-4 w-32 border-t border-text-muted" />

				<div class="mt-8 flex flex-wrap items-center gap-4 font-mono text-sm">
					<button
						type="button"
						class="btn-shadow-hover border border-green px-4 py-2 text-green-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright"
						onclick={scrollToSoftware}
					>
						View Projects
					</button>
					<a
						href={hero.resumeUrl}
						class="text-text underline-offset-4 hover:text-green-bright hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright"
					>
						Resume
					</a>
					<a
						href={hero.githubUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="text-text underline-offset-4 hover:text-green-bright hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright"
					>
						GitHub
					</a>
					<a
						href={hero.linkedinUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="text-text underline-offset-4 hover:text-green-bright hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright"
					>
						LinkedIn
					</a>
				</div>
			</div>
		</div>

		<HeroBloom />
	</div>

	<ScrollCue />
</section>
