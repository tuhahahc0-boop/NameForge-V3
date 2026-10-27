import { StyleOption, SubcategoryData } from '../types';
import { SUBCATEGORIES_DATA } from './subcategories';

export interface StyleDNA {
  tone: string;
  starts: string[];
  ends: string[];
}

export const NAMEFORGE_STYLES: [string, string][] = [
  ['assassin', '🗡️ Assassin de l’ombre'],
  ['warrior', '⚔️ Guerrier héroïque'],
  ['high-elf', '🧝 Haut-Né Elfe'],
  ['dwarf-defender', '⛏️ Défenseur nain'],
  ['dragonkin', '🐉 Dragonkin'],
  ['orc-berserker', '🪓 Berserker orc'],
  ['dark-elf', '🏹 Elfe noir (Drow)'],
  ['demon-lord', '😈 Seigneur Démon'],
  ['seraph', '🪽 Séraphin angélique'],
  ['noble-vampire', '🦇 Noble Vampire'],
  ['fantasy-kingdom', '👑 Royaume fantastique'],
  ['fantasy-tavern', '🍺 Taverne Fantastique'],
  ['legendary-weapon', '⚔️ Arme légendaire'],
  ['arcane-mage', '🔮 Mage arcanique'],
  ['necromancer', '💀 Nécromancien'],
  ['samurai', '🌸 Samouraï'],
  ['ranger', '🏹 Rôdeur forestier'],
  ['celestial', '✨ Céleste mystique'],
  ['pirate', '🏴‍☠️ Pirate légendaire'],
  ['royal', '👑 Noble royal'],
  ['shadow-rogue', '🌑 Voleur des ombres'],
];

export const STYLE_ALIASES: Record<string, string[]> = {
  assassin: ['assassin', 'ninja', 'rogue', 'dark', 'villain', 'hunter'],
  warrior: ['warrior', 'knight', 'hero', 'fighter', 'default'],
  'high-elf': ['high', 'royal', 'elf', 'hero', 'magic'],
  'dwarf-defender': ['dwarf', 'defender', 'warrior', 'knight', 'default'],
  dragonkin: ['dragon', 'dragonkin', 'fire', 'ancient', 'default'],
  'orc-berserker': ['orc', 'berserker', 'warrior', 'villain', 'default'],
  'dark-elf': ['dark', 'shadow', 'darkelf', 'villain', 'rogue'],
  'demon-lord': ['demon', 'dark', 'villain', 'darklord', 'default'],
  seraph: ['angel', 'celestial', 'healer', 'royal', 'magic'],
  'noble-vampire': ['noble', 'royal', 'vampire', 'ancient', 'default'],
  'fantasy-kingdom': ['royal', 'kingdom', 'enchanted', 'default'],
  'fantasy-tavern': ['tavern', 'fun', 'human', 'default'],
  'legendary-weapon': ['weapon', 'warrior', 'samurai', 'knight', 'default'],
  'arcane-mage': ['archmage', 'mage', 'magic', 'scholar', 'elemental', 'default'],
  necromancer: ['dark', 'necromancer', 'villain', 'demon', 'default'],
  samurai: ['samurai', 'warrior', 'hero', 'default'],
  ranger: ['ranger', 'wood', 'hunter', 'rogue', 'default'],
  celestial: ['celestial', 'magic', 'healer', 'royal', 'default'],
  pirate: ['pirate', 'rogue', 'adventurer', 'fun', 'default'],
  royal: ['royal', 'noble', 'kingdom', 'high', 'default'],
  'shadow-rogue': ['rogue', 'ninja', 'dark', 'villain', 'default'],
};

