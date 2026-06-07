import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// 1. Read BASE_PATH
const basePath = process.env.BASE_PATH || '';

// 2. Scaffold output directories
const dirs = ['dist', 'dist/locales', 'dist/fonts', 'dist/images'];
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

// 7. Build index.html and 404.html
try {
  let indexHtml = assemble('src/html/index.html');
  indexHtml = injectStyles(indexHtml);
  indexHtml = rewritePaths(indexHtml);
  writeFileSync('dist/index.html', indexHtml, 'utf-8');

  let notFoundHtml = assemble('src/html/404.html');
  notFoundHtml = injectStyles(notFoundHtml);
  notFoundHtml = rewritePaths(notFoundHtml);
  writeFileSync('dist/404.html', notFoundHtml, 'utf-8');
} catch (err) {
  console.error('✗ Build failed:', err.message);
  process.exit(1);
}

// 10. Copy i18next vendor JS
const vendorScripts = [
  ['node_modules/i18next/dist/umd/i18next.min.js', 'dist/locales/i18next.min.js'],
  ['node_modules/i18next-browser-languagedetector/dist/umd/i18nextBrowserLanguageDetector.min.js', 'dist/locales/i18nextBrowserLanguageDetector.min.js'],
];
for (const [src, dest] of vendorScripts) {
  try {
    if (existsSync(src)) cpSync(src, dest);
  } catch (err) {
    console.warn('⚠ Skipping vendor script (not found):', src.split('/').pop());
  }
}

// 11. Copy locale JSON files
for (const locale of ['en', 'es', 'de']) {
  const src = `src/i18n/locales/${locale}.json`;
  try {
    if (existsSync(src)) cpSync(src, `dist/locales/${locale}.json`);
  } catch (err) {
    console.warn('⚠ Skipping locale file (not found):', locale + '.json');
  }
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
console.log('✓ Build complete: dist/index.html, dist/404.html');
console.log('✓ Assets: locales/, fonts/, images/');
