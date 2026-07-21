<script lang="ts">
	import { certifications, accomplishments, securityTools } from '$lib/data/certs';
	import CertCard from '$lib/components/CertCard.svelte';
	import Accomplishments from '$lib/components/Accomplishments.svelte';
	import ToolsList from '$lib/components/ToolsList.svelte';
	import GrowthAccent from '$lib/components/GrowthAccent.svelte';
	import { reveal } from '$lib/actions/reveal';

	const STAGGER_MS = 60;
</script>

<GrowthAccent />

<section id="cybersecurity" class="min-h-screen p-8 py-24">
	<h2 use:reveal class="glitch-hover font-mono text-sm text-green-bright">
		$ cat ./certifications.log
	</h2>

	<div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
		{#each certifications as cert, i (cert.id)}
			<div use:reveal={{ delayMs: i * STAGGER_MS }}>
				<CertCard {cert} />
			</div>
		{/each}
	</div>

	{#if accomplishments.length > 0}
		<h3 use:reveal class="glitch-hover mt-16 font-mono text-sm text-green-bright">
			$ cat ./accomplishments.log
		</h3>
		<div use:reveal class="mt-8">
			<Accomplishments items={accomplishments} />
		</div>
	{/if}

	{#if securityTools.length > 0}
		<h3 use:reveal class="glitch-hover mt-16 font-mono text-sm text-green-bright">
			$ cat ./tools.log
		</h3>
		<div use:reveal class="mt-8">
			<ToolsList tools={securityTools} />
		</div>
	{/if}
</section>
