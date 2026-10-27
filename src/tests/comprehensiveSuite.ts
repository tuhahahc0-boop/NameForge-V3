import { ALL_GENERATORS_LIST, GENERATORS_METADATA } from '../data/generators';
import { SUBCATEGORIES_DATA } from '../data/subcategories';
import { generateNames, isTooSimilar, calculateLevenshteinDistance, scoreCandidate } from '../services/generatorEngine';
import { generateSvgCode, splitGraphemes } from '../services/textStyler';
import { ATTESTED_BABY_NAMES } from '../data/attestedBabyNames';
import { normalizeSearchText } from '../services/search';
import { getLocalizedGeneratorDescription, hasLocalizedGeneratorDescription, LOCALIZED_GENERATOR_DESCRIPTION_LANGUAGES } from '../i18n/generatorContent';
import { getLocalizedFaq } from '../i18n/localizedFaq';
import { LOCALIZED_GENERATOR_DESCRIPTION_IDS } from '../i18n/generatorContent';
import { getShellLabels } from '../i18n/shell';
import { getLocalizedStyleLabel } from '../i18n/styleLabels';
import { getMyNamesAuditLabels } from '../i18n/myNames';
import { getLocalizedGeneratorTitle, getLocalizedGeneratorShortTitle, LOCALIZED_GENERATOR_TITLE_IDS } from '../i18n/generatorTitles';
import { getLanguageModalLabels } from '../i18n/languageModal';
import { getNameDetailsLabels } from '../i18n/nameDetails';
import { getCollectionModalLabels } from '../i18n/collectionModal';
import { getCompareModalLabels } from '../i18n/compareModal';
import { FULL_TRANSLATION_LANGUAGES, getTranslations, isLanguageFullyTranslated } from '../i18n';
import { normalizeAppSettings, SUPPORTED_LANGUAGES } from '../services/settings';
import { normalizeHistoryEntry, normalizeRating, remapImportedCollectionId } from '../services/storage';

declare const process: { exit: (code: number) => void };

interface TestResult {
  num: number;
  description: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];
let testCounter = 1;

function assert(condition: boolean, description: string, details?: string) {
  const currentNum = testCounter++;
  if (condition) {
    results.push({ num: currentNum, description, passed: true });
    console.log(`  ✓ Test ${currentNum}: ${description}`);
  } else {
    results.push({ num: currentNum, description, passed: false, error: details || 'Assertion failed' });
    console.error(`  ✗ Test ${currentNum} FAILED: ${description} - ${details || ''}`);
  }
}

// Persisted settings and imported ratings must be normalized before they reach the UI.
const normalizedInvalidSettings = normalizeAppSettings({
  language: 'not-a-language',
  theme: 'ultraviolet',
  textSize: 'tiny',
  reduceMotion: 'yes',
  defaultGenLanguage: 'unknown',
});
assert(
  normalizedInvalidSettings.language === 'en' &&
  normalizedInvalidSettings.theme === 'dark' &&
  normalizedInvalidSettings.textSize === 'normal' &&
  normalizedInvalidSettings.reduceMotion === false &&
  normalizedInvalidSettings.defaultGenLanguage === 'auto',
  'Invalid persisted settings fall back to safe defaults'
);
const normalizedValidSettings = normalizeAppSettings({
  language: 'ar',
  theme: 'system',
  textSize: 'large',
  reduceMotion: true,
  defaultGenLanguage: 'tech',
});
assert(
  normalizedValidSettings.language === 'ar' &&
  normalizedValidSettings.theme === 'system' &&
  normalizedValidSettings.textSize === 'large' &&
  normalizedValidSettings.reduceMotion === true &&
  normalizedValidSettings.defaultGenLanguage === 'tech',
  'Valid persisted settings are preserved'
);
assert(normalizeAppSettings(null).language === 'en', 'Missing settings payload safely falls back to defaults');
assert(normalizeRating(1) === 1, 'One-star rating is accepted');
assert(normalizeRating(5) === 5, 'Five-star rating is accepted');
assert(normalizeRating('4') === 4, 'Numeric rating strings are normalized');
assert(normalizeRating(0) === 0, 'Zero rating is treated as no rating');
assert(normalizeRating(6) === 0, 'Out-of-range ratings are rejected');
assert(normalizeRating(Number.NaN) === 0, 'NaN ratings are rejected');
assert(normalizeRating('not-a-rating') === 0, 'Non-numeric ratings are rejected');

// Imported history records must be normalized and malformed records ignored;
assert(normalizeHistoryEntry({ name: '  Aria  ', generator: 'fantasy' })?.name === 'Aria', 'Imported history trims names and accepts valid records');
assert(normalizeHistoryEntry({ name: '', generator: 'fantasy' }) === null, 'Imported history rejects empty names');
assert(normalizeHistoryEntry(null) === null, 'Imported history rejects null records');
assert(normalizeHistoryEntry({ name: 'Aria', generator: '' }) === null, 'Imported history rejects missing generator IDs');
const invalidHistoryDate = normalizeHistoryEntry({ name: 'Luna', generator: 'fantasy', generatedAt: 'not-a-date' });
assert(Boolean(invalidHistoryDate && Number.isFinite(Date.parse(invalidHistoryDate.generatedAt))), 'Imported history replaces invalid timestamps with a valid date');
assert(normalizeHistoryEntry({ name: 'Luna', generator: 'fantasy', generatedAt: '2025-01-02T03:04:05Z' })?.generatedAt === '2025-01-02T03:04:05.000Z', 'Imported history normalizes valid timestamps to ISO format');
const importedCollectionIds = new Map([['shared-id', 'restored-collection-id']]);
const declaredCollectionIds = new Set(['shared-id', 'missing-imported-id']);
assert(remapImportedCollectionId('shared-id', importedCollectionIds, declaredCollectionIds) === 'restored-collection-id', 'Imported names are remapped to the restored collection when IDs collide');
assert(remapImportedCollectionId('missing-imported-id', new Map(), declaredCollectionIds) === undefined, 'Names do not attach to a local collection when an imported collection cannot be restored');
assert(remapImportedCollectionId('local-only-id', importedCollectionIds, declaredCollectionIds) === 'local-only-id', 'Collection references remain unchanged when the backup does not define that collection');


// Global shell localization regression checks (25 priority locales).
const PRIORITY_LOCALES = [
  'en', 'fr', 'es', 'de', 'it', 'pt', 'ar', 'tr', 'ja', 'ko',
  'zh', 'ru', 'hi', 'nl', 'pl', 'sv', 'vi', 'id', 'th', 'el',
  'he', 'cs', 'ro', 'da', 'fi',
] as const;
assert(
  FULL_TRANSLATION_LANGUAGES.length === PRIORITY_LOCALES.length &&
    PRIORITY_LOCALES.every((locale) => FULL_TRANSLATION_LANGUAGES.includes(locale)) &&
    PRIORITY_LOCALES.every((locale) => isLanguageFullyTranslated(locale)),
  'The 25 priority locales are all registered as fully translated',
  `Expected ${PRIORITY_LOCALES.length} fully translated locales; found ${FULL_TRANSLATION_LANGUAGES.length}`
);
for (const locale of PRIORITY_LOCALES) {
  const labels = getShellLabels(locale);
  assert(
    Boolean(labels.skipToMain.trim() && labels.loading.trim() && labels.mainNavigation.trim() && labels.randomGeneratorTitle.trim() && labels.surpriseMe.trim() && labels.changeLanguage.trim() && labels.changeLanguageTitle.trim()),
    `Shell accessibility and loading labels exist for ${locale}`
  );
  assert(
    Object.values(labels.pageTitles).every((value) => value.trim().length > 0),
    `All page-title labels exist for ${locale}`
  );
  assert(
    Object.values(labels.families).every((value) => value.trim().length > 0),
    `All generator-family labels exist for ${locale}`
  );
  if (locale !== 'fr') {
    const frenchFamilyLabels = getShellLabels('fr').families;
    assert(
      (Object.keys(frenchFamilyLabels) as Array<keyof typeof frenchFamilyLabels>).every(
        (key) => labels.families[key] !== frenchFamilyLabels[key]
      ),
      `Generator-family labels are localized instead of staying French for ${locale}`
    );
  }
  if (locale !== 'en') {
    assert(
      labels.skipToMain !== 'Skip to main content' && labels.loading !== 'Loading NameForge…' && labels.surpriseMe !== '🎲 Surprise me!' && labels.changeLanguage !== 'Change language',
      `Shell labels do not silently fall back to English for ${locale}`
    );
  }
}

