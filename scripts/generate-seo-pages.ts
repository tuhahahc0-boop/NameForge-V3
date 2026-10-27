import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_GENERATORS_LIST } from '../src/data/generators';
import { getLocalizedGeneratorTitle } from '../src/i18n/generatorTitles';
import { getSeoDescription } from '../src/i18n/seoMetadata';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, '..', 'dist');
const SITE_URL = 'https://jjspa4830-hue.github.io/nameforge-V2';
const APP_URL = `${SITE_URL}/`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeXml(value: string): string {
  return escapeHtml(value);
}

function renderPage(generator: (typeof ALL_GENERATORS_LIST)[number]): string {
  const id = encodeURIComponent(generator.id);
  const title = getLocalizedGeneratorTitle(generator.id, 'en', generator.title);
  const pageTitle = `${title} | NameForge`;
  const description = getSeoDescription('generator-detail', 'en', title);
  const pageUrl = `${SITE_URL}/seo/generators/${id}/`;
  const appUrl = `${APP_URL}#/generator/${id}`;
  const category = ({
    fantasy: 'Fantasy & imagination',
    business: 'Business & branding',
    creative: 'Creative projects',
    innovation: 'Technology & innovation',
  } as Record<string, string>)[generator.category] || 'Creative tools';

  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageTitle,
    description,
    url: pageUrl,
    isPartOf: { '@type': 'WebSite', name: 'NameForge', url: APP_URL },
    mainEntity: {
      '@type': 'SoftwareApplication',
      name: title,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      isAccessibleForFree: true,
      url: appUrl,
    },
  });

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${escapeHtml(pageUrl)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="NameForge">
  <meta property="og:url" content="${escapeHtml(pageUrl)}">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:locale" content="en_US">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <script type="application/ld+json">${structuredData}</script>
  <style>
    :root { color-scheme: dark; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #080817; color: #f8fafc; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; box-sizing: border-box; }
    main { width: min(100%, 760px); padding: clamp(24px, 5vw, 48px); border: 1px solid #29334d; border-radius: 24px; background: linear-gradient(145deg, #13172c, #0b1020); box-sizing: border-box; }
    .brand { color: #67e8f9; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; font-size: .8rem; }
    .category { color: #c4b5fd; font-size: .9rem; }
    h1 { font-size: clamp(2rem, 5vw, 3.4rem); line-height: 1.12; margin: 16px 0; }
    p { color: #cbd5e1; line-height: 1.7; }
    a.button { display: inline-block; margin-top: 16px; padding: 13px 18px; border-radius: 12px; background: #7c3aed; color: white; text-decoration: none; font-weight: 700; }
    a.secondary { display: inline-block; margin: 18px 0 0 16px; color: #a5f3fc; }
    footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #29334d; color: #94a3b8; font-size: .85rem; }
  </style>
</head>
<body>
  <main>
    <div class="brand">NameForge</div>
    <div class="category">${escapeHtml(category)}</div>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(description)}</p>
    <p>Explore ideas, create distinctive names, and save your favorites with the free NameForge generator.</p>
    <a class="button" href="${escapeHtml(appUrl)}">Open the interactive generator</a>
    <a class="secondary" href="${escapeHtml(`${APP_URL}#/generators`)}">Browse all generators</a>
    <footer>Free creative tools from NameForge.</footer>
  </main>
</body>
</html>
`;
}

async function main(): Promise<void> {
  if (ALL_GENERATORS_LIST.length === 0) {
    throw new Error('No generator metadata found; refusing to publish an empty SEO sitemap.');
  }

  const sitemapUrls = [`${APP_URL}`];
  for (const generator of ALL_GENERATORS_LIST) {
    const id = encodeURIComponent(generator.id);
    const pageUrl = `${SITE_URL}/seo/generators/${id}/`;
    const outputPath = join(DIST, 'seo', 'generators', id, 'index.html');
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, renderPage(generator), 'utf8');
    sitemapUrls.push(pageUrl);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n')}
</urlset>
`;
  await writeFile(join(DIST, 'sitemap.xml'), sitemap, 'utf8');
  console.log(`Generated ${ALL_GENERATORS_LIST.length} static generator landing pages and a sitemap with ${sitemapUrls.length} URLs.`);
}

main().catch((error: unknown) => {
  console.error('Failed to generate static SEO pages:', error);
  process.exitCode = 1;
});
