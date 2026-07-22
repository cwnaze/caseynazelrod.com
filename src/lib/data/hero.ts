export interface HeroContent {
	bootLines: string[]; // terminal boot lines typed before the final content
	name: string;
	title: string;
	resumeUrl: string; // placeholder for v1
	githubUrl: string; // placeholder for v1
	linkedinUrl: string; // placeholder for v1
}

export const hero: HeroContent = {
	bootLines: ['> initializing casey.dev...', '> loading profile...'],
	name: 'Casey Nazelrod',
	title: 'Software Developer & Cybersecurity Practitioner',
	resumeUrl: '/resume.pdf',
	githubUrl: 'https://github.com/cwnaze',
	linkedinUrl: 'https://linkedin.com/in/casey-nazelrod'
};