// My Names view-specific localization regression checks.
for (const locale of PRIORITY_LOCALES) {
  const labels = getMyNamesAuditLabels(locale);
  assert(
    Object.values(labels).every((value) => value.trim().length > 0),
    `My Names audit labels exist for ${locale}`
  );
  if (locale !== 'en') {
    assert(
      labels.trackedNames !== 'Tracked names' &&
      labels.resetFilters !== 'Reset filters' &&
      labels.notRated !== 'Not rated',
      `My Names labels avoid English-only fallback for ${locale}`
    );
    assert(
      labels.restore !== 'Restore' &&
      labels.compare !== 'Compare' &&
      labels.all !== 'All' &&
      labels.saved !== '🔖 Saved' &&
      labels.favorites !== '❤️ Favorites' &&
      labels.withNotes !== '📝 With notes',
      `My Names toolbar labels avoid English-only fallback for ${locale}`
    );
  }
}

// Primary interface actions must not silently fall back to English in priority locales.
const englishCoreUi = getTranslations('en');
const coreUiTranslationChecks = [
  { key: 'nav.home', get: (locale: typeof PRIORITY_LOCALES[number]) => getTranslations(locale).nav.home, english: englishCoreUi.nav.home },
  { key: 'nav.generators', get: (locale: typeof PRIORITY_LOCALES[number]) => getTranslations(locale).nav.generators, english: englishCoreUi.nav.generators },
  { key: 'settingsModal.closeBtn', get: (locale: typeof PRIORITY_LOCALES[number]) => getTranslations(locale).settingsModal.closeBtn, english: englishCoreUi.settingsModal.closeBtn },
  { key: 'generatorControl.generateBtn', get: (locale: typeof PRIORITY_LOCALES[number]) => getTranslations(locale).generatorControl.generateBtn, english: englishCoreUi.generatorControl.generateBtn },
  { key: 'footer.rights', get: (locale: typeof PRIORITY_LOCALES[number]) => getTranslations(locale).footer.rights, english: englishCoreUi.footer.rights },
] as const;
for (const locale of PRIORITY_LOCALES) {
  for (const check of coreUiTranslationChecks) {
    const value = check.get(locale);
    assert(
      typeof value === 'string' && value.trim().length > 0,
      `Core UI translation ${check.key} exists for ${locale}`
    );
    if (locale !== 'en') {
      assert(
        value !== check.english,
        `Core UI translation ${check.key} does not silently fall back to English for ${locale}`,
        value
      );
    }
  }
}

// Core generator titles and short labels must be localized in all 25 priority locales.
for (const locale of PRIORITY_LOCALES) {
  const missingTitles = LOCALIZED_GENERATOR_TITLE_IDS.filter((id) => {
    const meta = GENERATORS_METADATA[id];
    return !getLocalizedGeneratorTitle(id, locale, meta.title).trim() ||
      getLocalizedGeneratorTitle(id, locale, meta.title) === meta.title ||
      !getLocalizedGeneratorShortTitle(id, locale, meta.shortTitle).trim();
  });
  assert(
    missingTitles.length === 0,
    `Core generator titles and short labels are localized for ${locale}`,
    missingTitles.join(', ') || `${LOCALIZED_GENERATOR_TITLE_IDS.length} generators checked`
  );
}

// Language selector modal must expose every translated label for all 25 priority locales.
for (const locale of PRIORITY_LOCALES) {
  const labels = getLanguageModalLabels(locale);
  assert(
    Object.values(labels).every((value) => typeof value === 'string' && value.trim().length > 0),
    `All language selector labels are non-empty for ${locale}`
  );
  assert(
    locale === 'fr' || labels.title !== 'Choisir la langue',
    `Language selector title is not left in French for ${locale}`
  );
  if (locale !== 'en') {
    assert(
      labels.close !== 'Close' &&
      labels.searchPlaceholder !== 'Search by language name (e.g. Français, English, 日本語, Arabic)…' &&
      labels.reset !== 'Reset search' &&
      labels.fullyTranslated !== '✨ Fully translated' &&
      labels.noResults !== 'No languages match' &&
      labels.completeStatus !== '✨ Full translation' &&
      labels.standardStatus !== 'Standard support • English fallback',
      `Language selector controls and status labels avoid English fallback for ${locale}`
    );
  }
}

// Name analysis modal labels must be available in all 25 priority locales.
for (const locale of PRIORITY_LOCALES) {
  const labels = getNameDetailsLabels(locale);
  assert(
    Boolean(labels.header.trim() && labels.listen.trim() && labels.archetype.trim() &&
      labels.phonetics.trim() && labels.rating.trim() && labels.length.trim() &&
      labels.whyFits.trim() && labels.attested.trim() && labels.invented.trim() &&
      labels.etymology.trim() && labels.variants.trim() && labels.transparency.trim() &&
      labels.strengths.trim() && labels.watchouts.trim() && labels.chooseTip.trim() &&
      labels.style.trim() && labels.copy.trim() && labels.copied.trim() && labels.close.trim() &&
      labels.save.trim() && labels.saved.trim() && labels.like.trim() && labels.liked.trim() && labels.adviceText.trim() && labels.fallbackStrength.trim() && labels.fallbackWatchout.trim()),
    `Name analysis modal labels exist for ${locale}`
  );
  assert(
    locale === 'fr' || labels.header !== 'Fiche d’analyse linguistique •',
    `Name analysis modal header is localized for ${locale}`
  );
}

// Collection modal controls must be translated in all 25 priority locales.
for (const locale of PRIORITY_LOCALES) {
  const labels = getCollectionModalLabels(locale);
  assert(
    Boolean(labels.titleNew.trim() && labels.titleEdit.trim() && labels.intro.trim() &&
      labels.nameLabel.trim() && labels.namePlaceholder.trim() && labels.descriptionLabel.trim() &&
      labels.descriptionPlaceholder.trim() && labels.colorLabel.trim() && labels.cancel.trim() &&
      labels.save.trim() && labels.saved.trim() && labels.close.trim()),
    `Collection modal labels exist for ${locale}`
  );
  assert(
    locale === 'fr' || labels.titleNew !== 'Nouvelle collection personnalisée',
    `Collection modal title is localized for ${locale}`
  );
}

// Comparison modal labels and fallback content must be localized in all 25 priority locales.
for (const locale of PRIORITY_LOCALES) {
  const labels = getCompareModalLabels(locale);
  assert(
    Boolean(labels.title.trim() && labels.subtitle.trim() && labels.addName.trim() &&
      labels.selectFavorite.trim() && labels.empty.trim() && labels.selectTwo.trim() &&
      labels.remove.trim() && labels.style.trim() && labels.rate.includes('{count}') &&
      labels.unrated.trim() && labels.chooseCopy.trim() && labels.fallbackTone.trim() &&
      labels.fallbackDescription.trim() && labels.fallbackBestFor.trim()),
    `Comparison modal labels exist for ${locale}`
  );
  assert(
    locale === 'fr' || labels.title !== 'Comparateur de noms (2–4)',
    `Comparison modal title is localized for ${locale}`
  );
}

// FAQ localization regression checks
// Full FAQ localization coverage: all 25 supported locales must keep every entry
// and must not silently fall back to the French or English source content.
const faqFrenchSource = getLocalizedFaq('fr');
const faqEnglishSource = getLocalizedFaq('en');
for (const locale of PRIORITY_LOCALES) {
  const localized = getLocalizedFaq(locale);
  assert(
    localized.length === faqFrenchSource.length,
    `FAQ preserves all entries for ${locale}`,
    `Found ${localized.length}`
  );
  assert(
    localized.every((item) => item.q.trim() && item.a.trim()),
    `Every FAQ question and answer is present for ${locale}`
  );
  if (locale !== 'fr') {
    const frenchFallbacks = localized.filter((item, index) =>
      item.q === faqFrenchSource[index]?.q || item.a === faqFrenchSource[index]?.a
    ).length;
    assert(
      frenchFallbacks === 0,
      `FAQ entries do not silently fall back to French for ${locale}`,
      `${frenchFallbacks} entries match French source text`
    );
  }
  if (locale !== 'fr' && locale !== 'en') {
    const englishFallbacks = localized.filter((item, index) =>
      item.q === faqEnglishSource[index]?.q || item.a === faqEnglishSource[index]?.a
    ).length;
    assert(
      englishFallbacks === 0,
      `FAQ entries do not silently fall back to English for ${locale}`,
      `${englishFallbacks} entries match English source text`
    );
  }
}

