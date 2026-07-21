export type CertStatus = 'active' | 'expired' | 'in-progress';

export interface Certification {
	id: string; // unique slug, e.g. "sec-plus"
	name: string; // e.g. "CompTIA Security+"
	issuer: string; // e.g. "CompTIA"
	issueDate?: string; // ISO date; omitted if status = "in-progress"
	expiryDate?: string; // ISO date, omitted if non-expiring or in-progress
	status: CertStatus;
	credentialId?: string;
	verifyUrl?: string;
	logo?: string; // optional — no logo assets yet, cards render text-only for now
}
// "Expiring soon" is a derived display state, not a distinct CertStatus value:
// a cert with status "active" and expiryDate within EXPIRY_WARNING_DAYS (default 90) renders
// a visually distinct "expiring soon" badge, computed at render time from expiryDate — not stored.
export const EXPIRY_WARNING_DAYS = 90;

export interface Accomplishment {
	id: string;
	title: string; // e.g. "1st Place, Regional CTF 2024"
	description?: string;
	date?: string; // ISO date
	link?: string; // e.g. writeup, article, or event page
}

// Real category list is still TBD per the owner's actual tools (see docs/05-cybersecurity-section.md
// open questions); extend this union as needed rather than falling back to a plain string.
export type SecurityToolCategory = 'Offensive' | 'Defensive' | 'Forensics' | 'GRC';

export interface SecurityTool {
	name: string; // e.g. "Burp Suite"
	category: SecurityToolCategory;
}

export const certifications: Certification[] = [
	{
		id: 'security-plus',
		// PLACEHOLDER_COPY: real cert name/issuer/dates pending owner confirmation
		name: 'CompTIA Security+',
		issuer: 'CompTIA',
		issueDate: '2024-09-15',
		expiryDate: '2026-09-15',
		status: 'active',
		// PLACEHOLDER_COPY: real credential ID/verify URL pending
		credentialId: 'COMP001234567890',
		verifyUrl: 'https://example.com/verify/security-plus'
	},
	{
		id: 'aws-saa',
		// PLACEHOLDER_COPY: real cert name/issuer/dates pending owner confirmation
		name: 'AWS Certified Solutions Architect – Associate',
		issuer: 'Amazon Web Services',
		issueDate: '2024-10-01',
		expiryDate: '2026-10-01',
		status: 'active',
		// PLACEHOLDER_COPY: real credential ID/verify URL pending
		credentialId: 'AWS-PLACEHOLDER-0001',
		verifyUrl: 'https://example.com/verify/aws-saa'
	},
	{
		id: 'cpts',
		name: 'CPTS',
		issuer: 'Hack The Box',
		status: 'in-progress'
	}
];

export const accomplishments: Accomplishment[] = [
	{
		id: 'ctf-regional-2025',
		// PLACEHOLDER_COPY: real placement/competition name/date pending
		title: '2nd Place, Regional Collegiate Cyber Defense Competition',
		description:
			'Team placement in a regional qualifier defending a simulated corporate network against live red-team attacks.',
		date: '2025-03-01'
	},
	{
		id: 'ctf-national-cyber-league',
		// PLACEHOLDER_COPY: real placement/competition name/date pending
		title: 'Top 10%, National Cyber League (Individual Game)',
		description:
			'Individual placement across categories including cryptography, log analysis, and network traffic analysis.',
		date: '2024-11-01'
	}
];

export const securityTools: SecurityTool[] = [
	// PLACEHOLDER_COPY: real tool list pending owner confirmation (see docs/05-cybersecurity-section.md open questions)
	{ name: 'Burp Suite', category: 'Offensive' },
	{ name: 'Nmap', category: 'Offensive' },
	{ name: 'Metasploit', category: 'Offensive' },
	{ name: 'Wireshark', category: 'Defensive' },
	{ name: 'Splunk', category: 'Defensive' },
	{ name: 'Autopsy', category: 'Forensics' },
	{ name: 'Volatility', category: 'Forensics' }
];