export const STYLE_DNA: Record<string, StyleDNA> = {
  assassin: {
    tone: 'Stealthy • sharp • mysterious',
    starts: ['Vex', 'Nyx', 'Rav', 'Zan', 'Kyr'],
    ends: ['is', 'rix', 'ven', 'shade', 'nox'],
  },
  warrior: {
    tone: 'Heroic • strong • legendary',
    starts: ['Kael', 'Thar', 'Ryn', 'Val', 'Gar'],
    ends: ['dor', 'ric', 'gar', 'orn', 'wyn'],
  },
  'high-elf': {
    tone: 'Elegant • ancient • melodic',
    starts: ['Ael', 'Cael', 'Elar', 'Fael', 'Syl'],
    ends: ['riel', 'wyn', 'eth', 'lith', 'iel'],
  },
  'dwarf-defender': {
    tone: 'Solid • ancestral • rugged',
    starts: ['Brom', 'Khar', 'Dur', 'Thar', 'Grom'],
    ends: ['grim', 'bek', 'dorn', 'karn', 'vark'],
  },
  dragonkin: {
    tone: 'Primal • ancient • powerful',
    starts: ['Vyr', 'Azh', 'Drak', 'Zor', 'Khal'],
    ends: ['rax', 'vyr', 'thar', 'ion', 'oth'],
  },
  'orc-berserker': {
    tone: 'Fierce • raw • warlike',
    starts: ['Gor', 'Rag', 'Urz', 'Krag', 'Drog'],
    ends: ['ak', 'ash', 'gor', 'ruk', 'grim'],
  },
  'dark-elf': {
    tone: 'Shadowy • refined • dangerous',
    starts: ['Nyr', 'Zal', 'Vey', 'Morn', 'Xyr'],
    ends: ['ith', 'rae', 'vyr', 'nox', 'ris'],
  },
  'demon-lord': {
    tone: 'Ominous • commanding • infernal',
    starts: ['Mal', 'Khar', 'Zul', 'Vex', 'Azr'],
    ends: ['gath', 'zar', 'oth', 'mord', 'iel'],
  },
  seraph: {
    tone: 'Radiant • noble • celestial',
    starts: ['Ari', 'Ely', 'Ser', 'Cael', 'Lumi'],
    ends: ['iel', 'ora', 'ion', 'ael', 'eth'],
  },
  'noble-vampire': {
    tone: 'Gothic • aristocratic • immortal',
    starts: ['Val', 'Luc', 'Alar', 'Vey', 'Sel'],
    ends: ['ian', 'vain', 'mont', 'ius', 'elle'],
  },
  'fantasy-kingdom': {
    tone: 'Grand • royal • geographical',
    starts: ['Alder', 'Val', 'Eld', 'Silver', 'Aure'],
    ends: ['ia', 'oria', 'mere', 'mont', 'reach'],
  },
  'fantasy-tavern': {
    tone: 'Warm • rustic • memorable',
    starts: ['Golden', 'Silver', 'Moon', 'Laughing', 'Red'],
    ends: ['Tankard', 'Stag', 'Dragon', 'Fox', 'Hearth'],
  },
  'legendary-weapon': {
    tone: 'Mythic • ceremonial • iconic',
    starts: ['Star', 'Dawn', 'Storm', 'Frost', 'Ember'],
    ends: ['fall', 'song', 'bane', 'heart', 'edge'],
  },
  'arcane-mage': {
    tone: 'Arcane • scholarly • mystical',
    starts: ['Balth', 'Eld', 'Zeph', 'Arcan', 'Merv'],
    ends: ['azar', 'ius', 'mir', 'dor', 'ion'],
  },
  necromancer: {
    tone: 'Dark • ancient • forbidden',
    starts: ['Nek', 'Mor', 'Vhal', 'Grim', 'Seth'],
    ends: ['gath', 'lich', 'mord', 'zar', 'oth'],
  },
  samurai: {
    tone: 'Disciplined • elegant • traditional',
    starts: ['Ren', 'Jin', 'Hiro', 'Taka', 'Ryu'],
    ends: ['mori', 'sai', 'ken', 'to', 'hiro'],
  },
  ranger: {
    tone: 'Natural • quiet • adventurous',
    starts: ['Fen', 'Ryn', 'Syl', 'Ery', 'Thal'],
    ends: ['wyn', 'wood', 'thorn', 'iel', 'ran'],
  },
  celestial: {
    tone: 'Cosmic • luminous • serene',
    starts: ['Astra', 'Sol', 'Luma', 'Cael', 'Ori'],
    ends: ['ion', 'ara', 'iel', 'is', 'ora'],
  },
  pirate: {
    tone: 'Adventurous • bold • roguish',
    starts: ['Red', 'Black', 'Cap', 'Storm', 'Sea'],
    ends: ['hook', 'tide', 'wake', 'beard', 'wind'],
  },
  royal: {
    tone: 'Noble • prestigious • regal',
    starts: ['Aure', 'Val', 'Eld', 'Cael', 'Ser'],
    ends: ['mont', 'mere', 'ric', 'ion', 'ria'],
  },
  'shadow-rogue': {
    tone: 'Cunning • elusive • dark',
    starts: ['Shade', 'Nyx', 'Rav', 'Vel', 'Nox'],
    ends: ['ren', 'veil', 'rix', 'is', 'bane'],
  },
};

