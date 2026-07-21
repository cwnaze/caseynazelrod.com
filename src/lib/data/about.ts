export interface ExperienceEntry {
	role: string;
	org: string; // e.g. "InvitaHealth"
	startDate: string; // ISO date
	endDate?: string; // omitted if current
}

export interface AboutContent {
	narrative: string[]; // one string per paragraph
	currentlyBuilding: string; // e.g. "a full agentic development suite (Hermes agent)"
	experience: ExperienceEntry[];
}

export const about: AboutContent = {
	// PLACEHOLDER_COPY: real narrative pending (see docs/03-hero-about.md open questions)
	narrative: [
		'PLACEHOLDER_COPY: real About narrative pending.',
		'PLACEHOLDER_COPY: background story and dev+security framing to be supplied.'
	],
	currentlyBuilding: 'a full agentic development suite (Hermes agent)',
	experience: [
		{
			// PLACEHOLDER_COPY: real dates pending (see docs/03-hero-about.md open questions)
			role: 'Software Engineering Intern',
			org: 'Finback 670',
			startDate: '2025-06-01',
			endDate: '2025-08-31'
		},
		{
			// PLACEHOLDER_COPY: real dates pending (see docs/03-hero-about.md open questions)
			role: 'Software Engineering Intern',
			org: 'InvitaHealth',
			startDate: '2026-06-01'
		}
	]
};
