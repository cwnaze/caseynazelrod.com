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

export const certifications: Certification[] = [
	{
		id: 'security-plus',
		name: 'CompTIA Security+',
		issuer: 'CompTIA',
		issueDate: '2023-09-01',
		status: 'active',
		credentialId: 'HXVE0DKTGEV114S0',
		verifyUrl: 'https://www.certmetrics.com/comptia/public/verification.aspx?code=HXVE0DKTGEV114S0'
	},
	{
		id: 'network-plus',
		name: 'CompTIA Network+',
		issuer: 'CompTIA',
		issueDate: '2021-09-01',
		status: 'active',
		credentialId: 'YZ5XJ2RN43FE1KWL',
		verifyUrl: 'https://www.certmetrics.com/comptia/public/verification.aspx?code=YZ5XJ2RN43FE1KWL'
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
		id: 'cyberpatriot-xvi',
		title: 'CyberPatriot XVI — 5th Place Nationally',
		description: 'Advanced to National Finals with the Air Force Association CyberPatriot program.',
		date: '2025-01-01'
	},
	{
		id: 'cyber-chats-podcast',
		title: '#Cyber Chats Podcast Guest',
		description: 'Discussed cybersecurity opportunities for youth interested in the field.',
		date: '2025-01-01'
	},
	{
		id: 'rtarf-cyber-warrior',
		title: 'RTARF Cyber Warrior Competition — 3rd of 77 International Teams',
		description:
			'Represented U.S. Cyber Command in Bangkok, Thailand, favoring problems in programming, cryptography, and web exploitation.',
		date: '2024-01-01'
	},
	{
		id: 'cyberpatriot-xv',
		title: 'CyberPatriot XV — 8th Place Nationally, 1st Place Maryland',
		description: 'Advanced to National Finals with the Air Force Association CyberPatriot program.',
		date: '2024-01-01'
	},
	{
		id: 'cyber-battle-nordic-baltics',
		title: 'Cyber Battle of the Nordic-Baltics — 6th Internationally',
		description:
			'Competed in Tartu, Estonia, favoring problems in web exploitation and penetration testing.',
		date: '2023-01-01'
	},
	{
		id: 'cyberpatriot-xiv',
		title: 'CyberPatriot XIV — 21st Place Nationally, 1st Place Maryland',
		description: 'Air Force Association CyberPatriot program.',
		date: '2023-01-01'
	}
];
