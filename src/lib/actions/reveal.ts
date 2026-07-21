import type { Action } from 'svelte/action';

interface RevealParams {
	/** Extra delay before revealing, in ms — used to stagger grid items. */
	delayMs?: number;
}

/**
 * Adds `is-visible` (see the `.reveal`/`.is-visible` CSS in layout.css — opacity/transform
 * only, never layout-affecting properties) the first time the element crosses ~20% into the
 * viewport, then stops observing it (one-shot; scrolling back up never re-hides it).
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
				if (!entry.isIntersecting) continue;
				timeoutId = setTimeout(() => node.classList.add('is-visible'), delayMs);
				observer.unobserve(node);
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
