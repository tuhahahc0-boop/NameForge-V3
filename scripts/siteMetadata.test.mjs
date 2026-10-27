import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const sitemap = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

assert.ok(sitemap.includes('<urlset'), 'sitemap must contain a urlset root');
assert.ok(sitemap.includes('</urlset>'), 'sitemap must close its urlset root');
assert.deepEqual(
  locations,
  ['https://jjspa4830-hue.github.io/nameforge-V2/'],
  'source fallback sitemap should include the homepage before build-time expansion'
);
assert.ok(
  locations.every((url) => !url.includes('#')),
  'sitemap entries must not use URL fragments as crawlable pages'
);
assert.ok(
  !sitemap.includes('rayanellg.github.io/nameforge'),
  'published sitemap must not point to the previous deployment'
);

console.log('Site metadata checks passed: sitemap URL and crawlable entries are valid.');

const seoMetadata = readFileSync(new URL('../src/i18n/seoMetadata.ts', import.meta.url), 'utf8');
const appSource = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const localizedSeoLanguages = [...seoMetadata.matchAll(/^  ([a-z]{2}): \{ home:/gm)].map((match) => match[1]);
assert.equal(localizedSeoLanguages.length, 25, 'SEO descriptions should cover all 25 supported languages');
assert.deepEqual(
  localizedSeoLanguages,
  ['en', 'fr', 'es', 'de', 'it', 'pt', 'ar', 'tr', 'ja', 'ko', 'zh', 'ru', 'hi', 'nl', 'pl', 'sv', 'vi', 'id', 'th', 'el', 'he', 'cs', 'ro', 'da', 'fi'],
  'SEO language coverage should match the supported 25-language list'
);
assert.ok(appSource.includes("setMetaContent('meta[name=\"description\"]', description)"), 'active page should update its description');
assert.ok(appSource.includes("setMetaContent('meta[property=\"og:title\"]', title)"), 'active page should update Open Graph title');
assert.ok(appSource.includes("setMetaContent('meta[name=\"twitter:description\"]', description)"), 'active page should update Twitter description');
assert.ok(seoMetadata.includes("const FALLBACK = COPY.en"), 'unknown languages should safely fall back to English');
const packageJson = readFileSync(new URL('../package.json', import.meta.url), 'utf8');
assert.ok(packageJson.includes('npx tsx scripts/generate-seo-pages.ts'), 'both production build scripts should generate static SEO pages');

console.log('Dynamic SEO metadata checks passed: 25 locales and social metadata updates are covered.');
