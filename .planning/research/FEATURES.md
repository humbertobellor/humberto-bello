# Feature Landscape

**Domain:** Single-page static portfolio site
**Researched:** 2026-06-07

## Table Stakes

Features users expect from a professional portfolio. Missing = site feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Professional hero with name/title | Researcher/employer identifies candidate immediately | Low | Currently present; unchanged |
| Experience timeline/cards | Core portfolio content — shows career trajectory | Low | Currently present; unchanged |
| Skills showcase | Candidate must demonstrate relevant expertise | Low | Currently present; unchanged |
| Client/employer logos | Social proof — validates experience claims | Low | Currently present as name cards |
| CTA/contact method | Visitor needs way to reach candidate | Low | Email link preserved; form removed |
| Responsive design | 60%+ of traffic is mobile | Low | Preserved with CSS media queries |
| Multi-language support | International audience (es/de) | Medium | Strategy changes (runtime → build-time) |
| SEO meta tags | Google discoverability | Low | Preserved, enhanced with hreflang |
| Resume download link | Standard portfolio expectation | Low | Preserved |
| Fast load time | User retention < 3s | Low | Improved (no JS framework overhead) |

## Differentiators

Features that set this portfolio apart from a standard resume site.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Custom Wolknitive design system | Distinctive warm vellum/teal aesthetic — memorable, brand-building | Low | Design system stays; just moved from CSS tokens + inline styles to pure CSS |
| CSS-only hero animations | Smooth entrance without JS overhead | Low | Preserved (already CSS, in `index.css`) |
| AVIF/WebP responsive headshot with srcset | Modern image format, bandwidth optimization | Low | Preserved, moved from JSX to `<picture>` in HTML |
| Bogart display font with trial-font digit workaround | Unique typographic identity | Low | Preserved (`@font-face` rules unchanged) |
| 3-language full translation | Rare for personal portfolio — demonstrates global readiness | Medium | Improved by per-locale HTML (better SEO for each language) |
| Self-hosted all fonts | No external font CDN, no GDPR concerns, no network dependency | Low | Preserved |
| Scroll-triggered reveal animations | Below-fold sections animate on scroll, engaging UX | Low | framer-motion → CSS IntersectionObserver (same UX, lighter) |
| Sticky nav with IntersectionObserver section tracking | Easy navigation, professional feel | Low | Preserved with vanilla JS |
| JSON-LD structured data | Rich search results (ProfilePage schema) | Low | Preserved, per locale |

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Changelog / GitHub releases viewer | Requires runtime API fetch, dead on static host; only 523 lines but adds entire data-fetching stack (react-query, API client dep) | Remove entirely. Static site has no runtime data fetching. |
| Contact form | Requires server endpoint, SMTP, rate limiting; existing form was only UI (never connected) | Email link only (`mailto:humberto.bello@protonmail.com`) |
| Client-side i18n with runtime switching | Per-locale HTML is better for SEO, performance, and simplicity | Generate separate HTML per locale at build time |
| Night/dark mode toggle | Not in current spec; increases CSS complexity 2x for a design system built around warm vellum tones that don't invert cleanly | Single light theme — the Wolknitive design system is intentionally warm |
| Blog or content sections | Out of scope for a dossier site; adds content management complexity | Single-page portfolio only |
| Google Analytics / tracking pixels | No user data collection needed for a portfolio; privacy-first approach | Zero tracking |
| Service Worker / PWA | No offline functionality needed; SW adds complexity and cache headaches | Static files only |
| Changelog / site-updates notification | No dynamic content to announce | Static site; updates are redeployments |
| Cookie consent banner | No cookies set, no consent needed | Don't add one |
| Page load spinner / skeleton screens | Content is inlined in HTML — instant render | Zero-weight loading (no JS needed for first paint) |

## Feature Dependencies

```
CSS tokens (wolknitive-tokens.css) → All CSS (tokens are :root custom properties)
Build script (build.mjs) → All output (build script assembles everything)
Locale JSON files → Each locale's index.html (content source)
Partials/*.html → Final HTML assembly (partials are templates)
Headshot images → Hero section (images referenced in _hero.html)
```

## Key Behavioral Changes (from SPA to Static)

| Behavior | SPA | Static | Impact |
|----------|-----|--------|--------|
| Language switching | i18next.changeLanguage() swaps text client-side | Navigate to `/es/` or `/de/` (full page load) | ~100ms page load instead of instant swap; better for SEO |
| Section navigation | scrollIntoView with smooth behavior | Same (smooth scroll is pure CSS `scroll-behavior: smooth`) | Identical UX |
| "Site Updates" (Changelog) | Fetches GitHub Releases on button click | Removed | Gone entirely |
| Active nav tracking | IntersectionObserver in React useEffect | IntersectionObserver in vanilla JS | Identical UX |
| Scroll animations | framer-motion whileInView | CSS + IntersectionObserver | Same visual result, no JS library |
| Page load | React mount + i18n init + lazy frame-motion fetch | HTML render (instant) | Faster load |

## Sources

- Current codebase analysis (`.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/STRUCTURE.md`)
- PROJECT.md requirements (STATIC-01 through STATIC-12)
- [GitHub Pages static site limitations](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages) — no server-side processing, no custom headers