const faqEnglish = getLocalizedFaq('en');
assert(faqEnglish.length === 18, 'English FAQ preserves all 18 FAQ entries', `Found ${faqEnglish.length}`);
assert(faqEnglish.every((item) => item.q.trim() && item.a.trim()), 'Every English FAQ entry has a question and answer');
assert(faqEnglish[0].q.startsWith('How does a name generator'), 'English FAQ does not display the French source question');
assert(getLocalizedFaq('fr')[0].q === 'Comment fonctionne un générateur de noms comme NameForge ?', 'French FAQ source remains unchanged');
const faqSpanish = getLocalizedFaq('es');
assert(faqSpanish.length === 18, 'Spanish FAQ preserves all 18 FAQ entries', `Found ${faqSpanish.length}`);
assert(faqSpanish.every((item) => item.q.trim() && item.a.trim()), 'Every Spanish FAQ entry has a question and answer');
assert(faqSpanish[0].q.startsWith('¿Cómo funciona un generador'), 'Spanish FAQ does not display French or English source text');
assert(faqSpanish.every((item) => !item.q.startsWith('Comment ') && !item.a.startsWith('NameForge combine')), 'Spanish FAQ avoids French and English fallback entries');
const faqGerman = getLocalizedFaq('de');
assert(faqGerman.length === 18, 'German FAQ preserves all 18 FAQ entries', `Found ${faqGerman.length}`);
assert(faqGerman.every((item) => item.q.trim() && item.a.trim()), 'Every German FAQ entry has a question and answer');
assert(faqGerman[0].q.startsWith('Wie funktioniert'), 'German FAQ does not display French or English source text');
assert(faqGerman.every((item) => !item.q.startsWith('Comment ') && !item.q.startsWith('How does')), 'German FAQ avoids French and English fallback entries');

const faqItalian = getLocalizedFaq('it');
assert(faqItalian.length === 18, 'Italian FAQ preserves all 18 FAQ entries', `Found ${faqItalian.length}`);
assert(faqItalian.every((item) => item.q.trim() && item.a.trim()), 'Every Italian FAQ entry has a question and answer');
assert(faqItalian[0].q.startsWith('Come funziona'), 'Italian FAQ does not display French or English source text');
assert(faqItalian.every((item) => !item.q.startsWith('Comment ') && !item.q.startsWith('How does') && !item.q.startsWith('Wie funktioniert')), 'Italian FAQ avoids French, English, and German fallback entries');

const faqPortuguese = getLocalizedFaq('pt');
assert(faqPortuguese.length === 18, 'Portuguese FAQ preserves all 18 FAQ entries', `Found ${faqPortuguese.length}`);
assert(faqPortuguese.every((item) => item.q.trim() && item.a.trim()), 'Every Portuguese FAQ entry has a question and answer');
assert(faqPortuguese[0].q.startsWith('Como funciona'), 'Portuguese FAQ does not display French or English source text');
assert(faqPortuguese.every((item) => !item.q.startsWith('Comment ') && !item.q.startsWith('How does') && !item.q.startsWith('Wie funktioniert') && !item.q.startsWith('Come funziona')), 'Portuguese FAQ avoids French, English, German, and Italian fallback entries');

const faqDutch = getLocalizedFaq('nl');
assert(faqDutch.length === 18, 'Dutch FAQ preserves all 18 FAQ entries', `Found ${faqDutch.length}`);
assert(faqDutch.every((item) => item.q.trim() && item.a.trim()), 'Every Dutch FAQ entry has a question and answer');
assert(faqDutch[0].q.startsWith('Hoe werkt'), 'Dutch FAQ does not display French or English source text');
assert(faqDutch.every((item) => !item.q.startsWith('Comment ') && !item.q.startsWith('How does') && !item.q.startsWith('Wie funktioniert') && !item.q.startsWith('Come funziona') && !item.q.startsWith('Como funciona')), 'Dutch FAQ avoids French, English, German, Italian, and Portuguese fallback entries');

const faqTurkish = getLocalizedFaq('tr');
assert(faqTurkish.length === 18, 'Turkish FAQ preserves all 18 FAQ entries', `Found ${faqTurkish.length}`);
assert(faqTurkish.every((item) => item.q.trim() && item.a.trim()), 'Every Turkish FAQ entry has a question and answer');
assert(faqTurkish[0].q.startsWith('NameForge gibi'), 'Turkish FAQ does not display French or English source text');
assert(faqTurkish.every((item) => !item.q.startsWith('Comment ') && !item.q.startsWith('How does') && !item.q.startsWith('Wie funktioniert') && !item.q.startsWith('Come funziona') && !item.q.startsWith('Hoe werkt')), 'Turkish FAQ avoids known untranslated fallback entries');

const faqArabic = getLocalizedFaq('ar');
assert(faqArabic.length === 18, 'Arabic FAQ preserves all 18 FAQ entries', `Found ${faqArabic.length}`);
assert(faqArabic.every((item) => item.q.trim() && item.a.trim()), 'Every Arabic FAQ entry has a question and answer');
assert(faqArabic[0].q.startsWith('كيف يعمل'), 'Arabic FAQ does not display French or English source text');
assert(faqArabic.every((item) => !item.q.startsWith('Comment ') && !item.q.startsWith('How does') && !item.q.startsWith('NameForge gibi')), 'Arabic FAQ avoids known untranslated fallback entries');

const faqJapanese = getLocalizedFaq('ja');
assert(faqJapanese.length === 18, 'Japanese FAQ preserves all 18 FAQ entries', `Found ${faqJapanese.length}`);
assert(faqJapanese.every((item) => item.q.trim() && item.a.trim()), 'Every Japanese FAQ entry has a question and answer');
assert(faqJapanese[0].q.startsWith('NameForgeのような'), 'Japanese FAQ does not display French or English source text');
assert(faqJapanese.every((item) => !item.q.startsWith('Comment ') && !item.q.startsWith('How does') && !item.q.startsWith('كيف يعمل')), 'Japanese FAQ avoids known untranslated fallback entries');


for (const [language, prefix, label] of [
  ['ko', 'NameForge 같은', 'Korean'],
  ['zh', 'NameForge 这样的', 'Chinese'],
  ['ru', 'Как работает', 'Russian'],
  ['hi', 'NameForge जैसा', 'Hindi'],
  ['pl', 'Jak działa', 'Polish'],
] as const) {
  const localized = getLocalizedFaq(language);
  assert(localized.length === 18, `${label} FAQ preserves all 18 entries`, `Found ${localized.length}`);
  assert(localized.every((item) => item.q.trim() && item.a.trim()), `Every ${label} FAQ entry has a question and answer`);
  assert(localized[0].q.startsWith(prefix), `${label} FAQ does not fall back to the French source`);
}


for (const [language, prefix, label] of [
  ['sv', 'Hur fungerar', 'Swedish'],
  ['vi', 'Trình tạo tên', 'Vietnamese'],
  ['id', 'Bagaimana generator', 'Indonesian'],
  ['th', 'เครื่องมือสร้างชื่อ', 'Thai'],
  ['el', 'Πώς λειτουργεί', 'Greek'],
] as const) {
  const localized = getLocalizedFaq(language);
  assert(localized.length === 18, `${label} FAQ preserves all 18 entries`, `Found ${localized.length}`);
  assert(localized.every((item) => item.q.trim() && item.a.trim()), `Every ${label} FAQ entry has a question and answer`);
  assert(localized[0].q.startsWith(prefix), `${label} FAQ does not fall back to the French source`);
}

console.log('=====================================================');
console.log('NAMEFORGE COMPREHENSIVE AUTOMATED TEST SUITE (33+ LOTS)');
console.log('=====================================================\n');

// -----------------------------------------------------------------------------
// LOT 1: CATALOG INTEGRITY & DATABASE VALIDATION (Tests 1 - 7)
// -----------------------------------------------------------------------------
console.log('--- LOT 1: CATALOG INTEGRITY & REPOSITORIES ---');

// Test 1: Exactly 234 registered generators in list
assert(
  ALL_GENERATORS_LIST.length === 234,
  'ALL_GENERATORS_LIST contains exactly 234 unique generator definitions',
  `Found ${ALL_GENERATORS_LIST.length}`
);

// Test 2: Exactly 234 keys in GENERATORS_METADATA
const metaKeys = Object.keys(GENERATORS_METADATA);
assert(
  metaKeys.length === 234,
  'GENERATORS_METADATA map contains exactly 234 registered generators',
  `Found ${metaKeys.length}`
);

// Test 3: No duplicate generator IDs
const idCounts = new Set<string>();
let duplicateFound = false;
for (const g of ALL_GENERATORS_LIST) {
  if (idCounts.has(g.id)) {
    duplicateFound = true;
    break;
  }
  idCounts.add(g.id);
}
assert(!duplicateFound, 'Every generator ID in ALL_GENERATORS_LIST is strictly unique');

// Test 4: Every generator in metadata exists in list
const missingInList = metaKeys.filter((k) => !idCounts.has(k));
assert(
  missingInList.length === 0,
  'Every key in GENERATORS_METADATA exists in ALL_GENERATORS_LIST',
  `Missing: ${missingInList.join(', ')}`
);

// Test 5: Every generator has valid subcategory resolution
const missingSubcategories = ALL_GENERATORS_LIST.filter((g) => !SUBCATEGORIES_DATA[g.id]);
assert(
  missingSubcategories.length === 0,
  'Every generator has a dedicated or resolvable entry in SUBCATEGORIES_DATA',
  `Missing: ${missingSubcategories.map((g) => g.id).join(', ')}`
);

