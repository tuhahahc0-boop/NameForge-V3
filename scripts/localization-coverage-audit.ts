import { GENERATORS_METADATA } from '../src/data/generators.ts';
import { getGeneratorDescriptionCoverage } from '../src/i18n/generatorContent.ts';
import { LOCALIZED_GENERATOR_TITLE_IDS } from '../src/i18n/generatorTitles.ts';
import { hasLocalizedEditorialMeta } from '../src/i18n/localizedGeneratorMeta.ts';

const locales = [
  'en', 'fr', 'es', 'de', 'it', 'pt', 'ar', 'tr', 'ja', 'ko',
  'zh', 'ru', 'hi', 'nl', 'pl', 'sv', 'vi', 'id', 'th', 'el',
  'he', 'cs', 'ro', 'da', 'fi',
];

const editorialFields = [
  'badge', 'generatorTitle', 'generatorSubtitle', 'guideTitle', 'guide',
  'cardsTitle', 'cards', 'advantages', 'limits', 'faqTitle', 'faq', 'footer',
];

const generators = Object.values(GENERATORS_METADATA);
const findings = [];
const categoryFallbackDescriptions = [];

for (const generator of generators) {
  for (const locale of locales) {
    if (locale === 'fr') continue;
    if (!LOCALIZED_GENERATOR_TITLE_IDS.includes(generator.id as never)) {
      findings.push({ generator: generator.id, locale, field: 'title', reason: 'no explicit localized title' });
    }
    const descriptionCoverage = getGeneratorDescriptionCoverage(generator, locale);
    if (descriptionCoverage === 'source-fallback') {
      findings.push({ generator: generator.id, locale, field: 'description', reason: 'falls back to the source description' });
    } else if (descriptionCoverage === 'category-fallback') {
      categoryFallbackDescriptions.push({ generator: generator.id, locale, field: 'description', reason: 'translated category-level description; generator-specific copy is not yet available' });
    }
    if (hasLocalizedEditorialMeta(generator.id, locale)) continue;
    for (const field of editorialFields) {
      const value = generator[field];
      if (value == null || (Array.isArray(value) && value.length === 0)) continue;
      findings.push({ generator: generator.id, locale, field, reason: 'no locale-specific editorial content resolver exists' });
    }
  }
}

const summary = {
  localeCount: locales.length,
  generatorCount: generators.length,
  checkedNonFrenchLocales: locales.length - 1,
  missingOrUnverifiedItems: findings.length,
  categoryFallbackDescriptionCount: categoryFallbackDescriptions.length,
  fields: [...new Set(findings.map((item) => item.field))],
};
if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ summary, findings, categoryFallbackDescriptions }, null, 2));
  process.exit(0);
}

console.log('NameForge 25-locale visible-content audit');
console.log(JSON.stringify(summary, null, 2));
console.log(`Translated category-level description fallbacks: ${categoryFallbackDescriptions.length}`);
console.log('\nFirst 100 findings (full list can be saved by redirecting stdout):');
for (const item of findings.slice(0, 100)) {
  console.log(`- [${item.locale}] ${item.generator} / ${item.field}: ${item.reason}`);
}
if (findings.length > 100) console.log(`... ${findings.length - 100} additional findings omitted from this console preview.`);
