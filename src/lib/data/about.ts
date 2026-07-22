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
	narrative: [
		"I'm a Computer Engineering student at the University of Florida (Cybersecurity specialization) who likes building things and then trying to break them — usually in that order, occasionally not.",
		'My work spans full-stack development and offensive security: shipping production features during internships, and competing internationally in cybersecurity on the side — including a 3rd-place finish out of 77 teams at the RTARF Cyber Warrior Competition in Bangkok. I like the overlap between the two disciplines more than either one alone — writing code makes me a better attacker, and thinking like an attacker makes me write safer code.'
	],
	currentlyBuilding: 'a full agentic development suite (Hermes agent)',
	experience: [
		{
			role: 'Software Engineering Intern',
			org: 'InvitaHealth',
			startDate: '2026-06-01'
		},
		{
			role: 'Software Developer',
			org: 'Finback 670',
			startDate: '2024-01-01',
			endDate: '2025-12-31'
		},
		{
			role: 'Product Developer',
			org: 'LBCSI',
			startDate: '2024-01-01',
			endDate: '2025-12-31'
		},
		{
			role: 'Software Beta Tester',
			org: 'Carolina 777',
			startDate: '2023-01-01',
			endDate: '2023-12-31'
		},
		{
			role: 'Linux Training Lead',
			org: 'LBCSI',
			startDate: '2022-01-01',
			endDate: '2023-12-31'
		}
	]
};
