<script lang="ts">
	import type { ProjectImage } from '$lib/data/projects';
	import { portal } from '$lib/actions/portal';
	import { resolveImage } from '$lib/images';

	let {
		images,
		activeIndex,
		onClose,
		onNavigate,
		triggerElement
	}: {
		images: ProjectImage[];
		activeIndex: number;
		onClose: () => void;
		onNavigate: (index: number) => void;
		triggerElement: HTMLElement | null;
	} = $props();

	let dialogEl = $state<HTMLDivElement | undefined>();
	let touchStartX = $state<number | null>(null);

	const activeImage = $derived(images[activeIndex]);
	const hasMultiple = $derived(images.length > 1);

	function next() {
		onNavigate((activeIndex + 1) % images.length);
	}

	function prev() {
		onNavigate((activeIndex - 1 + images.length) % images.length);
	}

	function trapFocus(e: KeyboardEvent) {
		if (!dialogEl) return;
		const focusable = dialogEl.querySelectorAll<HTMLElement>(
			'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
		);
		if (focusable.length === 0) return;
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			onClose();
		} else if (e.key === 'ArrowRight' && hasMultiple) {
			e.preventDefault();
			next();
		} else if (e.key === 'ArrowLeft' && hasMultiple) {
			e.preventDefault();
			prev();
		} else if (e.key === 'Tab') {
			trapFocus(e);
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) onClose();
	}

	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
	}

	function handleTouchEnd(e: TouchEvent) {
		if (touchStartX === null || !hasMultiple) return;
		const SWIPE_THRESHOLD_PX = 40;
		const deltaX = e.changedTouches[0].clientX - touchStartX;
		if (deltaX > SWIPE_THRESHOLD_PX) prev();
		else if (deltaX < -SWIPE_THRESHOLD_PX) next();
		touchStartX = null;
	}

	$effect(() => {
		dialogEl?.focus();
	});

	$effect(() => {
		const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
		const previousOverflow = document.body.style.overflow;
		const previousPaddingRight = document.body.style.paddingRight;
		document.body.style.overflow = 'hidden';
		if (scrollbarWidth > 0) {
			document.body.style.paddingRight = `${scrollbarWidth}px`;
		}
		return () => {
			document.body.style.overflow = previousOverflow;
			document.body.style.paddingRight = previousPaddingRight;
		};
	});

	// Once portalled, dialogEl is a direct child of <body> — every OTHER direct child of
	// <body> is background page content that should be unreachable (both to focus and to
	// assistive-tech browse-mode navigation) while the dialog is open. Inert-removal and
	// focus-restore are combined into one effect (not two separate ones) so cleanup order
	// is guaranteed: focus() on triggerElement must run strictly after its inert ancestor
	// is cleared, or the focus call silently fails and falls back to <body>.
	$effect(() => {
		if (!dialogEl) return;
		const siblings = [...document.body.children].filter((el): el is HTMLElement => el !== dialogEl);
		for (const el of siblings) el.inert = true;
		return () => {
			for (const el of siblings) el.inert = false;
			triggerElement?.focus();
		};
	});
</script>

<div
	use:portal
	bind:this={dialogEl}
	role="dialog"
	aria-modal="true"
	aria-label="Project image gallery"
	tabindex="-1"
	class="fixed inset-0 z-50 flex items-center justify-center bg-base/95 p-4"
	onkeydown={handleKeydown}
	onclick={handleBackdropClick}
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
>
	<button
		type="button"
		class="absolute top-4 right-4 font-mono text-sm text-text hover:text-green-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright"
		onclick={onClose}
	>
		[ close ]
	</button>

	{#if hasMultiple}
		<button
			type="button"
			aria-label="Previous image"
			class="absolute left-4 font-mono text-2xl text-text hover:text-green-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright"
			onclick={prev}
		>
			‹
		</button>
	{/if}

	<figure class="max-h-full max-w-3xl">
		<enhanced:img
			src={resolveImage(activeImage.src)}
			alt={activeImage.alt}
			class="max-h-[80vh] w-auto border border-green"
		/>
		{#if activeImage.caption}
			<figcaption class="mt-2 text-center font-mono text-sm text-text-muted">
				{activeImage.caption}
			</figcaption>
		{/if}
	</figure>

	{#if hasMultiple}
		<button
			type="button"
			aria-label="Next image"
			class="absolute right-4 font-mono text-2xl text-text hover:text-green-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright"
			onclick={next}
		>
			›
		</button>
	{/if}
</div>
