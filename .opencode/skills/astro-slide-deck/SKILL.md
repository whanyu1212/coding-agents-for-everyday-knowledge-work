---
name: astro-slide-deck
description: "Use when creating, refactoring, or polishing Astro-based technical slide decks: src/pages/index.astro, src/slides, deck CSS, presentation flow, citations, cheatsheets, appendix sections, GitHub Pages base paths, responsive layout, and build verification."
---

# Astro Slide Deck

Use this skill for Astro-based slide decks and technical talk sites, especially
single-page decks that can grow into one very large `src/pages/index.astro`.

The goal is not just valid Astro. The goal is a maintainable presentation that
builds cleanly, reads well from the back of the room, works on desktop and
mobile, and keeps sourced claims grounded.

## First Inspect

Before editing, build context from the actual project:

- Read `package.json`, `astro.config.mjs`, `README.md`, `src/pages/index.astro`,
  `src/layouts/*`, `src/components/*`, and existing styles.
- Check whether the site is deployed under a subpath. For GitHub Pages repo
  sites, confirm `site` and `base` in `astro.config.mjs`.
- Check how assets are referenced. Public assets should usually use
  `import.meta.env.BASE_URL` when the site has a non-root base path.
- Identify whether the deck is a one-off prototype or a maintained talk. Refactor
  harder only when the deck will keep evolving.

## Recommended Structure

Prefer this shape for maintained decks:

```text
src/
  pages/
    index.astro              # deck manifest only
  components/
    deck/
      Slide.astro
      Nav.astro
  slides/
    IntroSlide.astro
    TopicSlide.astro
    AppendixDividerSlide.astro
  styles/
    deck.css                 # ordered import manifest
    deck/
      base.css
      intro.css
      topic.css
      appendix.css
```

Keep `src/pages/index.astro` as the deck orchestrator:

- import layout, nav, slide shell, slide components, and shared CSS
- define slide order, IDs, labels, and variants in one manifest
- render the slides from that manifest

Avoid putting every slide and every CSS rule in `index.astro` once the file gets
large. The route should describe the deck, not contain the whole deck.

## Manifest Pattern

Use one source of truth for nav and slide order:

```astro
---
import '../styles/deck.css';

import Layout from '../layouts/Layout.astro';
import Slide from '../components/deck/Slide.astro';
import Nav from '../components/deck/Nav.astro';

import IntroSlide from '../slides/IntroSlide.astro';

const slides = [
  { id: 'intro', label: 'Intro', variant: 'accent', Component: IntroSlide },
] as const;

const sections = slides.map(({ id, label }) => ({ id, label }));
---

<Layout title="Talk Title">
  <Nav sections={sections} />
  {slides.map(({ id, variant = 'default', Component }) => (
    <Slide id={id} variant={variant}>
      <Component />
    </Slide>
  ))}
</Layout>
```

If dynamic component rendering causes Astro issues, fall back to explicit slide
rendering. Do not fight the framework for a small deck.

## Safe Refactor Workflow

When splitting a long `index.astro`:

1. Run `npm run build` first and record whether the baseline is green.
2. Move the large page-level `<style>` block to an imported global stylesheet
   before splitting slides. Astro component styles are scoped, so a parent page
   style block may stop applying after slide content moves into child components.
3. Create one `src/slides/*Slide.astro` file per slide. Put only the inner slide
   content there, not the shared `<Slide>` wrapper.
4. Convert `index.astro` to the manifest pattern.
5. Build again.
6. Split the shared stylesheet into ordered modules only after the markup split
   is stable.
7. Remove unused components and stale selectors only after searching for actual
   references.
8. Update `README.md` so future edits happen in the right files.
9. Run `npm run build` again.

When the workspace is on an external macOS drive, AppleDouble files may appear.
If `.DS_Store` or `._*` files show up, clean only known macOS metadata files and
make sure `.gitignore` covers them.

## Slide Design Checklist

Design the deck like a talk, not a web app page dump:

- Make each slide answer one job: frame, prove, compare, demonstrate, summarize,
  transition, or appendix.
- Use section divider slides before abrupt transitions, especially before
  appendix content.
- Keep appendix slides visually distinct but quieter than main thesis slides.
- Make cheatsheets look like reference material: dense, scannable, grouped, and
  grounded in docs.
- Vary slide layouts. Avoid every slide becoming three identical cards.
- Keep recurring visual language consistent: overlines, highlights, citations,
  footer notes, card radii, and accent colors.
- Check mobile behavior for dense grids, tables, terminal panes, and nav.
- Prefer a smaller slide split over tiny unreadable text.

## Content Grounding

Ground factual or command-heavy slides before presenting them as reference:

- For product/tool cheatsheets, fetch official docs and use documented commands,
  paths, and config names.
- For metrics, cite the source and label self-reported figures as self-reported.
- For architecture claims, link to source code, docs, papers, or screenshots.
- For forward-looking claims, separate fact from opinion.
- Add a compact citation line when a slide depends on external sources.

Do not create a cheatsheet from vibes. If it lists commands, config paths,
permissions, or workflows, verify them first.

## Astro And Deployment Gotchas

- For GitHub Pages repo sites, set both `site` and `base` in `astro.config.mjs`.
- Use `import.meta.env.BASE_URL` for public assets when deployed under a base
  path, for example `${import.meta.env.BASE_URL}logos/tool.png`.
- Do not edit `dist/`; it is generated.
- Keep global resets, CSS variables, and typography in `Layout.astro` or a base
  stylesheet.
- Keep shared slide shell behavior in `Slide.astro`.
- Keep nav keyboard/scroll behavior in `Nav.astro`.

## When To Extract Components

Do not over-abstract early. Split by slide first.

Extract small shared components only when repetition is obvious:

- citation line
- resource category/list
- demo card
- appendix aside/table shell
- terminal/code pane

Avoid generic components that hide slide-specific storytelling. A slide deck is
allowed to have bespoke markup when that improves readability.

## Verification

Before finishing:

- Run `npm run build`.
- Check `git status --short` and ensure generated files are not staged.
- Inspect `git diff --stat` for intended scope.
- Search for unused old component imports after refactors.
- Search for obvious stale CSS selectors if large CSS was moved.
- Confirm no `.DS_Store` or `._*` files remain in the workspace.

## Good User-Facing Summary

When done, summarize in terms the speaker cares about:

- where content now lives
- how to add/reorder slides
- what visual/content improvements changed
- what verification passed
- any remaining risks, like visual QA that still needs browser review
