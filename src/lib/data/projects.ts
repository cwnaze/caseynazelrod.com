export interface ProjectImage {
	src: string; // key resolved via src/lib/images.ts's resolveImage(), e.g. "projects/foo/1.png"
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
		demo?: string; // a demo/staging deployment — rendered as "Live Demo"
		site?: string; // the real, live production site — rendered as "Visit Site"
		repo?: string;
		writeup?: string;
	};
	year: number | string; // required, shown on every card (e.g. 2025 or "2025 – Present" for ongoing work)
}
// No `featured` tier — unnecessary at 2-project launch scale (CivSail, Nexus);
// both render equal-weight in one grid.

export const projects: Project[] = [
	{
		slug: 'civsail',
		title: 'CivSail',
		summary: 'A hub for merchant mariners — ships, ports, tools, and career resources in one place.',
		description:
			"CivSail brings together the information merchant mariners otherwise have to dig for out of Facebook groups and " +
			'ten-year-old PDFs: ship class guides, interactive port pages, MSC pay calculators and tools, and a professional network.',
		techStack: ['Next.js', 'TypeScript', 'Supabase'],
		images: [
			{
				src: 'projects/civsail/1.png',
				alt: 'CivSail landing page showing the "One hub for your life as a mariner" hero section'
			},
			{
				src: 'projects/civsail/2.png',
				alt: 'Second placeholder image representing the CivSail project (real screenshot pending)'
			}
		],
		links: {
			site: 'https://civsail.com',
			repo: 'https://github.com/CIVSail/civsail-website'
		},
		year: '2025 – Present'
	},
	{
		slug: 'nexus',
		title: 'Nexus',
		summary: 'A web server that exposes local virtual machines over VNC — connect to a VM straight from the browser.',
		description:
			'Nexus streams a VNC connection to a local virtual machine into the browser via noVNC, so you can access ' +
			'and control a VM through a website instead of a dedicated VNC client.',
		techStack: ['SvelteKit', 'TypeScript', 'noVNC'],
		images: [
			{
				src: 'projects/nexus/1.png',
				alt: 'Placeholder cover image representing the Nexus project (real screenshot pending)'
			},
			{
				src: 'projects/nexus/2.png',
				alt: 'Second placeholder image representing the Nexus project (real screenshot pending)'
			}
		],
		links: {
			repo: 'https://github.com/cwnaze/Nexus-Web-Server'
		},
		year: '2024 – 2025'
	}
];
