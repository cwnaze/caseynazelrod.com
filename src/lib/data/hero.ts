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
	// PLACEHOLDER_COPY: swap for real links before launch (see docs/03-hero-about.md open questions)
	resumeUrl: '/resume.pdf',
	githubUrl: 'https://github.com/placeholder',
	linkedinUrl: 'https://linkedin.com/in/placeholder'
};
