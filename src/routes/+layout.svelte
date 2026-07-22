<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Nav from '$lib/components/Nav.svelte';
	import ScanlineOverlay from '$lib/components/ScanlineOverlay.svelte';
	import ScrollVine from '$lib/components/ScrollVine.svelte';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';

	injectAnalytics();

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<ScanlineOverlay />
<Nav />
<ScrollVine />
{@render children()}
