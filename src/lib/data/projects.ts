export interface ProjectImage {
	src: string; // path under /static, e.g. "/images/projects/foo/1.png"
	alt: string; // required, meaningful alt text — not "screenshot"
	caption?: string; // optional caption shown in lightbox
}

export interface Project {
	slug: string; // unique, url-safe id, e.g. "civsail"
	title: string;
	summary: string; // short card-level description (1–2 sentences)
	description?: string; // longer copy, optional — shown if a project detail expansion exists
	techStack: string[]; // e.g. ["SvelteKit", "TypeScript", "PostgreSQL"]
	images: ProjectImage[]; // first image is used as the card thumbnail
	links?: {
		demo?: string;
		repo?: string;
		writeup?: string;
	};
	year: number; // required, shown on every card (e.g. 2025)
}
// No `featured` tier — unnecessary at 2-project launch scale (CivSail, Nexus);
// both render equal-weight in one grid.

export const projects: Project[] = [
	{
		slug: 'civsail',
		title: 'CivSail',
		summary:
			'Seed placeholder entry — real summary pending (see docs/04-software-section.md open questions).',
		techStack: ['SvelteKit', 'TypeScript'],
		images: [
			{
				src: '/images/projects/civsail/1.png',
				alt: 'Placeholder cover image representing the CivSail project (real screenshot pending)'
			}
		],
		links: {},
		year: 2025
	},
	{
		slug: 'nexus',
		title: 'Nexus',
		summary:
			'Seed placeholder entry — real summary pending (see docs/04-software-section.md open questions).',
		techStack: ['TypeScript'],
		images: [
			{
				src: '/images/projects/nexus/1.png',
				alt: 'Placeholder cover image representing the Nexus project (real screenshot pending)'
			}
		],
		links: {},
		year: 2025
	}
];
