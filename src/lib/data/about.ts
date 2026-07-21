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
	// PLACEHOLDER_COPY: real narrative pending (see docs/03-hero-about.md open questions) —
	// the paragraphs below are plausible placeholder prose, not confirmed biographical fact.
	narrative: [
		"I'm a software developer and cybersecurity practitioner who likes building things and then trying to break them — usually in that order, occasionally not.",
		'My work spans full-stack development and offensive security: shipping production features during the day, and working through CTFs and cert coursework on the side. I like the overlap between the two disciplines more than either one alone — writing code makes me a better attacker, and thinking like an attacker makes me write safer code.'
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
