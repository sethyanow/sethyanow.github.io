---
id: web-al2
title: Site UI/UX Audit Remediation
status: open
type: epic
priority: 1
---

## Context

Comprehensive UI/UX audit of sethyanow.github.io (Astro 5 + Tailwind CSS v4 personal site) identified 18 issues across accessibility, performance, theming, responsive design, and AI-slop aesthetics. The site currently reads as an unmodified Astro starter template with default Tailwind values. No `.impeccable.md` design context exists.

**Codebase snapshot (all verified via direct reads):**
- `src/layouts/Layout.astro` — shell: html lang, viewport, description meta, Header/Footer slots
- `src/components/Header.astro` — CSS-only checkbox hamburger nav, 3 links, aria-current active state
- `src/components/Footer.astro` — copyright year + GitHub external link
- `src/components/Hero.astro` — centered h1 + subtitle
- `src/components/ProjectCard.astro` — card link with tags
- `src/pages/index.astro` — Hero + welcome paragraph
- `src/pages/about.astro` — h1 + two paragraphs (uses `prose` class but typography plugin not installed)
- `src/pages/projects.astro` — h1 + 2-col grid with 1 ProjectCard
- `src/styles/global.css` — single line: `@import "tailwindcss";`
- No custom fonts, no dark mode, no design tokens, no favicon, no 404 page

## Requirements

### Phase 1: Accessibility & Resilience (Critical/High)
1. Add skip-to-content link in Layout.astro before Header
2. Add `aria-expanded` to mobile nav toggle (requires small script — checkbox hack can't express this in CSS alone)
3. Add explicit `focus-visible` styles on all interactive elements (nav links, ProjectCard, footer link)
4. Add screen reader text "(opens in new tab)" to Footer GitHub link
5. Add `<h2>` to homepage welcome section below Hero
6. Fix `transition-all` on ProjectCard → `transition-colors` + explicit shadow transition

### Phase 2: Theming & Polish
7. Add dark mode support (at minimum `prefers-color-scheme` media query via Tailwind `dark:` variants)
8. Replace pure `bg-white` with tinted neutral (e.g., `bg-gray-50` or custom warm white)
9. Add favicon (SVG emoji or simple mark)
10. Add `<meta name="theme-color">` for mobile browser chrome
11. Remove `prose prose-lg` from about.astro (plugin not installed) OR install `@tailwindcss/typography`
12. Add OpenGraph meta tags (`og:title`, `og:description`) to Layout.astro

### Phase 3: Design Identity (Anti-Slop)
13. Choose and load a distinctive display + body font pair (replace system defaults)
14. Create custom color palette with tinted neutrals (not default Tailwind blue/gray)
15. Break uniform spacing — introduce visual rhythm with varied section padding
16. Fix single-card grid on projects page (adapt layout to content count)
17. Create a custom 404 page

### Phase 4: Responsive Hardening
18. Replace magic `top-16` on mobile nav dropdown with flow-based positioning

## Success Criteria

### Phase 1
- [ ] Skip-to-content link exists, visible on focus, jumps to `#main`
- [ ] Mobile nav toggle has `aria-expanded` that reflects open/closed state
- [ ] All interactive elements show visible focus ring on keyboard focus
- [ ] Footer GitHub link announces "(opens in new tab)" to screen readers
- [ ] Homepage has proper heading hierarchy (h1 → h2)
- [ ] ProjectCard uses specific transition properties, not `transition-all`

### Phase 2
- [ ] Site renders appropriately in `prefers-color-scheme: dark`
- [ ] No pure `#fff` backgrounds remain (all tinted)
- [ ] Favicon appears in browser tab
- [ ] Mobile browsers show themed chrome color
- [ ] `prose` class either works (plugin installed) or is removed
- [ ] Sharing the URL on social media shows title and description

### Phase 3
- [ ] Custom fonts loaded — not system-ui/sans-serif defaults
- [ ] Color palette is custom, not default Tailwind blue-600/gray-600
- [ ] Sections have visually varied spacing (not uniform px-4 py-16 everywhere)
- [ ] Projects page layout adapts to item count (no half-empty grid)
- [ ] 404 page exists and matches site design

### Phase 4
- [ ] Mobile nav dropdown position doesn't depend on magic pixel offset

## Anti-Patterns

- Do NOT add glassmorphism, gradient text, or neon-on-dark as the "fix" for AI slop — that's different AI slop
- Do NOT install heavyweight font families — pick 1 display + 1 body, variable weight preferred
- Do NOT over-engineer dark mode — `prefers-color-scheme` + Tailwind `dark:` is sufficient for Phase 2; a toggle can come later
- Do NOT add animations just because the audit mentioned motion — Phase 1-2 have no motion requirements
- Do NOT change the component architecture — it's clean; the problems are in styling and content, not structure
- Do NOT add a CSS framework or component library — Tailwind is the design system layer

## Key Considerations

- The site is Astro SSG deployed to GitHub Pages — all markup is static HTML at build time
- Tailwind v4 is in use (not v3) — `@import "tailwindcss"` syntax, `@theme` for customization, OKLCH color functions
- The checkbox hamburger pattern works but can't express `aria-expanded` without JS — minimal script needed
- `prose` class is a silent failure (no error, just missing styles) — must decide: install typography plugin or remove classes
- Phase 3 (design identity) requires user input on aesthetic direction before execution — run `/i-teach-impeccable` first
