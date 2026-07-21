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
		// PLACEHOLDER_COPY: real summary pending (see docs/04-software-section.md open questions)
		summary:
			'A civic-engagement platform helping residents track and weigh in on local government initiatives.',
		// PLACEHOLDER_COPY: real description pending
		description:
			'CivSail lets residents follow local council agendas, proposed ordinances, and public meetings in one place, ' +
			'with plain-language summaries and a way to submit public comment directly to the relevant committee.',
		techStack: ['SvelteKit', 'TypeScript', 'PostgreSQL'],
		images: [
			{
				src: 'projects/civsail/1.png',
				alt: 'Placeholder cover image representing the CivSail project (real screenshot pending)'
			},
			{
				src: 'projects/civsail/2.png',
				alt: 'Second placeholder image representing the CivSail project (real screenshot pending)'
			}
		],
		links: {
			// PLACEHOLDER_COPY: real links pending
			demo: 'https://civsail.example.com',
			repo: 'https://github.com/placeholder/civsail'
		},
		year: 2025
	},
	{
		slug: 'nexus',
		title: 'Nexus',
		// PLACEHOLDER_COPY: real summary pending (see docs/04-software-section.md open questions)
		summary:
			'A unified developer dashboard that aggregates data from multiple internal APIs into one live view.',
		// PLACEHOLDER_COPY: real description pending
		description:
			'Nexus pulls status, logs, and metrics from several internal services into a single dashboard, ' +
			'so an on-call engineer can see the health of an entire system without switching between tools.',
		techStack: ['TypeScript', 'Node.js', 'Redis'],
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
			// PLACEHOLDER_COPY: real links pending
			demo: 'https://nexus.example.com',
			repo: 'https://github.com/placeholder/nexus'
		},
		year: 2025
	}
];
