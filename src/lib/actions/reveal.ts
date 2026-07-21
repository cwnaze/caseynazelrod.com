import type { Action } from 'svelte/action';

interface RevealParams {
	/** Extra delay before revealing, in ms — used to stagger grid items. */
	delayMs?: number;
}

/**
 * Adds `is-visible` (see the `.reveal`/`.is-visible` CSS in layout.css — opacity/transform
 * only, never layout-affecting properties) whenever the element crosses ~20% into the
 * viewport, and removes it as soon as the element leaves — repeatable, so scrolling away
 * and back re-plays the fade-in every time, not just once per page load.
 * Under prefers-reduced-motion, skips the hidden state entirely so nothing needs to animate in.
 */
export const reveal: Action<HTMLElement, RevealParams | undefined> = (node, params) => {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		node.classList.add('is-visible');
		return {};
	}

	const delayMs = params?.delayMs ?? 0;
	node.classList.add('reveal');

	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				clearTimeout(timeoutId);
				if (entry.isIntersecting) {
					timeoutId = setTimeout(() => node.classList.add('is-visible'), delayMs);
				} else {
					node.classList.remove('is-visible');
				}
			}
		},
		{ threshold: 0.2 }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
			clearTimeout(timeoutId);
		}
	};
};