// Test 6: Attested baby names database is populated with verified records
assert(
  ATTESTED_BABY_NAMES.length >= 80,
  'ATTESTED_BABY_NAMES has rich verified historical entries with origins & meanings',
  `Count: ${ATTESTED_BABY_NAMES.length}`
);

// Test 7: Attested baby names contain zero empty origins or meanings
const incompleteBabyNames = ATTESTED_BABY_NAMES.filter(
  (b) => !b.name || !b.origin || !b.meaning || !b.gender
);
assert(
  incompleteBabyNames.length === 0,
  'All attested baby names have complete metadata (name, origin, meaning, gender)',
  `Incomplete count: ${incompleteBabyNames.length}`
);

// -----------------------------------------------------------------------------
// LOT 2: GENERATOR ENGINE PARAMETER TESTING (Tests 8 - 17)
// -----------------------------------------------------------------------------
console.log('\n--- LOT 2: ENGINE PARAMETER MATRIX ---');

// Test 8: Keyword parameter is strictly integrated (Brand generator)
const kwResultsBrand = generateNames({ generatorId: 'brand', keyword: 'Aero', quantity: 6 });
const nonKwBrand = kwResultsBrand.filter((r) => !r.name.toLowerCase().includes('aero'));
assert(
  kwResultsBrand.length === 6 && nonKwBrand.length === 0,
  'Keyword "Aero" is strictly incorporated in 100% of generated brand names',
  `Non-matching: ${nonKwBrand.map((r) => r.name).join(', ')}`
);

// Test 47: Unicode keywords in non-Latin scripts survive cleaning and generation.
const unicodeKeywordNames = generateNames({ generatorId: 'brand', keyword: '星辰', quantity: 3 });
assert(
  unicodeKeywordNames.length === 3 && unicodeKeywordNames.every((entry) => entry.name.includes('星辰')),
  'Chinese keyword characters are preserved in generated names',
  `Generated: ${unicodeKeywordNames.map((entry) => entry.name).join(', ')}`
);

// Unicode edit distance must count supplementary characters as one code point.
assert(
  calculateLevenshteinDistance('😀', '😃') === 1,
  'Unicode edit distance counts emoji as single characters'
);
assert(
  calculateLevenshteinDistance('A😀B', 'A😀B') === 0,
  'Unicode edit distance recognizes identical supplementary characters'
);
assert(
  calculateLevenshteinDistance('星辰', '星月') === 1,
  'Unicode edit distance handles CJK characters'
);

// Test 9: Keyword parameter in fantasy generator
const kwResultsFantasy = generateNames({ generatorId: 'fantasy', keyword: 'Val', quantity: 5 });
const nonKwFantasy = kwResultsFantasy.filter((r) => !r.name.toLowerCase().includes('val'));
assert(
  kwResultsFantasy.length === 5 && nonKwFantasy.length === 0,
  'Keyword "Val" is strictly incorporated in 100% of fantasy names',
  `Non-matching: ${nonKwFantasy.map((r) => r.name).join(', ')}`
);

// Test 10: Length scoring is deterministic; avoid flaky random-batch averages.
const shortNameScore = scoreCandidate('Ael', 'short', 'any');
const longNameScore = scoreCandidate('Ael', 'long', 'any');
const longNameShortPreference = scoreCandidate('Aeloriaen', 'short', 'any');
const longNameLongPreference = scoreCandidate('Aeloriaen', 'long', 'any');
assert(
  shortNameScore > longNameScore && longNameLongPreference > longNameShortPreference,
  `Length option changes candidate scores predictably (short name: ${shortNameScore}/${longNameScore}; long name: ${longNameShortPreference}/${longNameLongPreference})`
);

// Test 11: Format parameter "group" produces prefixes like Atelier, Studio, Maison
const groupNames = generateNames({ generatorId: 'business', format: 'group', quantity: 5 });
const hasGroupPrefix = groupNames.every((r) =>
  /^(Atelier|Studio|Maison|Collectif|Groupe|Agence|Boutique)\b/i.test(r.name)
);
assert(
  hasGroupPrefix,
  'Format "group" prepends proper professional collective indicators',
  `Names: ${groupNames.map((r) => r.name).join(', ')}`
);

// Test 12: Gender parameter female filters baby names
const femaleBabies = generateNames({ generatorId: 'baby_name', gender: 'female', quantity: 8 });
const nonFemale = femaleBabies.filter((b) => b.isAttested && ATTESTED_BABY_NAMES.some((a) => a.name === b.name && a.gender === 'male'));
assert(
  nonFemale.length === 0,
  'Gender female returns exclusively female/neutral baby names',
  `Male names found: ${nonFemale.map((n) => n.name).join(', ')}`
);

// Test 13: Gender parameter male filters baby names
const maleBabies = generateNames({ generatorId: 'baby_name', gender: 'male', quantity: 8 });
const nonMale = maleBabies.filter((b) => b.isAttested && ATTESTED_BABY_NAMES.some((a) => a.name === b.name && a.gender === 'female'));
assert(
  nonMale.length === 0,
  'Gender male returns exclusively male/neutral baby names',
  `Female names found: ${nonMale.map((n) => n.name).join(', ')}`
);

// Test 14: Baby-name styles always return real attested names, including creative mode
const creativeBabies = generateNames({ generatorId: 'baby_name', style: 'creative', quantity: 5 });
const allMarkedAttested = creativeBabies.length === 5 && creativeBabies.every(
  (b) => b.isAttested === true && ATTESTED_BABY_NAMES.some((item) => item.name === b.name)
);
assert(
  allMarkedAttested,
  'Baby-name styles always return names from the attested-name database'
);

// Test 15: Baby names classic style marks isAttested: true
const classicBabies = generateNames({ generatorId: 'baby_name', style: 'classic', quantity: 5 });
const allMarkedTrue = classicBabies.every((b) => b.isAttested === true);
assert(
  allMarkedTrue,
  'Baby names in classic mode are certified historical with isAttested: true'
);

// Test: Baby-name keyword filters must never silently return unrelated names.
const impossibleBabyKeyword = generateNames({
  generatorId: 'baby_name',
  keyword: 'NameForgeKeywordThatCannotMatchAnyAttestedEntry',
  quantity: 5,
});
assert(
  impossibleBabyKeyword.length === 0,
  'Baby-name keyword search returns no unrelated fallback names when there are no matches',
  `Unexpected names: ${impossibleBabyKeyword.map((b) => b.name).join(', ')}`
);

// Test: Gender filters remain enforced even when the preferred length has no matches.
const strictGenderBabies = generateNames({
  generatorId: 'baby_name',
  gender: 'female',
  length: 'long',
  quantity: 8,
});
assert(
  strictGenderBabies.every((b) => b.gender !== 'male'),
  'Baby-name fallback may relax length only, never the selected gender',
  `Unexpected male names: ${strictGenderBabies.filter((b) => b.gender === 'male').map((b) => b.name).join(', ')}`
);

// Unicode scripts must be scored by their real letter count, not as zero Latin letters.
const cjkShortScore = scoreCandidate('未来', 'short', 'any');
const cjkLongScore = scoreCandidate('星河远航者', 'long', 'any');
assert(
  cjkShortScore > 0 && cjkLongScore > 0,
  'Unicode candidate scoring accepts valid CJK names and counts their letters',
  `short=${cjkShortScore}, long=${cjkLongScore}`
);

// Male-ending heuristic must match suffixes, not individual characters.
const masculineSuffixScore = scoreCandidate('Aldor', 'long', 'male');
const neutralSuffixScore = scoreCandidate('Aldox', 'long', 'male');
assert(
  masculineSuffixScore > neutralSuffixScore,
  'Gender heuristic recognizes complete suffixes rather than single ending characters',
  `Aldor=${masculineSuffixScore}, Aldox=${neutralSuffixScore}`
);

// Test 16: Quantity parameter accuracy for 1, 5, 12, 18
const q1 = generateNames({ generatorId: 'fantasy', quantity: 1 });
const q5 = generateNames({ generatorId: 'fantasy', quantity: 5 });
const q12 = generateNames({ generatorId: 'fantasy', quantity: 12 });
const q18 = generateNames({ generatorId: 'fantasy', quantity: 18 });
assert(
  q1.length === 1 && q5.length === 5 && q12.length === 12 && q18.length === 18,
  'Quantity parameter returns exact count requested (1, 5, 12, 18)'
);

// Test 17: Support count alias for quantity
const aliasCount = generateNames({ generatorId: 'brand', count: 7 } as any);
assert(
  aliasCount.length === 7,
  'GenerateOptions supports count as an alias for quantity'
);

// -----------------------------------------------------------------------------
// LOT 3: LINGUISTIC ACCURACY & GRAMMAR CHECKS (Tests 18 - 25)
// -----------------------------------------------------------------------------
console.log('\n--- LOT 3: GRAMMAR, PHONETICS & LINGUISTICS ---');

