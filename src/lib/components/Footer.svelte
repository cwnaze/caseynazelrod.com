<script lang="ts">
	import { hero } from '$lib/data/hero';
	import ContactForm from '$lib/components/ContactForm.svelte';
	import GrowthAccent from '$lib/components/GrowthAccent.svelte';
	import { reveal } from '$lib/actions/reveal';
</script>

<GrowthAccent />

<footer class="border-t border-green p-8 py-16">
	<h2 use:reveal class="glitch-hover font-mono text-sm text-green-bright">$ contact --send</h2>

	<div class="mt-8">
		<ContactForm />
	</div>

	<div class="mt-12 flex flex-wrap gap-6 font-mono text-sm">
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
</footer>
