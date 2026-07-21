<script lang="ts">
	import type { ExperienceEntry } from '$lib/data/about';

	let { items }: { items: ExperienceEntry[] } = $props();

	function formatDate(isoDate: string) {
		const [year, month] = isoDate.split('-').map(Number);
		return new Date(Date.UTC(year, month - 1)).toLocaleDateString('en-US', {
			month: 'short',
			year: 'numeric',
			timeZone: 'UTC'
		});
	}

	function formatRange(entry: ExperienceEntry) {
		const start = formatDate(entry.startDate);
		const end = entry.endDate ? formatDate(entry.endDate) : 'Present';
		return `${start} – ${end}`;
	}
</script>

<ol class="space-y-4 font-mono text-sm">
	{#each items as entry (entry.org)}
		<li class="border-l-2 border-green pl-4">
			<p class="text-text">{entry.role} <span class="text-text-muted">@ {entry.org}</span></p>
			<p class="text-text-muted">{formatRange(entry)}</p>
		</li>
	{/each}
</ol>
