import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// 1. Read BASE_PATH (default to /dossier/ for GitHub Pages deployment)
const basePath = process.env.BASE_PATH || '/humberto-bello/';

// 2. Scaffold output directories
const dirs = ['dist', 'dist/fonts', 'dist/images'];
for (const d of dirs) {
  if (!existsSync(d)) mkdirSync(d, { recursive: true });
}

// 3. Marker replacement: <!--#include path/to/partial.html-->
function assemble(templatePath) {
  let html = readFileSync(templatePath, 'utf-8');
  html = html.replace(/<!--#include\s+(.+?)-->/g, (_, path) =>
    readFileSync(path.trim(), 'utf-8')
  );
  return html;
}

// 4. Read CSS files and build style blocks
const cssFiles = [
  { id: 'wk-tokens', path: 'src/styles/wolknitive-tokens.css' },
  { id: 'wk-base', path: 'src/styles/wolknitive-base.css' },
  { id: 'wk-animations', path: 'src/styles/wolknitive-animations.css' },
];
const styleBlocks = cssFiles.map(f => {
  const css = readFileSync(f.path, 'utf-8');
  return `<style id="${f.id}">\n${css}\n</style>`;
});

// 5. Rewrite asset paths with BASE_PATH prefix
function rewritePaths(html) {
  if (!basePath) return html;

  // Rewrite href and src attributes for fonts, images, and other assets
  html = html.replace(/(href|src)=["']\/fonts\//g, `$1="${basePath}fonts/`);
  html = html.replace(/(href|src)=["']\/images\//g, `$1="${basePath}images/`);
  html = html.replace(/(href|src)=["']\/favicon\.svg/g, `$1="${basePath}favicon.svg`);
  html = html.replace(/(href|src)=["']\/Humberto_Bello_Resume\.pdf/g, `$1="${basePath}Humberto_Bello_Resume.pdf`);
  html = html.replace(/(href|src)=["']\/(?!dossier)/g, `$1="${basePath}`);

  // Rewrite srcset attributes — replace all /images/ paths in srcset values
  html = html.replace(/srcset=["']([^"']+)["']/g, (_match, srcset) => {
    const rewritten = srcset.replace(/\/images\//g, `${basePath}images/`);
    return `srcset="${rewritten}"`;
  });

  // Rewrite CSS url() paths in inline <style> blocks
  html = html.replace(/url\(["']\/fonts\//g, `url('${basePath}fonts/`);
  html = html.replace(/url\(["']\/images\//g, `url('${basePath}images/`);

  return html;
}

// 6. Inject CSS into style placeholders
function injectStyles(html) {
  for (let i = 0; i < cssFiles.length; i++) {
    const { id } = cssFiles[i];
    const re = new RegExp(
      `<style id="${id}">\\s*/\\* injected by build script \\*/\\s*</style>`
    );
    html = html.replace(re, styleBlocks[i]);
  }
  return html;
}

// Validate all asset paths in output HTML use /dossier/ prefix or are relative
function validatePaths(html) {
  const issues = [];

  // Check src and href attributes
  const srcMatches = html.matchAll(/(?:src|href)=["']([^"']+)["']/g);
  for (const [, path] of srcMatches) {
    // Skip inline data: URIs, http/https URLs, anchors, and data: URIs
    if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://') || path.startsWith('#')) continue;
    // Skip non-asset paths (mailto:, tel:, javascript:)
    if (/^(mailto:|tel:|javascript:)/.test(path)) continue;
    // Must start with /dossier/ or be a relative path (no leading /)
    if (path.startsWith('/') && !path.startsWith('/dossier/')) {
      issues.push(`Absolute path without /dossier/ prefix: ${path}`);
    }
  }

  // Check srcset attributes
  const srcsetMatches = html.matchAll(/srcset=["']([^"']+)["']/g);
  for (const [, srcset] of srcsetMatches) {
    const entries = srcset.split(',').map(s => s.trim().split(/\s+/)[0]);
    for (const entry of entries) {
      if (entry.startsWith('/') && !entry.startsWith('/dossier/')) {
        issues.push(`Srcset path without /dossier/ prefix: ${entry}`);
      }
    }
  }

  // Check CSS url() in inline styles (not in external CSS files — those are already inlined)
  const urlMatches = html.matchAll(/url\(["']?([^"')]+)["']?\)/g);
  for (const [, path] of urlMatches) {
    if (path.startsWith('/') && !path.startsWith('/dossier/')) {
      issues.push(`CSS url() path without /dossier/ prefix: ${path}`);
    }
  }

  return issues;
}

// Load locale files for build-time content replacement
const locales = ['en', 'es', 'de'];
const localeData = {};
for (const loc of locales) {
  localeData[loc] = JSON.parse(readFileSync(`src/i18n/locales/${loc}.json`, 'utf-8'));
}

// Resolve a dot-notation key (with optional array indexing) from locale data
function resolveKey(data, key) {
  const parts = key.split('.');
  let value = data;
  for (const part of parts) {
    const arrMatch = part.match(/^(\w+)\[(\d+)\]$/);
    if (arrMatch) {
      value = value[arrMatch[1]];
      if (value) value = value[parseInt(arrMatch[2])];
    } else {
      value = value ? value[part] : undefined;
    }
  }
  return value;
}

// Replace data-i18n attributes with locale text content
function replaceI18n(html, data, prefix = '') {
  // Step 1: Handle <meta> tags — replace content attribute value using data-i18n key
  // First pass: content before data-i18n
  html = html.replace(
    /(<meta[^>]*?)\s+content="([^"]*)"[^>]*?data-i18n="([^"]+)"[^>]*?(\/>)/g,
    (_, pre, _oldContent, key, close) => {
      const value = resolveKey(data, key);
      if (typeof value === 'string') {
        return `${pre} content="${value}"${close}`;
      }
      return `${pre} content="${_oldContent}"${close}`;
    }
  );
  // Second pass: data-i18n before content
  html = html.replace(
    /(<meta[^>]*?)data-i18n="([^"]+)"[^>]*?content="([^"]*)"[^>]*?(\/>)/g,
    (_, pre, key, _oldContent, close) => {
      const value = resolveKey(data, key);
      if (typeof value === 'string') {
        return `${pre} content="${value}"${close}`;
      }
      return `${pre} content="${_oldContent}"${close}`;
    }
  );

  // Step 2: Handle <title> and other text elements — replace data-i18n attribute AND original text content
  html = html.replace(
    /(<[^>]*data-i18n="([^"]+)"[^>]*>)([^<]*)(<\/[^>]+>)/g,
    (_, openTag, key, _originalText, closeTag) => {
      const value = resolveKey(data, key);
      if (typeof value === 'string') return `${openTag}${value}${closeTag}`;
      return `${openTag}${_originalText}${closeTag}`;
    }
  );

  return html;
}

// Set <html lang> attribute per locale
function setHtmlLang(html, lang) {
  return html.replace(/<html lang="[^"]*">/, `<html lang="${lang}">`);
}

// Set active locale on language switcher links
function setActiveLocale(html, locale) {
  // Remove data-active from all language switcher links
  html = html.replace(/(<a href="\/dossier\/[^"]*" class="wk-nav-link")( data-active="true")?/g, '$1');
  // Set data-active on the correct locale link
  const localePath = locale === 'en' ? '/dossier/' : `/dossier/${locale}/`;
  html = html.replace(
    new RegExp(`(href="${localePath}" class="wk-nav-link")`),
    '$1 data-active="true"'
  );
  return html;
}

// 7. Build per-locale HTML files and 404.html
try {
  for (const locale of locales) {
    const isDefault = locale === 'en';
    let html = assemble('src/html/index.html');

    // Replace data-i18n attributes with locale content
    html = replaceI18n(html, localeData[locale]);

    // Set <html lang> attribute
    html = setHtmlLang(html, locale);

    // Set active locale on language switcher
    html = setActiveLocale(html, locale);

    // Inject CSS
    html = injectStyles(html);

    // Rewrite asset paths with BASE_PATH
    html = rewritePaths(html);

    // Write output
    const outDir = isDefault ? 'dist' : `dist/${locale}`;
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
    writeFileSync(`${outDir}/index.html`, html, 'utf-8');
  }

  // Build 404.html (English only)
  let notFoundHtml = assemble('src/html/404.html');
  notFoundHtml = injectStyles(notFoundHtml);
  notFoundHtml = rewritePaths(notFoundHtml);
  writeFileSync('dist/404.html', notFoundHtml, 'utf-8');

  // Copy opengraph.jpg for social sharing
  if (existsSync('public/opengraph.jpg')) {
    cpSync('public/opengraph.jpg', 'dist/images/opengraph.jpg');
  }

  // 12. Generate sitemap.xml (per D-10, D-11, D-12)
  const baseUrl = 'https://humbertobellor.github.io/dossier';
  const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const sitemapLocales = [
    { code: 'en', path: '/' },
    { code: 'es', path: '/es/' },
    { code: 'de', path: '/de/' },
  ];

  const sitemapEntries = sitemapLocales.map(loc => {
    const hreflangLinks = sitemapLocales.map(hl =>
      `    <xhtml:link rel="alternate" hreflang="${hl.code}" href="${baseUrl}${hl.path}" />`
    ).join('\n');
    const xdefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/" />`;
    return `  <url>
    <loc>${baseUrl}${loc.path}</loc>
    <lastmod>${now}</lastmod>
${hreflangLinks}
${xdefault}
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries}
</urlset>`;

  writeFileSync('dist/sitemap.xml', sitemap, 'utf-8');
} catch (err) {
  console.error('✗ Build failed:', err.message);
  process.exit(1);
}

// 8. Copy font files
const FONTS_SRC = 'public/fonts';
if (existsSync(FONTS_SRC)) {
  const fontFiles = ['Bogart-Italic-trial.woff2', 'Bogart-Medium-Italic-trial.woff2', 'Bogart-Medium-trial.woff2', 'Bogart-Regular-trial.woff2', 'Bogart-Semibold-trial.woff2', 'InterTight-400-latin.woff2', 'InterTight-500-latin.woff2', 'InterTight-600-latin.woff2', 'JetBrainsMono-400-latin.woff2', 'JetBrainsMono-500-latin.woff2', 'newsreader-latin-400-italic.woff2', 'newsreader-latin-400-normal.woff2'];
  for (const f of fontFiles) {
    const src = `${FONTS_SRC}/${f}`;
    try {
      if (existsSync(src)) cpSync(src, `dist/fonts/${f}`);
    } catch (err) {
      console.warn('⚠ Skipping font (not found):', f);
    }
  }
}

// 9. Copy headshot images
const IMG_SRC = resolve(import.meta.dirname, '../dossier-main/attached_assets');
const headshotFiles = ['headshot-corp_1776959044728.avif', 'headshot-corp_1776959044728.webp', 'headshot-corp_1776959044728@1x.avif', 'headshot-corp_1776959044728@1x.webp'];
for (const f of headshotFiles) {
  const src = `${IMG_SRC}/${f}`;
  try {
    if (existsSync(src)) cpSync(src, `dist/images/${f}`);
  } catch (err) {
    console.warn('⚠ Skipping headshot (not found):', f);
  }
}

// 13. Log completion
console.log('✓ Build complete: dist/index.html, dist/es/index.html, dist/de/index.html, dist/404.html');
console.log('✓ Assets: fonts/, images/');
console.log('✓ Sitemap: dist/sitemap.xml');

// --- Deploy configuration ---
// 14. Create .nojekyll file (INF-02)
writeFileSync('dist/.nojekyll', '', 'utf-8');
console.log('✓ Created dist/.nojekyll');

// 15. Validate all asset paths in built HTML
const validationErrors = [];
for (const locale of locales) {
  const htmlPath = locale === 'en' ? 'dist/index.html' : `dist/${locale}/index.html`;
  if (existsSync(htmlPath)) {
    const html = readFileSync(htmlPath, 'utf-8');
    const errors = validatePaths(html);
    for (const err of errors) {
      validationErrors.push(`[${locale}] ${err}`);
    }
  }
}
// Also validate 404.html
if (existsSync('dist/404.html')) {
  const html404 = readFileSync('dist/404.html', 'utf-8');
  const errors = validatePaths(html404);
  for (const err of errors) {
    validationErrors.push(`[404] ${err}`);
  }
}

if (validationErrors.length > 0) {
  console.error(`✗ Path validation failed — ${validationErrors.length} issue(s):`);
  for (const err of validationErrors) {
    console.error(`  ${err}`);
  }
  process.exit(1);
} else {
  const totalPaths = locales.length + 1; // en + es + de + 404
  console.log(`✓ Path validation passed — ${totalPaths} HTML files scanned`);
}

// 16. Copy dist/ to docs/ for GitHub Pages (D-01, D-02)
cpSync('dist', 'docs', { recursive: true });
console.log('✓ Copied dist/ to docs/ for GitHub Pages deployment');
