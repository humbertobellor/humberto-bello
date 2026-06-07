import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// 1. Read BASE_PATH
const basePath = process.env.BASE_PATH || '';

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
  html = html.replace(/(href|src)=["']\/fonts\//g, `$1="${basePath}fonts/`);
  html = html.replace(/(src|srcset)=["']\/images\//g, `$1="${basePath}images/`);
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

// Load locale files for build-time content replacement
const locales = ['en', 'es', 'de'];
const localeData = {};
for (const loc of locales) {
  localeData[loc] = JSON.parse(readFileSync(`src/i18n/locales/${loc}.json`, 'utf-8'));
}

// Replace data-i18n attributes with locale text content
function replaceI18n(html, data, prefix = '') {
  return html.replace(/data-i18n="([^"]+)"/g, (_, key) => {
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
    if (typeof value === 'string') {
      return `>${value}<`;
    }
    return `>${key}<`;
  });
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

// 12. Log completion
console.log('✓ Build complete: dist/index.html, dist/es/index.html, dist/de/index.html, dist/404.html');
console.log('✓ Assets: fonts/, images/');