export const CATEGORY_SPECIFIC_STYLES: Record<string, [string, string][]> = {
  brand: [
    ['luxury', '💎 Luxe & Prestige'],
    ['tech', '⚡ Tech & Moderne'],
    ['lifestyle', '🌿 Lifestyle & Éco'],
    ['default', '✨ Marque Générale'],
  ],
  business: [
    ['consulting', '📊 Conseil & Stratégie'],
    ['industrial', '🏗️ Industrie & Ingénierie'],
    ['default', '🏢 Dénomination Corporative'],
  ],
  product: [
    ['gadget', '⚡ Hardware & Gadgets'],
    ['sport', '🏃 Sport & Performance'],
    ['default', '📦 Produit Universel'],
  ],
  startup: [
    ['ai', '🤖 IA & DeepTech'],
    ['fintech', '💳 FinTech & Finance'],
    ['default', '🚀 Tech & SaaS'],
  ],
  shop: [
    ['boutique', '👗 Boutique & Mode'],
    ['cafe', '☕ Café & Torréfaction'],
    ['default', '🛍️ Commerce de Proximité'],
  ],
  domain: [
    ['brandable', '🌐 Brandable .com'],
    ['tech', '⚡ Tech .io & .ai'],
    ['default', '🌍 Adresse Web Universelle'],
  ],
  app: [
    ['productivity', '⚡ Productivité & Outils'],
    ['social', '💬 Social & Messagerie'],
    ['default', '📱 Application Smartphone'],
  ],
  feature: [
    ['smart', '🧠 Smart & IA'],
    ['security', '🔒 Sécurité & Contrôle'],
    ['default', '⚙️ Fonctionnalité Clé'],
  ],
  service: [
    ['premium', '⭐ Prestige & Conciergerie'],
    ['audit', '🔍 Audit & Diagnostic'],
    ['default', '🤝 Forfait Commercial'],
  ],
  slogan: [
    ['action', '⚡ Action Directe'],
    ['vision', '💡 Vision & Promesse'],
    ['default', '📣 Accroche Culte'],
  ],
  book: [
    ['thriller', '🔍 Thriller & Suspense'],
    ['fantasy', '⚔️ Épopée & Fantasy'],
    ['default', '📚 Titre Littéraire'],
  ],
  character: [
    ['protagonist', '🌟 Protagoniste Valeureux'],
    ['antagonist', '🎭 Antagoniste Complexe'],
    ['default', '👤 Personnage Roman'],
  ],
  videogame: [
    ['action', '💥 Action & Frénésie'],
    ['indie', '🌾 Indépendant & Poétique'],
    ['default', '🕹️ Titre Vidéoludique'],
  ],
  guild: [
    ['raid', '⚔️ Guilde PvE & Raid'],
    ['pvp', '🩸 Clan PvP & Arènes'],
    ['default', '🛡️ Bannière de Confrérie'],
  ],
  youtube: [
    ['tech', '💻 Tech & Déballage'],
    ['gaming', '🎮 Gaming & Fun'],
    ['default', '📹 Chaîne Vidéo'],
  ],
  podcast: [
    ['talk', '☕ Talk-Show & Intimité'],
    ['growth', '💡 Croissance & Business'],
    ['default', '🎙️ Émission Audio'],
  ],
  handle: [
    ['cyber', '⚡ Cyber & Minimal'],
    ['aesthetic', '🌸 Aesthetic & Poétique'],
    ['default', '✨ Pseudonyme Universel'],
  ],
  community: [
    ['hub', '🌍 Hub & Foyer Créatif'],
    ['default', '🤝 Collectif & Club'],
  ],
  placename: [
    ['coastal', '⛵ Ports & Îles'],
    ['mountain', '🏔️ Pics & Forteresses'],
    ['default', '🗺️ Cités & Terres'],
  ],
  planet: [
    ['terrestrial', '🪐 Monde Tellurique'],
    ['gas', '🌀 Géante Gazeuse'],
    ['default', '🌌 Système Céleste'],
  ],
  project: [
    ['secret', '🔒 Codename Secret'],
    ['default', '🎯 Projet d’Entreprise'],
  ],
  framework: [
    ['method', '📐 Méthode & Matrice'],
    ['default', '📊 Système Conceptuel'],
  ],
  event: [
    ['summit', '🎤 Sommet & Plénière'],
    ['festival', '🎨 Festival & Célébration'],
    ['default', '🎪 Grand Rassemblement'],
  ],
  ai_bot: [
    ['assistant', '💬 Copilote Bienveillant'],
    ['autonomous', '🦾 Agent Autonome'],
    ['default', '🤖 Intelligence Artificielle'],
  ],
  culinary: [
    ['gourmet', '🍷 Haute Gastronomie'],
    ['cocktail', '🍸 Cocktail Signature'],
    ['default', '🍲 Plat de Tradition'],
  ],
};

