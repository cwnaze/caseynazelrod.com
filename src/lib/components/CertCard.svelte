<script lang="ts">
	import type { Certification } from '$lib/data/certs';
	import { EXPIRY_WARNING_DAYS } from '$lib/data/certs';
	import { formatMonthYear, daysUntil } from '$lib/utils/date';

	let { cert }: { cert: Certification } = $props();

	// Derived at render time from expiryDate, not trusted from `status` alone — an "active"
	// cert whose expiryDate has quietly passed (data not yet updated to "expired") should
	// still visually read as expired, not silently show as "Active".
	const daysUntilExpiry = $derived(cert.expiryDate ? daysUntil(cert.expiryDate) : null);
	const isPastExpiry = $derived(
		cert.status === 'active' && daysUntilExpiry !== null && daysUntilExpiry < 0
	);
	const isExpiringSoon = $derived(
		cert.status === 'active' &&
			daysUntilExpiry !== null &&
			daysUntilExpiry >= 0 &&
			daysUntilExpiry <= EXPIRY_WARNING_DAYS
	);

	const badge = $derived.by(() => {
		if (cert.status === 'in-progress') return { label: 'In Progress', class: 'text-green-bright' };
		if (cert.status === 'expired' || isPastExpiry) {
			return { label: 'Expired', class: 'text-text-muted' };
		}
		if (isExpiringSoon) return { label: 'Expiring Soon', class: 'text-purple' };
		return { label: 'Active', class: 'text-green' };
	});

	const dateRange = $derived.by(() => {
		if (cert.status === 'in-progress' || !cert.issueDate) return null;
		const issued = formatMonthYear(cert.issueDate);
		return cert.expiryDate ? `${issued} – ${formatMonthYear(cert.expiryDate)}` : `Issued ${issued}`;
	});
</script>

<article
	class="border p-4 font-mono text-sm {cert.status === 'in-progress'
		? 'border-dashed border-green-bright'
		: 'border-purple-deep'}"
>
	<div class="flex items-start justify-between gap-2">
		<h3 class="font-sans font-bold text-base text-text">{cert.name}</h3>
		<span class="font-bold whitespace-nowrap {badge.class}">[ {badge.label} ]</span>
	</div>

	<p class="mt-1 text-text-muted">{cert.issuer}</p>

	{#if dateRange}
		<p class="mt-2 text-text-muted">{dateRange}</p>
	{/if}

	{#if cert.credentialId}
		<p class="mt-1 text-text-muted">ID: {cert.credentialId}</p>
	{/if}

	{#if cert.verifyUrl}
		<a
			href={cert.verifyUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="mt-3 inline-block text-purple underline-offset-4 hover:text-green-bright hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright"
		>
			Verify
		</a>
	{/if}
</article>
