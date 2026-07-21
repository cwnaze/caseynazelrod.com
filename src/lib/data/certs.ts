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

export interface SecurityTool {
	name: string; // e.g. "Burp Suite"
	category: string; // e.g. "Offensive" | "Defensive" | "Forensics" | "GRC"
}

export const certifications: Certification[] = [
	{
		id: 'cert-1-placeholder',
		name: 'Seed placeholder cert 1',
		issuer: 'Seed placeholder issuer',
		issueDate: '2024-01-01',
		expiryDate: '2026-09-01',
		status: 'active'
	},
	{
		id: 'cert-2-placeholder',
		name: 'Seed placeholder cert 2',
		issuer: 'Seed placeholder issuer',
		issueDate: '2024-01-01',
		expiryDate: '2026-09-01',
		status: 'active'
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
		id: 'ctf-placeholder-1',
		title: 'Seed placeholder CTF/competition placement 1'
	},
	{
		id: 'ctf-placeholder-2',
		title: 'Seed placeholder CTF/competition placement 2'
	}
];

export const securityTools: SecurityTool[] = [
	{ name: 'Seed placeholder tool 1', category: 'Offensive' },
	{ name: 'Seed placeholder tool 2', category: 'Defensive' }
];
