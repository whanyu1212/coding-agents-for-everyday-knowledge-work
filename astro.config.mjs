// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages serves this project repo from a sub-path, not the domain root.
  // Without `site` + `base`, every CSS/JS/asset URL resolves against the domain
  // root and 404s. See: https://docs.astro.build/en/guides/deploy/github/
  site: 'https://whanyu1212.github.io',
  // Trailing slash matters: it makes `import.meta.env.BASE_URL` end in "/", so
  // `${BASE_URL}logos/...` concatenates correctly instead of "...worklogos/".
  base: '/coding-agents-for-everyday-knowledge-work/',
});
