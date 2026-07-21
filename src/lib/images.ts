import type { Picture } from 'imagetools-core';

// Build-time optimized images, keyed the same way ProjectImage.src is authored in
// src/lib/data/projects.ts (e.g. "projects/civsail/1.png") — resolved via a glob import
// rather than one-off static imports, since which images exist is data-driven, not
// known ahead of time in markup. Each entry is a vite-imagetools "Picture" object
// (responsive srcset/sizes across AVIF/WebP + a fallback format) when the file is found
// under src/lib/images/; resolveImage() falls back to the raw path string otherwise, which
// <enhanced:img> renders as a plain, un-optimized <img> (see @sveltejs/enhanced-img).
const modules = import.meta.glob<Picture>('./images/**/*.{png,jpg,jpeg}', {
	query: { enhanced: true },
	eager: true,
	import: 'default'
});

const images: Record<string, Picture> = {};
for (const [path, mod] of Object.entries(modules)) {
	const key = path.replace(/^\.\/images\//, '');
	images[key] = mod;
}

export function resolveImage(src: string): string | Picture {
	return images[src] ?? src;
}
