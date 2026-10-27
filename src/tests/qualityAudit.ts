import { ALL_GENERATORS_LIST } from '../data/generators';
import { generateNames } from '../services/generatorEngine';

console.log('=== NAMEFORGE AUTOMATED QUALITY AUDIT ===\n');

const totalGens = ALL_GENERATORS_LIST.length;
let emptyNames = 0;
let shortBatches = 0;
let batchDuplicates = 0;
let danglingPrepositions = 0;
let trailingApostrophes = 0;
let duplicateConsecutiveWords = 0;
let singleLetterTail = 0;
let totalNamesEvaluated = 0;

const danglingRegex = /(?:^|[\s'’])(?:de\s+l|d|l|de|du|des|le|la|les|un|une|the|of|in|at|on|for|with|and|by)['’]?$/i;
const dupWordsRegex = /\b(\w{3,})\s+\1\b/i;

for (const g of ALL_GENERATORS_LIST) {
  const count = 6;
  const results = generateNames({ generatorId: g.id, quantity: count });
  if (!results || results.length !== count) {
    shortBatches++;
  }
  const seen = new Set<string>();
  for (const r of results) {
    totalNamesEvaluated++;
    if (!r.name || r.name.trim().length === 0) emptyNames++;
    if (seen.has(r.name.toLowerCase())) batchDuplicates++;
    seen.add(r.name.toLowerCase());

    if (danglingRegex.test(r.name)) danglingPrepositions++;
    if (/['’]$/.test(r.name)) trailingApostrophes++;
    if (dupWordsRegex.test(r.name)) duplicateConsecutiveWords++;
    if (/\s+[a-zA-Z]$/.test(r.name)) singleLetterTail++;
  }
}

console.log('1. GLOBAL CATALOG METRICS:');
console.log(`- Generators audited: ${totalGens}`);
console.log(`- Names evaluated: ${totalNamesEvaluated}`);
console.log(`- Empty names: ${emptyNames}`);
console.log(`- Short batches: ${shortBatches}`);
console.log(`- Intra-batch duplicates: ${batchDuplicates}`);
console.log(`- Dangling prepositions: ${danglingPrepositions}`);
console.log(`- Trailing apostrophes: ${trailingApostrophes}`);
console.log(`- Duplicate consecutive words: ${duplicateConsecutiveWords}`);
console.log(`- Single-letter tails: ${singleLetterTail}`);

// 2. BABY NAME TESTS
console.log('\n2. BABY NAMES ATTRIBUTES AUDIT:');
const babyGirls = generateNames({ generatorId: 'baby_name', style: 'classic', gender: 'female', quantity: 5 });
console.log('Classic baby girls:', babyGirls.map((b) => `${b.name} (${b.origin} - ${b.meaning}) [attested: ${b.isAttested}]`));

const babyBoys = generateNames({ generatorId: 'baby_name', style: 'modern', gender: 'male', quantity: 5 });
console.log('Modern baby boys:', babyBoys.map((b) => `${b.name} (${b.origin} - ${b.meaning}) [attested: ${b.isAttested}]`));

const babyCreative = generateNames({ generatorId: 'baby_name', style: 'creative', quantity: 5 });
console.log('Creative baby mode:', babyCreative.map((b) => `${b.name} [attested: ${b.isAttested}] - ${b.description}`));

// 3. PARAMETER TEST: LENGTH
console.log('\n3. PARAMETER AUDIT (LENGTH):');
const shortNames = generateNames({ generatorId: 'fantasy', length: 'short', quantity: 4 });
console.log('Fantasy short:', shortNames.map((x) => `${x.name} (${x.name.length} chars)`));

const longNames = generateNames({ generatorId: 'fantasy', length: 'long', quantity: 4 });
console.log('Fantasy long:', longNames.map((x) => `${x.name} (${x.name.length} chars)`));

// 4. PARAMETER TEST: KEYWORD
console.log('\n4. PARAMETER AUDIT (KEYWORD):');
const kwBrand = generateNames({ generatorId: 'brand', keyword: 'Aero', quantity: 4 });
console.log('Brand with keyword Aero:', kwBrand.map((x) => x.name));

// 5. PARAMETER TEST: FORMAT
console.log('\n5. PARAMETER AUDIT (FORMAT):');
const groupBus = generateNames({ generatorId: 'business', format: 'group', quantity: 4 });
console.log('Business group format:', groupBus.map((x) => x.name));

const compoundHero = generateNames({ generatorId: 'moba_champion', format: 'compound', quantity: 4 });
console.log('Moba champion compound format:', compoundHero.map((x) => x.name));

// 6. SENSITIVE CATEGORIES: BOOK TITLES & RESTAURANTS
console.log('\n6. SENSITIVE CATEGORIES AUDIT:');
const bookTitles = generateNames({ generatorId: 'book', quantity: 6 });
console.log('Book titles:', bookTitles.map((x) => x.name));

const restaurants = generateNames({ generatorId: 'restaurant', quantity: 6 });
console.log('Restaurants:', restaurants.map((x) => x.name));

console.log('\n=== AUDIT COMPLETE ===');
