<script lang="ts">
	import { hero } from '$lib/data/hero';
	import ContactForm from '$lib/components/ContactForm.svelte';
	import GrowthAccent from '$lib/components/GrowthAccent.svelte';
	import { reveal } from '$lib/actions/reveal';
</script>

<GrowthAccent />

<footer class="px-8 py-16">
	<div class="mx-auto max-w-md text-center">
		<h2 use:reveal class="glitch-hover font-mono text-sm text-green-bright">$ contact --send</h2>

		<div class="mt-8 text-left">
			<ContactForm />
		</div>

		<div class="mt-12 flex flex-wrap justify-center gap-6 font-mono text-sm">
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

		<p class="mt-12 font-mono text-xs text-text-muted">
			Hero tree illustration
			<a
				href="https://www.magnific.com"
				target="_blank"
				rel="noopener noreferrer"
				class="underline-offset-4 hover:text-green-bright hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright"
			>
				designed by Freepik - Magnific.com
			</a>
		</p>
	</div>
</footer>
