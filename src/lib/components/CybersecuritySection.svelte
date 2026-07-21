<script lang="ts">
	import { certifications } from '$lib/data/certs';
	import CertCard from '$lib/components/CertCard.svelte';
</script>

<section id="cybersecurity" class="min-h-screen p-8 py-24">
	<h2 class="font-mono text-sm text-green-bright">$ cat ./certifications.log</h2>

	<div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
		{#each certifications as cert (cert.id)}
			<CertCard {cert} />
		{/each}
	</div>
</section>