export function getStyleOptions(generatorId?: string): StyleOption[] {
  if (generatorId && CATEGORY_SPECIFIC_STYLES[generatorId]) {
    return CATEGORY_SPECIFIC_STYLES[generatorId].map(([key, label]) => ({
      key,
      label,
      icon: label.split(' ')[0],
    }));
  }
  if (generatorId && SUBCATEGORIES_DATA[generatorId]) {
    const subcats = SUBCATEGORIES_DATA[generatorId];
    const keys = Object.keys(subcats);
    if (keys.length > 0) {
      return keys.map((k) => ({
        key: k,
        label: `${subcats[k].icon || '✨'} ${subcats[k].label || k}`,
        icon: subcats[k].icon || '✨',
      }));
    }
  }
  return NAMEFORGE_STYLES.map(([key, label]) => ({
    key,
    label,
    icon: label.split(' ')[0],
  }));
}

export function resolveStyleData(
  generatorId: string,
  key: string,
  categoryData: Record<string, Record<string, SubcategoryData>>
): SubcategoryData {
  const group = categoryData[generatorId] || {};

  // Check direct key match first
  if (group[key]) {
    return {
      ...group[key],
      styleKey: key,
    };
  }

  const aliases = STYLE_ALIASES[key] || [];
  let chosen: SubcategoryData | null = null;

  for (const alias of aliases) {
    if (group[alias]) {
      chosen = group[alias];
      break;
    }
  }

  if (!chosen) {
    chosen = group.default || group[Object.keys(group)[0]] || {
      label: 'Fantasy',
      icon: '✨',
      bestFor: 'characters and fictional worlds',
      prefixes: ['Ael', 'Kael', 'Thar', 'Ryn', 'Val'],
      suffixes: ['dor', 'mir', 'ric', 'wyn', 'gar'],
      descriptions: ['✨ A versatile NameForge character name.'],
    };
  }

  const dna = STYLE_DNA[key];
  const hasCustomVocabulary =
    (chosen.prefixes && chosen.prefixes.length > 0) ||
    (chosen.suffixes && chosen.suffixes.length > 0);

  const merged: SubcategoryData = {
    ...chosen,
    prefixes: hasCustomVocabulary
      ? chosen.prefixes
      : dna
      ? dna.starts
      : ['Nova', 'Kaly', 'Velo', 'Aero', 'Zeta', 'Sol'],
    suffixes: hasCustomVocabulary
      ? chosen.suffixes
      : dna
      ? dna.ends
      : ['is', 'or', 'ex', 'flow', 'craft', 'wave'],
    tone: chosen.tone || (dna ? dna.tone : 'Moderne • distinctif • équilibré'),
    styleKey: key,
    attestedItems: chosen.attestedItems,
  };

  const styleTuple = NAMEFORGE_STYLES.find((x) => x[0] === key);
  if (styleTuple) {
    const rawLabel = styleTuple[1];
    merged.label = chosen.label || rawLabel.replace(/^\S+\s/, '');
    merged.icon = chosen.icon || rawLabel.split(' ')[0] || '✨';
  }

  return merged;
}

