<script lang="ts">
	import type { ExperienceEntry } from '$lib/data/about';
	import { formatMonthYear } from '$lib/utils/date';

	let { items }: { items: ExperienceEntry[] } = $props();

	// Most-recent-first, regardless of the order entries are authored in the data file —
	// a currently-ongoing entry (no endDate) has the latest possible "end", so treating a
	// missing endDate as always-latest (rather than comparing only startDate) keeps a
	// current role first even if a future entry is later backdated to start before it.
	const sortedItems = $derived(
		[...items].sort((a, b) => {
			const bEnd = b.endDate ?? '9999-99-99';
			const aEnd = a.endDate ?? '9999-99-99';
			return bEnd === aEnd ? b.startDate.localeCompare(a.startDate) : bEnd.localeCompare(aEnd);
		})
	);

	function formatRange(entry: ExperienceEntry) {
		const start = formatMonthYear(entry.startDate);
		const end = entry.endDate ? formatMonthYear(entry.endDate) : 'Present';
		return `${start} – ${end}`;
	}
</script>

<ol class="space-y-4 font-mono text-sm">
	{#each sortedItems as entry (entry.org + entry.startDate)}
		<li class="border-l-2 border-green pl-4">
			<p class="text-text">{entry.role} <span class="text-text-muted">@ {entry.org}</span></p>
			<p class="text-text-muted">{formatRange(entry)}</p>
		</li>
	{/each}
</ol>
