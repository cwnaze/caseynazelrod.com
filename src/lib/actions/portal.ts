/**
 * Moves a node to be a direct child of document.body on mount, and removes it on destroy.
 * Used for true top-level overlays (e.g. the lightbox) so they aren't nested inside page
 * content — that nesting would otherwise let assistive-tech browse-mode navigation (which
 * isn't bound by JS keydown handlers) wander into the "inert" background while the overlay
 * is open, even with a working Tab-key focus trap.
 */
export function portal(node: HTMLElement) {
	document.body.appendChild(node);
	return {
		destroy() {
			node.remove();
		}
	};
}
