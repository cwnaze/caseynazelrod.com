import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';

// Set only for the GitHub Pages deploy (see .github/workflows/deploy.yml), since this repo
// isn't named <user>.github.io, so it serves from a project subpath (e.g. /caseynazelrod.com/)
// until the custom domain is wired up. IMPORTANT: once caseynazelrod.com's DNS/CNAME is
// configured (per docs/00-overview.md), the site moves to serving from the domain root —
// remove BASE_PATH from the deploy workflow at that point, or every asset URL will 404.
// SvelteKit derives Vite's own `base` config from this automatically — don't set both.
const envBasePath = process.env.BASE_PATH;
const base = envBasePath && envBasePath.startsWith('/') ? (envBasePath as `/${string}`) : '';

export default defineConfig({
	plugins: [
		tailwindcss(),
		enhancedImages(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter(),
			paths: { base }
		})
	]
});
