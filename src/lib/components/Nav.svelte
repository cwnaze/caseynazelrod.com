<script lang="ts">
	const SECTION_IDS = ['hero', 'about', 'software', 'cybersecurity'] as const;
	type SectionId = (typeof SECTION_IDS)[number];

	const LINKS: { id: SectionId; label: string }[] = [
		{ id: 'about', label: 'About' },
		{ id: 'software', label: 'Software' },
		{ id: 'cybersecurity', label: 'Cybersecurity' }
	];

	let activeSection = $state<SectionId>('hero');
	let dockedNav = $state(false);
	let mobileMenuOpen = $state(false);

	function prefersReducedMotion() {
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	function scrollToSection(id: SectionId | 'hero') {
		const el = document.getElementById(id);
		if (!el) return;
		el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
		const url = id === 'hero' ? location.pathname + location.search : `#${id}`;
		history.pushState(null, '', url);
		mobileMenuOpen = false;
	}

	$effect(() => {
		const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
			(el): el is HTMLElement => el !== null
		);

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						activeSection = entry.target.id as SectionId;
					}
				}
			},
			{ rootMargin: '-45% 0px -45% 0px', threshold: 0 }
		);

		for (const section of sections) observer.observe(section);

		return () => observer.disconnect();
	});

	$effect(() => {
		function onScroll() {
			dockedNav = window.scrollY > 10;
		}
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	$effect(() => {
		if (!mobileMenuOpen) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = previousOverflow;
		};
	});
</script>

<nav
	class="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 transition-colors duration-200 motion-reduce:transition-none {dockedNav
		? 'border-b border-green bg-surface'
		: 'border-b border-transparent bg-transparent'}"
>
	<button
		type="button"
		class="glitch-hover font-mono text-sm text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright"
		onclick={() => scrollToSection('hero')}
	>
		casey@nazelrod:~$
	</button>

	<ul class="hidden items-center gap-6 font-mono text-sm md:flex">
		{#each LINKS as link (link.id)}
			<li>
				<a
					href="#{link.id}"
					aria-current={activeSection === link.id ? 'page' : undefined}
					class="glitch-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright {activeSection ===
					link.id
						? 'text-green-bright'
						: 'text-text'}"
					onclick={(e) => {
						e.preventDefault();
						scrollToSection(link.id);
					}}
				>
					{#if activeSection === link.id}<span aria-hidden="true" class="mr-1">&gt;</span
						>{/if}{link.label}
				</a>
			</li>
		{/each}
	</ul>

	<button
		type="button"
		class="font-mono text-sm text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright md:hidden"
		aria-expanded={mobileMenuOpen}
		aria-controls="mobile-nav-overlay"
		onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
	>
		{mobileMenuOpen ? 'close' : 'menu'}
	</button>
</nav>

{#if mobileMenuOpen}
	<div
		id="mobile-nav-overlay"
		class="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-surface md:hidden"
	>
		{#each LINKS as link (link.id)}
			<a
				href="#{link.id}"
				aria-current={activeSection === link.id ? 'page' : undefined}
				class="glitch-hover font-mono text-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright {activeSection ===
				link.id
					? 'text-green-bright'
					: 'text-text'}"
				onclick={(e) => {
					e.preventDefault();
					scrollToSection(link.id);
				}}
			>
				{#if activeSection === link.id}<span aria-hidden="true" class="mr-1">&gt;</span
					>{/if}{link.label}
			</a>
		{/each}
	</div>
{/if}
