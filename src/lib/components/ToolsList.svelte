<script lang="ts">
	import type { SecurityTool } from '$lib/data/certs';

	let { tools }: { tools: SecurityTool[] } = $props();

	// Grouped with a plain object (not Map) — this is a one-shot local computation inside
	// $derived.by, not persisted reactive state, so Svelte's SvelteMap isn't needed; a plain
	// Map would still trip the svelte/prefer-svelte-reactivity lint rule regardless.
	const grouped = $derived.by(() => {
		const byCategory: Record<string, SecurityTool[]> = {};
		const categoryOrder: string[] = [];
		for (const tool of tools) {
			if (!byCategory[tool.category]) {
				byCategory[tool.category] = [];
				categoryOrder.push(tool.category);
			}
			byCategory[tool.category].push(tool);
		}
		return categoryOrder.map((category) => [category, byCategory[category]] as const);
	});
</script>

<div class="space-y-4">
	{#each grouped as [category, categoryTools] (category)}
		<div>
			<h4 class="glitch-hover mb-2 font-mono text-xs text-text-muted uppercase">{category}</h4>
			<ul class="flex flex-wrap gap-2">
				{#each categoryTools as tool (tool.name)}
					<li class="border border-purple-deep px-2 py-1 font-mono text-xs text-purple">
						{tool.name}
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>
