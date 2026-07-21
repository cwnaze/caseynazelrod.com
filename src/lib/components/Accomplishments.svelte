<script lang="ts">
	import type { Accomplishment } from '$lib/data/certs';
	import { formatMonthYear } from '$lib/utils/date';

	let { items }: { items: Accomplishment[] } = $props();
</script>

<ul class="space-y-3 font-mono text-sm">
	{#each items as item (item.id)}
		<li>
			<p class="text-text">
				<span aria-hidden="true" class="text-green-bright">&gt;</span>
				{item.title}
				{#if item.date}
					<span class="text-text-muted">({formatMonthYear(item.date)})</span>
				{/if}
			</p>
			{#if item.description}
				<p class="mt-1 pl-4 text-text-muted">{item.description}</p>
			{/if}
			{#if item.link}
				<a
					href={item.link}
					target="_blank"
					rel="noopener noreferrer"
					class="mt-1 inline-block pl-4 text-purple underline-offset-4 hover:text-green-bright hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright"
				>
					Details
				</a>
			{/if}
		</li>
	{/each}
</ul>
