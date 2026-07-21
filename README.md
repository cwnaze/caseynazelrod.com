# caseynazelrod.com

Single-page scroll portfolio for Casey Nazelrod — software developer & cybersecurity practitioner. Built with Svelte 5 + SvelteKit, prerendered to fully static HTML via `@sveltejs/adapter-static`, styled with Tailwind CSS.

See `docs/` for the full set of design/implementation PRDs (design system, layout/nav, section specs, build plan) and `agents/` for the Ralph autonomous-build plan driving implementation story by story.

## Developing

Install dependencies, then start a dev server:

```sh
npm install
npm run dev -- --open
```

## Building

```sh
npm run build      # produces a static build/ output
npm run preview    # preview the production build locally
```

## Quality checks

```sh
npm run check   # typecheck (svelte-check)
npm run lint    # prettier --check + eslint
npm run format  # prettier --write
```

## Scaffold

This project was scaffolded with the Svelte CLI (`sv`). To recreate the initial scaffold configuration:

```sh
npx sv@0.16.4 create --template minimal --types ts --add prettier eslint tailwindcss="plugins:none" sveltekit-adapter="adapter:static" --no-download-check --install npm .
```