// Test 18: No dangling prepositions or incomplete articles across sensitive categories
const bookSample = generateNames({ generatorId: 'book', quantity: 15 });
const danglingRegex = /(?:^|[\s'’])(?:de\s+l|d|l|de|du|des|le|la|les|un|une|the|of|in|at|on|for|with|and|by)['’]?$/i;
const danglingFound = bookSample.filter((b) => danglingRegex.test(b.name));
assert(
  danglingFound.length === 0,
  'Book titles contain zero dangling articles or trailing prepositions',
  `Dangling: ${danglingFound.map((b) => b.name).join(', ')}`
);

// Test 19: Plural subject agreement in book generator ("Là où naissent les...")
const pluralVerbTitles = bookSample.filter((b) => /naissent\s+(?:le|la|un|une)\b/i.test(b.name));
assert(
  pluralVerbTitles.length === 0,
  'French titles avoid plural verb with singular article ("naissent le...")',
  `Mismatches: ${pluralVerbTitles.map((b) => b.name).join(', ')}`
);

// Test 20: No duplicate consecutive words (e.g. "Soleil Soleil")
const dupWordsRegex = /\b(\w{3,})\s+\1\b/i;
const dupWordsFound = bookSample.filter((b) => dupWordsRegex.test(b.name));
assert(
  dupWordsFound.length === 0,
  'Book titles contain zero duplicate consecutive identical words'
);

// Test 21: French spacing before titles and apostrophes (no "Vexl'ombre")
const heroSample = generateNames({ generatorId: 'moba_champion', format: 'compound', quantity: 10 });
const agglutinatedTitles = heroSample.filter((h) => /[a-zA-Z][ld]['’][a-zA-Z]/i.test(h.name));
assert(
  agglutinatedTitles.length === 0,
  'Names with titles preserve whitespace before articles (no "Vexl’ombre")',
  `Agglutinated: ${agglutinatedTitles.map((h) => h.name).join(', ')}`
);

// Test 22: Restaurant names sound natural and have correct French gender agreements
const restaurantSample = generateNames({ generatorId: 'restaurant', quantity: 10 });
const hasValidFrenchStructure = restaurantSample.every((r) =>
  /^(Le|La|L’|L'|Au|Chez)\s+/i.test(r.name) || r.name.length > 5
);
assert(
  hasValidFrenchStructure,
  'Restaurant names conform to natural French culinary establishment patterns'
);

// Test 23: Levenshtein distance calculation accuracy
const d1 = calculateLevenshteinDistance('kitten', 'sitting');
const d2 = calculateLevenshteinDistance('forge', 'forge');
assert(
  d1 === 3 && d2 === 0,
  'calculateLevenshteinDistance computes exact edit distance'
);

// Test 24: isTooSimilar correctly flags close phonetic variants
const sim1 = isTooSimilar('Kaly', ['Kaly', 'Aero']);
const sim2 = isTooSimilar('Novalis', ['Novalis']);
assert(
  sim1 === true && sim2 === true,
  'isTooSimilar correctly identifies collisions with existing batch'
);

// Test 25: isTooSimilar does not falsely reject distinct names sharing a keyword
const simKw = isTooSimilar('Talis Aero', ['Kaly Aero'], 'Aero');
assert(
  simKw === false,
  'isTooSimilar does not falsely reject distinct candidates that share the requested keyword'
);

// Unicode normalization, punctuation, and whitespace should not bypass duplicate detection.
assert(
  isTooSimilar('Café Nova', ['Café Nova']) === true,
  'Similarity filtering recognizes canonically equivalent accented text'
);
assert(
  isTooSimilar('Aero-Vance', ['Aero Vance']) === true,
  'Similarity filtering recognizes punctuation-only name variants'
);
assert(
  isTooSimilar('星辰', ['星辰']) === true && isTooSimilar('星辰', ['星月']) === false,
  'Similarity filtering distinguishes exact CJK matches from distinct names'
);
assert(
  calculateLevenshteinDistance('Café', 'Café') === 0,
  'Levenshtein distance normalizes combining accents before comparison'
);

// -----------------------------------------------------------------------------
// LOT 4: FULL CATALOG AUDIT OF ALL 234 GENERATORS (Tests 26 - 33)
// -----------------------------------------------------------------------------
console.log('\n--- LOT 4: FULL CATALOG RUN (234 GENERATORS) ---');

let totalEmpty = 0;
let totalShort = 0;
let totalBatchDupes = 0;
let totalDangling = 0;
let totalTrailingApos = 0;
let totalConsecutiveDupes = 0;
let totalEvaluated = 0;

for (const g of ALL_GENERATORS_LIST) {
  const count = 5;
  const batch = generateNames({ generatorId: g.id, quantity: count });
  if (!batch || batch.length !== count) {
    totalShort++;
  }
  const seenBatch = new Set<string>();
  for (const item of batch) {
    totalEvaluated++;
    if (!item.name || item.name.trim().length === 0) totalEmpty++;
    const lower = item.name.toLowerCase();
    if (seenBatch.has(lower)) totalBatchDupes++;
    seenBatch.add(lower);

    if (danglingRegex.test(item.name)) totalDangling++;
    if (/['’]$/.test(item.name)) totalTrailingApos++;
    if (dupWordsRegex.test(item.name)) totalConsecutiveDupes++;
  }
}

// Test 26: 0 empty names across entire catalog
assert(
  totalEmpty === 0,
  `0 empty names generated across all 234 generators (${totalEvaluated} names evaluated)`,
  `Empty count: ${totalEmpty}`
);

// Test 27: 0 short batches across entire catalog
assert(
  totalShort === 0,
  `0 short batches across all 234 generators (all batches met target quantity of 5)`,
  `Short count: ${totalShort}`
);

// Test 28: 0 duplicate names within any batch
assert(
  totalBatchDupes === 0,
  `0 intra-batch duplicate names across all 234 generators`,
  `Duplicate count: ${totalBatchDupes}`
);

// Test 29: 0 dangling prepositions across entire catalog
assert(
  totalDangling === 0,
  `0 dangling prepositions across all 234 generators`,
  `Dangling count: ${totalDangling}`
);

// Test 30: 0 trailing apostrophes across entire catalog
assert(
  totalTrailingApos === 0,
  `0 trailing apostrophes across all 234 generators`,
  `Trailing apos count: ${totalTrailingApos}`
);

// Test 31: 0 consecutive duplicate words across entire catalog
assert(
  totalConsecutiveDupes === 0,
  `0 consecutive duplicate words across all 234 generators`,
  `Consecutive dupes count: ${totalConsecutiveDupes}`
);

// Test 32: All generated names provide professional metadata
const testBatch = generateNames({ generatorId: 'innovation', quantity: 4 });
const hasAllMeta = testBatch.every(
  (b) => b.strengths && b.strengths.length > 0 && b.watchouts && b.watchouts.length > 0 && b.pronunciation
);
assert(
  hasAllMeta,
  'Generated names include rich metadata (strengths, watchouts, pronunciation)'
);

// Test 33: Multi-language phonetic adaptation generates appropriate characters
const frNames = generateNames({ generatorId: 'fantasy', genLanguage: 'fr', quantity: 5 });
assert(
  frNames.length === 5 && frNames.every((n) => n.name.length > 0),
  'French phonetic profile generates 5 consistent names'
);

const generationLocales = [
  'fr', 'en', 'es', 'de', 'it', 'pt', 'ar', 'tr', 'ja', 'ko', 'zh', 'ru', 'hi',
  'nl', 'pl', 'sv', 'vi', 'id', 'th', 'el', 'he', 'cs', 'ro', 'da', 'fi',
] as const;
const allLocaleBatches = generationLocales.map((genLanguage) =>
  generateNames({ generatorId: 'fantasy', genLanguage, quantity: 3 })
);
assert(
  allLocaleBatches.length === 25 &&
    allLocaleBatches.every((batch) => batch.length === 3 && batch.every((item) => item.name.trim().length > 0)),
  'All 25 supported languages generate non-empty names without errors'
);

// SVG export must preserve letter spacing and Unicode content.
const spacedSvg = generateSvgCode('星😀辰', 48, 'Arial', 'cyber-neon', 'cosmic-nebula-texture', true, 3);
assert(
  spacedSvg.includes('letter-spacing="3px"'),
  'SVG export preserves the selected letter spacing'
);
assert(
  spacedSvg.includes('星😀辰'),
  'SVG export preserves multilingual and supplementary Unicode text'
);

// -----------------------------------------------------------------------------
// LOT 5: TEXT STYLER WORKSHOP & I18N RTL VALIDATION (Tests 34 - 40)
// -----------------------------------------------------------------------------
console.log('\n--- LOT 5: TEXT STYLER, UNICODE & RTL ---');

import { UNICODE_STYLES, VISUAL_EFFECTS, TEXTURE_FILLS } from '../services/textStyler';
import { getAppSettings } from '../services/settings';
import { getStudioLabel } from '../i18n/studio';

// Test 34: Unicode styles library count
assert(
  UNICODE_STYLES.length >= 20,
  `UNICODE_STYLES library provides 20+ transformation modes (found ${UNICODE_STYLES.length})`
);

// Test 35: Unicode transforms work accurately across diverse glyph blocks
const sampleWord = 'Forge';
const transformedBold = UNICODE_STYLES.find((s) => s.id === 'bold-sans')?.transform(sampleWord);
const transformedFraktur = UNICODE_STYLES.find((s) => s.id === 'fraktur')?.transform(sampleWord);
const transformedScript = UNICODE_STYLES.find((s) => s.id === 'script')?.transform(sampleWord);
const transformedInverted = UNICODE_STYLES.find((s) => s.id === 'inverted')?.transform(sampleWord);

assert(
  Boolean(transformedBold && transformedBold !== sampleWord && transformedFraktur && transformedScript && transformedInverted),
  'Unicode transformations accurately map standard characters to stylistic mathematical blocks',
  `Bold: ${transformedBold}, Fraktur: ${transformedFraktur}`
);

// Test 46: Unicode transformations preserve supplementary-plane emoji and symbols.
const emojiInput = 'Forge 🚀 𐐒';
const emojiBold = UNICODE_STYLES.find((style) => style.id === 'bold-sans')?.transform(emojiInput) || '';
const emojiInverted = UNICODE_STYLES.find((style) => style.id === 'inverted')?.transform(emojiInput) || '';
assert(
  emojiBold.includes('🚀') && emojiBold.includes('𐐒') && emojiInverted.includes('🚀') && emojiInverted.includes('𐐒'),
  'Unicode transforms preserve supplementary-plane characters without splitting surrogate pairs'
);

// Test 36: Visual effects presets integrity
assert(
  VISUAL_EFFECTS.length >= 6 && VISUAL_EFFECTS.every((e) => e.gradientCSS && e.textShadowCSS && e.bgColor),
  'VISUAL_EFFECTS presets contain complete CSS gradients, text shadows, and backgrounds'
);

// Test 37: Texture fills clipping mask integrity
assert(
  TEXTURE_FILLS.length >= 6 && TEXTURE_FILLS.every((t) => typeof t.canvasDrawer === 'function' && t.cssBackground),
  'TEXTURE_FILLS provide valid procedural canvas drawers and CSS background-clip textures'
);

// Test 38: Vector SVG export generator
const svgOutput = generateSvgCode('TestBrand', 48, 'sans-serif', 'cyber-neon', 'carbon-weave', true);
assert(
  svgOutput.includes('<svg') && svgOutput.includes('TestBrand') && svgOutput.includes('</svg>'),
  'generateSvgCode outputs valid vector SVG markup with text and gradient defs'
);

// Test 39: English is official default language
const defaultSet = getAppSettings();
assert(
  defaultSet.language === 'en',
  `Official default app language is English ('en') (found '${defaultSet.language}')`
);

// Test 40: RTL language support
const rtlCodes = ['ar', 'he', 'fa', 'ur', 'ps'];
const rtlMeta = SUPPORTED_LANGUAGES.filter((l) => rtlCodes.includes(l.code));
const allHaveRtl = rtlMeta.length === rtlCodes.length && rtlMeta.every((l) => l.dir === 'rtl');
assert(
  allHaveRtl,
  'All Middle Eastern / RTL languages (ar, he, fa, ur, ps) have dir="rtl" defined'
);

// Test 41: SVG safely escapes user-supplied markup.
const escapedSvg = generateSvgCode('<script>alert("x")</script>', 48, 'sans-serif', 'cyber-neon', 'carbon-weave', true);
assert(
  escapedSvg.includes('&lt;script&gt;') && !escapedSvg.includes('<script>'),
  'SVG export escapes user text so markup is rendered as text, not injected elements'
);

// Test 42: SVG includes a texture overlay clipped to the glyph shape.
const texturedSvg = generateSvgCode('NameForge', 48, 'sans-serif', 'pure-gold', 'brushed-gold', true);
assert(
  texturedSvg.includes('clip-path="url(#nf-text-clip)"') && texturedSvg.includes('nf-pattern-brushed-gold'),
  'SVG export applies the selected texture as a clipped overlay inside the text'
);

// Grapheme-safe handling for accents, emoji modifiers, ZWJ sequences, and flags.
const graphemeSamples = ['e\u0301', '👍🏽', '👩‍💻', '🇩🇿'];
assert(
  graphemeSamples.every((sample) => splitGraphemes(sample).length === 1),
  'Canvas spacing and SVG sizing treat multi-code-point visible characters as one grapheme'
);

// Test 43: SVG width expands for longer text instead of staying fixed.
const shortSvg = generateSvgCode('Hi', 48, 'sans-serif', 'cyber-neon', 'carbon-weave', true);
const longSvg = generateSvgCode('A very long NameForge studio title', 48, 'sans-serif', 'cyber-neon', 'carbon-weave', true);
const shortWidth = Number(shortSvg.match(/viewBox="0 0 (\d+)/)?.[1] || 0);
const longWidth = Number(longSvg.match(/viewBox="0 0 (\d+)/)?.[1] || 0);
assert(
  longWidth > shortWidth,
  'SVG export dynamically expands its canvas for longer text'
);

// Test 44: Core Studio labels are translated for all 25 priority languages.
const priorityStudioLanguages = ['fr', 'en', 'ar', 'tr', 'es', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ru', 'hi', 'nl', 'pl', 'sv', 'vi', 'id', 'th', 'el', 'he', 'cs', 'ro', 'da', 'fi'];

function flattenTranslationLeaves(value: unknown, prefix = ''): Array<{ path: string; value: unknown }> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
      flattenTranslationLeaves(child, prefix ? `${prefix}.${key}` : key)
    );
  }
  return [{ path: prefix, value }];
}

const englishTranslationLeaves = flattenTranslationLeaves(getTranslations('en'));
const englishTranslationPaths = englishTranslationLeaves.map(({ path }) => path).sort();
const translationCatalogFailures: string[] = [];
for (const language of priorityStudioLanguages) {
  const localizedLeaves = flattenTranslationLeaves(getTranslations(language));
  const localizedPaths = localizedLeaves.map(({ path }) => path).sort();
  if (JSON.stringify(localizedPaths) !== JSON.stringify(englishTranslationPaths)) {
    translationCatalogFailures.push(`${language}: translation key structure differs from English`);
  }
  for (const leaf of localizedLeaves) {
    if (typeof leaf.value !== 'string' || leaf.value.trim().length === 0) {
      translationCatalogFailures.push(`${language}: missing or empty value at ${leaf.path || '<root>'}`);
    }
  }
}
assert(
  translationCatalogFailures.length === 0,
  'All 25 priority locales have the same complete, non-empty core translation catalog',
  translationCatalogFailures.slice(0, 30).join('; ') || 'All translation keys and values checked'
);

const studioKeys = ['title', 'inputLabel', 'inputPlaceholder', 'copyPlain', 'quickPresets', 'unicodeTab', 'effectsTab', 'texturesTab', 'exportTab', 'fontFamily', 'fontSize', 'letterSpacing', 'visualEffect', 'textureMask', 'transparentBg', 'exportQuality', 'exportPng', 'copySvg', 'copyCss', 'copy', 'copied', 'clickToCopy', 'reset', 'typographySettings', 'chooseTexture', 'textureActive', 'clickToApply', 'openCanvas', 'backHome', 'svgCopied', 'cssCopied', 'selectedForStudio', 'heroTitle', 'heroAccent', 'heroDescription', 'unicodeHint', 'effectsHint', 'texturesHint', 'clearInput'] as const;
const studioLabelsComplete = priorityStudioLanguages.every((language) => studioKeys.every((key) => getStudioLabel(language, key).trim().length > 0));
assert(
  studioLabelsComplete,
  'Core Style Studio controls have translated labels for all 25 priority languages',
  `Checked ${priorityStudioLanguages.length} languages and ${studioKeys.length} labels`
);

// Test 45: Supported language registry has unique, complete metadata.
const languageCodes = SUPPORTED_LANGUAGES.map((language) => language.code);
const uniqueLanguageCodes = new Set(languageCodes);
const invalidLanguageMeta = SUPPORTED_LANGUAGES.filter(
  (language) => !language.label.trim() || !language.native.trim() || !['ltr', 'rtl'].includes(language.dir)
);
assert(
  uniqueLanguageCodes.size === SUPPORTED_LANGUAGES.length && invalidLanguageMeta.length === 0,
  'Every supported language has a unique code, visible names, and a valid reading direction',
  `Languages: ${SUPPORTED_LANGUAGES.length}; duplicate codes: ${languageCodes.length - uniqueLanguageCodes.size}; incomplete metadata: ${invalidLanguageMeta.length}`
);

// Test 46: French restaurant and bakery suffixes avoid gender-agreement traps.
const restaurantSuffixes = SUBCATEGORIES_DATA.restaurant?.bistro?.suffixes || [];
const bakerySuffixes = SUBCATEGORIES_DATA.bakery?.artisan?.suffixes || [];
const knownAgreementTraps = new Set(['Doré', 'Gourmand', 'Sauvage', 'Voisin', 'Sincère', 'Pur', 'Bleu', 'Blanc', 'Étoilé', 'Minéral', 'Silencieux', 'Fidèle', 'Rustique']);
const remainingAgreementTraps = [...restaurantSuffixes, ...bakerySuffixes].filter((suffix) => knownAgreementTraps.has(suffix));
assert(
  remainingAgreementTraps.length === 0,
  'Restaurant and bakery templates avoid suffixes that disagree with feminine/masculine prefixes',
  remainingAgreementTraps.join(', ') || 'No known agreement traps'
);

// Test 47: Literary title templates no longer pair a fixed article with incompatible endings.
const literaryDefault = SUBCATEGORIES_DATA.book?.default;
const literaryPrefixes = literaryDefault?.prefixes || [];
const literarySuffixes = literaryDefault?.suffixes || [];
const incompleteLiteraryPrefixes = ['Le Jour où le', 'Mémoire d’un', 'Au Bord du'];
assert(
  literaryPrefixes.length > 0 && literarySuffixes.length > 0 &&
    !literaryPrefixes.some((prefix) => incompleteLiteraryPrefixes.includes(prefix)),
  'Default literary titles use complete, grammatically compatible templates',
  `Prefixes: ${literaryPrefixes.length}; suffixes: ${literarySuffixes.length}`
);

// Search regressions: accents, case, and separators should not block discovery.
assert(
  normalizeSearchText('Prénoms de bébé') === normalizeSearchText('PRENOMS DE BEBE'),
  'Catalogue search ignores accents and letter case'
);
assert(
  normalizeSearchText('baby_name') === normalizeSearchText('Baby name'),
  'Catalogue search treats underscores and spaces consistently'
);
assert(
  normalizeSearchText('dragon-fantasy') === normalizeSearchText('Dragon fantasy'),
  'Catalogue search treats hyphens and spaces consistently'
);

// Every generator must have a non-empty localized category summary in all 25 priority languages.
const descriptionCoverageFailures: string[] = [];
for (const lang of LOCALIZED_GENERATOR_DESCRIPTION_LANGUAGES) {
  for (const meta of ALL_GENERATORS_LIST) {
    const localized = getLocalizedGeneratorDescription(meta, lang as any);
    if (!localized.trim() || (lang !== 'fr' && localized === meta.description)) {
      descriptionCoverageFailures.push(`${lang}/${meta.id}`);
    }
  }
}
assert(
  LOCALIZED_GENERATOR_DESCRIPTION_LANGUAGES.length === 25 &&
    ALL_GENERATORS_LIST.length === 234 &&
    descriptionCoverageFailures.length === 0,
  'All 234 generators have non-empty localized summaries in all 25 priority languages',
  descriptionCoverageFailures.slice(0, 30).join(', ') ||
    `${ALL_GENERATORS_LIST.length} generators × ${LOCALIZED_GENERATOR_DESCRIPTION_LANGUAGES.length} languages checked`
);


// Every generator with a reviewed, generator-specific description must cover all 25 priority locales.
const reviewedDescriptionCoverageFailures: string[] = [];
for (const generatorId of LOCALIZED_GENERATOR_DESCRIPTION_IDS) {
  const meta = GENERATORS_METADATA[generatorId as keyof typeof GENERATORS_METADATA];
  if (!meta) {
    reviewedDescriptionCoverageFailures.push(`${generatorId}/missing-metadata`);
    continue;
  }
  for (const lang of LOCALIZED_GENERATOR_DESCRIPTION_LANGUAGES) {
    const localized = getLocalizedGeneratorDescription(meta, lang);
    if (!hasLocalizedGeneratorDescription(generatorId, lang) || !localized.trim()) {
      reviewedDescriptionCoverageFailures.push(`${generatorId}/${lang}`);
    }
  }
}
assert(
  reviewedDescriptionCoverageFailures.length === 0,
  `All ${LOCALIZED_GENERATOR_DESCRIPTION_IDS.length} reviewed generator-specific descriptions cover all 25 priority locales`,
  reviewedDescriptionCoverageFailures.slice(0, 30).join(', ') || `${LOCALIZED_GENERATOR_DESCRIPTION_IDS.length} generators × 25 locales checked`
);

// Generator-specific descriptions must remain complete for all priority locales.
const petDescriptionFailures = LOCALIZED_GENERATOR_DESCRIPTION_LANGUAGES.filter(
  (lang) => !hasLocalizedGeneratorDescription('pet_name', lang)
);
assert(
  petDescriptionFailures.length === 0,
  'Pet-name generator has a reviewed, generator-specific description in all 25 priority languages',
  petDescriptionFailures.join(', ') || '25 languages checked'
);

// Gaming aliases have dedicated, reviewed descriptions across all priority locales.
const gamingDescriptionFailures = LOCALIZED_GENERATOR_DESCRIPTION_LANGUAGES.filter(
  (lang) => !hasLocalizedGeneratorDescription('gaming', lang)
);
assert(
  gamingDescriptionFailures.length === 0,
  'Gaming-name generator has a reviewed, generator-specific description in all 25 priority languages',
  gamingDescriptionFailures.join(', ') || '25 languages checked'
);

// Book-title descriptions are explicit and localized in all priority locales.
const bookDescriptionFailures = LOCALIZED_GENERATOR_DESCRIPTION_LANGUAGES.filter(
  (lang) => !hasLocalizedGeneratorDescription('book', lang)
);
assert(
  bookDescriptionFailures.length === 0,
  'Book-title generator has a reviewed, generator-specific description in all 25 priority languages',
  bookDescriptionFailures.join(', ') || '25 languages checked'
);

// Restaurant-name descriptions are specific and localized across priority locales.
const restaurantDescriptionFailures = LOCALIZED_GENERATOR_DESCRIPTION_LANGUAGES.filter(
  (lang) => !hasLocalizedGeneratorDescription('restaurant', lang)
);
assert(
  restaurantDescriptionFailures.length === 0,
  'Restaurant-name generator has a reviewed, generator-specific description in all 25 priority languages',
  restaurantDescriptionFailures.join(', ') || '25 languages checked'
);

// Startup-name descriptions cover all priority locales and include availability cautions.
const startupDescriptionFailures = LOCALIZED_GENERATOR_DESCRIPTION_LANGUAGES.filter(
  (lang) => !hasLocalizedGeneratorDescription('startup', lang)
);
assert(
  startupDescriptionFailures.length === 0,
  'Startup-name generator has a reviewed, generator-specific description in all 25 priority languages',
  startupDescriptionFailures.join(', ') || '25 languages checked'
);

// Fantasy, product, and anime descriptions must cover every priority locale.
for (const generatorId of ['fantasy', 'product', 'anime'] as const) {
  const failures = LOCALIZED_GENERATOR_DESCRIPTION_LANGUAGES.filter(
    (lang) => !hasLocalizedGeneratorDescription(generatorId, lang)
  );
  assert(
    failures.length === 0,
    `${generatorId} has a generator-specific description in all 25 priority languages`,
    failures.join(', ') || '25 languages checked'
  );
}

const additionalFaqChecks = [
  ['ko', 'NameForge 같은', 'Korean'],
  ['zh', 'NameForge 这样的', 'Chinese'],
  ['ru', 'Как работает', 'Russian'],
  ['hi', 'NameForge जैसा', 'Hindi'],
  ['pl', 'Jak działa', 'Polish'],
  ['sv', 'Hur fungerar', 'Swedish'],
  ['vi', 'Trình tạo tên', 'Vietnamese'],
  ['id', 'Bagaimana generator', 'Indonesian'],
  ['th', 'เครื่องมือสร้างชื่อ', 'Thai'],
  ['el', 'Πώς λειτουργεί', 'Greek'],
  ['ro', 'Cum funcționează', 'Romanian'],
  ['da', 'Hvordan fungerer', 'Danish'],
  ['fi', 'Miten NameForgen', 'Finnish'],
  ['cs', 'Jak funguje', 'Czech'],
  ['he', 'איך פועל', 'Hebrew'],
] as const;
for (const [language, prefix, label] of additionalFaqChecks) {
  const localized = getLocalizedFaq(language);
  assert(localized.length === 18, `${label} FAQ preserves all 18 entries`, `Found ${localized.length}`);
  assert(localized.every((item) => item.q.trim() && item.a.trim()), `Every ${label} FAQ entry has a question and answer`);
  assert(localized[0].q.startsWith(prefix), `${label} FAQ uses its own translation rather than French fallback`);
}

// Generator-specific descriptions must exist in each locale declared as reviewed.
const reviewedGeneratorDescriptionLocales = ['en', 'fr', 'es', 'de'] as const;
const reviewedGeneratorIds = [
  'fantasy', 'baby_name', 'brand', 'business', 'product',
  'startup', 'book', 'gaming', 'anime', 'restaurant',
];
const specificDescriptionFailures: string[] = [];
for (const generatorId of reviewedGeneratorIds) {
  const meta = GENERATORS_METADATA[generatorId];
  for (const lang of reviewedGeneratorDescriptionLocales) {
    const localized = getLocalizedGeneratorDescription(meta, lang);
    if (!hasLocalizedGeneratorDescription(generatorId, lang) || !localized.trim()) {
      specificDescriptionFailures.push(`${generatorId}/${lang}`);
    }
  }
}
assert(
  specificDescriptionFailures.length === 0,
  '10 core generators have specific descriptions in English, French, Spanish, and German',
  specificDescriptionFailures.join(', ')
);
// Baby-name guidance is reviewed in every priority locale, not merely category-fallback text.
for (const generatorId of ['baby_name', 'brand', 'business'] as const) {
  const failures = LOCALIZED_GENERATOR_DESCRIPTION_LANGUAGES.filter((lang) => {
    const localized = getLocalizedGeneratorDescription(GENERATORS_METADATA[generatorId], lang as any);
    return !hasLocalizedGeneratorDescription(generatorId, lang as any) || !localized.trim();
  });
  assert(
    failures.length === 0,
    `${generatorId} has a generator-specific description in all 25 priority languages`,
    failures.join(', ')
  );
}

// Dragon, elf, app, and domain descriptions must cover every priority locale.
for (const generatorId of ['dragon', 'elf', 'app', 'domain'] as const) {
  const failures = LOCALIZED_GENERATOR_DESCRIPTION_LANGUAGES.filter(
    (lang) => !hasLocalizedGeneratorDescription(generatorId, lang)
  );
  assert(
    failures.length === 0,
    `${generatorId} has a generator-specific description in all 25 priority languages`,
    failures.join(', ') || '25 languages checked'
  );
}

// Shop and slogan descriptions must cover every priority locale.
for (const generatorId of ['shop', 'slogan'] as const) {
  const failures = LOCALIZED_GENERATOR_DESCRIPTION_LANGUAGES.filter(
    (lang) => !hasLocalizedGeneratorDescription(generatorId, lang)
  );
  assert(
    failures.length === 0,
    `${generatorId} has a generator-specific description in all 25 priority languages`,
    failures.join(', ') || '25 languages checked'
  );
}

// Anime hero, indie game studio, and local association descriptions cover all priority locales.
for (const generatorId of ['anime_hero', 'indie_game_studio', 'local_association'] as const) {
  const failures = LOCALIZED_GENERATOR_DESCRIPTION_LANGUAGES.filter(
    (lang) => !hasLocalizedGeneratorDescription(generatorId, lang)
  );
  assert(
    failures.length === 0,
    `${generatorId} has a generator-specific description in all 25 priority languages`,
    failures.join(', ') || '25 languages checked'
  );
}

// Anime rivals, fictional mentors, and software tools cover all priority locales.
for (const generatorId of ['anime_rival', 'fictional_mentor', 'software_tool'] as const) {
  const failures = LOCALIZED_GENERATOR_DESCRIPTION_LANGUAGES.filter(
    (lang) => !hasLocalizedGeneratorDescription(generatorId, lang)
  );
  assert(
    failures.length === 0,
    `${generatorId} has a generator-specific description in all 25 priority languages`,
    failures.join(', ') || '25 languages checked'
  );
}

// Video game and role-playing generators have explicit descriptions in every priority locale.
for (const generatorId of ['videogame', 'rpg'] as const) {
  const failures = LOCALIZED_GENERATOR_DESCRIPTION_LANGUAGES.filter(
    (lang) => !hasLocalizedGeneratorDescription(generatorId, lang)
  );
  assert(
    failures.length === 0,
    `${generatorId} has a generator-specific description in all 25 priority languages`,
    failures.join(', ') || '25 languages checked'
  );
}

// Podcast and planet generators must have dedicated text in all 25 priority locales.
for (const generatorId of ['podcast', 'planet'] as const) {
  const failures = LOCALIZED_GENERATOR_DESCRIPTION_LANGUAGES.filter(
    (lang) => !hasLocalizedGeneratorDescription(generatorId, lang)
  );
  assert(
    failures.length === 0,
    `${generatorId} has a generator-specific description in all 25 priority languages`,
    failures.join(', ') || '25 languages checked'
  );
}

// Character and AI-assistant generators must have dedicated descriptions in every priority locale.
for (const generatorId of ['character', 'ai_bot'] as const) {
  const failures = LOCALIZED_GENERATOR_DESCRIPTION_LANGUAGES.filter(
    (lang) => !hasLocalizedGeneratorDescription(generatorId, lang)
  );
  assert(
    failures.length === 0,
    `${generatorId} has a generator-specific description in all 25 priority languages`,
    failures.join(', ') || '25 languages checked'
  );
}

// Language registry integrity and right-to-left direction regression checks.
assert(
  new Set(SUPPORTED_LANGUAGES.map((language) => language.code)).size === SUPPORTED_LANGUAGES.length,
  'Supported language codes are unique'
);
assert(
  SUPPORTED_LANGUAGES.every((language) => language.label.trim() && language.native.trim()),
  'Every supported language has a display and native label'
);
const expectedRtlLanguages = ['ar', 'he', 'fa', 'ur', 'ps'] as const;
for (const code of expectedRtlLanguages) {
  const language = SUPPORTED_LANGUAGES.find((item) => item.code === code);
  assert(
    language?.dir === 'rtl',
    `Language registry marks ${code} as right-to-left`,
    language ? `Expected rtl, received ${language.dir}` : 'Language code is missing'
  );
}
assert(
  SUPPORTED_LANGUAGES.filter((language) => language.dir === 'rtl').length === expectedRtlLanguages.length,
  'Only explicitly supported right-to-left languages use RTL direction'
);

// The Style Studio's apply-to-canvas action must not silently fall back to English.
const studioPriorityLocales = ['fr', 'en', 'ar', 'tr', 'es', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ru', 'hi', 'nl', 'pl', 'sv', 'vi', 'id', 'th', 'el', 'he', 'cs', 'ro', 'da', 'fi'] as const;
const englishApplyToCanvas = getStudioLabel('en', 'applyToCanvas');
for (const locale of studioPriorityLocales) {
  const label = getStudioLabel(locale, 'applyToCanvas');
  assert(
    label.trim().length > 0 && (locale === 'en' || label !== englishApplyToCanvas),
    `Style Studio apply-to-canvas label is localized for ${locale}`,
    `Received "${label}"`
  );
}

// Style label localization regression checks across all 25 priority locales.
const styleLocaleSamples = [
  { key: 'assassin', source: 'Shadow Assassin' },
  { key: 'warrior', source: 'Heroic Warrior' },
  { key: 'brandable', source: 'Brandable Domain' },
  { key: 'cocktail', source: 'Signature Cocktail' },
] as const;
for (const locale of PRIORITY_LOCALES) {
  for (const sample of styleLocaleSamples) {
    const label = getLocalizedStyleLabel(sample.key, locale);
    assert(
      label.trim().length > 0,
      `Style label ${sample.key} is available for ${locale}`,
      `Received "${label}"`
    );
    if (locale !== 'en') {
      assert(
        label !== sample.source,
        `Style label ${sample.key} does not silently fall back to English for ${locale}`,
        `Received "${label}"`
      );
    }
  }
}
assert(
  getLocalizedStyleLabel('assassin', 'ar').includes('قاتل الظلال'),
  'Arabic style labels use Arabic text'
);
assert(
  getLocalizedStyleLabel('high-elf', 'fi').includes('Ylähaltia') &&
    getLocalizedStyleLabel('shadow-rogue', 'fi').includes('Varjovaras'),
  'Finnish style labels do not contain accidental internal spaces'
);
assert(
  getLocalizedStyleLabel('User custom style', 'fr') === 'User custom style',
  'Unknown custom style labels are preserved unchanged'
);

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
const passedCount = results.filter((r) => r.passed).length;
const failedCount = results.filter((r) => !r.passed).length;

console.log('\n=====================================================');
console.log(`TEST SUITE SUMMARY: ${passedCount}/${results.length} PASSED`);
if (failedCount > 0) {
  console.error(`FAILED: ${failedCount} tests failed.`);
  process.exit(1);
} else {
  console.log(`ALL ${results.length} TESTS PASSED SUCCESSFULLY! 🚀`);
  console.log('=====================================================');
}
