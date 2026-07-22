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
		"I'm a Computer Engineering student at the University of Florida, specializing in cybersecurity, with hands-on experience building full-stack web applications and agentic AI tools alongside a track record competing internationally in offensive and defensive security.",
		"My work has combined software development internships — building and maintaining production platforms with SvelteKit, Next.js, and Supabase — with competitive cybersecurity, including a 3rd-place finish out of 77 international teams at the RTARF Cyber Warrior Competition in Bangkok and multiple national top-10 finishes in the Air Force Association's CyberPatriot program. I'm drawn to the intersection of the two: applying secure development practices to the software I build, and engineering instincts to the systems I try to break."
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
