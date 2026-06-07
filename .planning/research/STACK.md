# Technology Stack

**Project:** Static portfolio refactor (Humberto Bello dossier)
**Researched:** 2026-06-07

## Recommended Stack

### Build
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Node.js | 22+ (current LTS) | Build script runtime | Already installed, zero new dependencies |
| Node built-ins (`fs`, `path`, `url`) | — | File I/O, path resolution, HTML assembly | No npm packages needed; the build script is simple enough that Node built-ins suffice |
| `gh-pages` npm package | 6.x | Deploy to GitHub Pages | Simplest CLI for pushing dist/ to gh-pages branch; alternatives exist (GitHub Actions) |

### Runtime (Browser)
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| HTML5 | — | Semantic markup | Universal, no dependencies |
| CSS3 (custom properties) | — | Design system, layout, animations | Already 90% authored, just needs extraction from inline styles |
| Vanilla JS (modern) | ES2020+ | IntersectionObserver for scroll animations, language switcher | ~20 lines total; no framework needed for a single-page portfolio |

### Infrastructure
| Technology | Purpose | Why |
|------------|---------|-----|
| GitHub Pages | Static file hosting | Free, zero-config for static sites, supports custom 404.html |
| `gh-pages` branch | Deploy target | Keeps source and output separated; main branch contains source |

## What's Being Removed

| Technology | Current Role | Replacement |
|------------|-------------|-------------|
| React 19 | Component rendering | HTML partials assembled by build script |
| Vite 6 | Bundler, dev server, HMR | Node build script (no dev server needed) |
| TypeScript | Type safety | Source is HTML + CSS + JS; no type system needed |
| i18next + react-i18next + LanguageDetector | Runtime i18n | Build-time per-locale HTML generation |
| framer-motion | Scroll animations | CSS transitions + IntersectionObserver |
| Express 5 | Production server | Removed entirely (static host) |
| Tailwind CSS v4 | Utility classes | Semantic CSS classes with media queries |
| shadcn/ui + Radix primitives | UI components (55 files) | Removed entirely (zero used in page content) |
| `@workspace/api-client-react` | GitHub Releases API | Removed (Changelog deleted) |
| `@tanstack/react-query` | Server state | Removed (no API calls remain) |
| Beasties | Critical CSS inlining | All CSS inlined in `<style>` block already |
| lucide-react | Icons (22 imports) | Inline SVGs (reduced to ~6 icon paths) |
| `tw-animate-css` | Animation utilities | Removed (never used in page content) |
| `clsx` + `tailwind-merge` + `class-variance-authority` | CSS class merging | Removed entirely |

## Why Not (Ecosystem Alternatives)

### Why not Hugo / 11ty / Astro / Jekyll?
The site has 3 pages (one per locale), 6 sections, and no blog/content pipeline. A full static site generator adds setup complexity, template language learning, and configuration overhead that outweighs benefit. The build script is ~100 lines of JS, simpler than configuring any SSG.

### Why not keep React + Vite?
Severe overkill. React renders a page that never updates. Vite creates a complex build pipeline (6 custom plugins) for what amounts to assembling 6 section templates. The build output is a single HTML file with inlined CSS — Vite's code splitting, HMR, and plugin system provide zero value at runtime.

### Why not a Jamstack approach (Next.js static export)?
Next.js static export would work but introduces Node.js server dependencies at build time, a complex build pipeline, and framework-specific routing. The site has no dynamic content, no API calls, no images to optimize — none of Next.js's features are needed.

## Installation

```bash
# No new dependencies needed. The build uses Node built-ins only.

# For deploy:
npm install -D gh-pages
```

## npm Scripts

```json
{
  "scripts": {
    "build": "node src/build.mjs",
    "deploy": "npm run build && npx gh-pages -d dist -b gh-pages",
    "typecheck": "node src/build.mjs && echo 'Build OK'" 
  }
}
```

## Package.json Dependencies

After the refactor, `package.json` has no `dependencies` and minimal `devDependencies`:

```json
{
  "name": "@workspace/humberto-bello",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "node src/build.mjs",
    "deploy": "npm run build && npx gh-pages -d dist -b gh-pages"
  },
  "devDependencies": {
    "gh-pages": "^6.0.0"
  }
}
```

Total dependencies: **1** (down from ~70 in `dependencies` + ~50 in `devDependencies`).

## Sources

- [GitHub Pages documentation](https://docs.github.com/en/pages) — static file serving, custom 404
- [Node.js built-in modules](https://nodejs.org/api/) — fs, path, url used for build script
- [gh-pages npm package](https://www.npmjs.com/package/gh-pages) — deploy to GitHub Pages from CLI
