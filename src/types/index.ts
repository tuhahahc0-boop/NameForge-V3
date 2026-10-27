export type GeneratorId =
  // 11 Original Categories (Fantasy, Lore & Gaming)
  | 'fantasy'
  | 'anime'
  | 'rpg'
  | 'gaming'
  | 'dragon'
  | 'elf'
  | 'kingdom'
  | 'sci-fi'
  | 'vampire'
  | 'warrior'
  | 'wizard'
  // 10 Entreprises & Projets
  | 'brand'
  | 'business'
  | 'product'
  | 'startup'
  | 'shop'
  | 'domain'
  | 'app'
  | 'feature'
  | 'service'
  | 'slogan'
  // 10 Création & Divertissement
  | 'book'
  | 'character'
  | 'videogame'
  | 'guild'
  | 'youtube'
  | 'podcast'
  | 'handle'
  | 'community'
  | 'placename'
  | 'planet'
  // 5 Innovation & Idées
  | 'project'
  | 'framework'
  | 'event'
  | 'ai_bot'
  | 'culinary'
  // 15 Nouveaux Générateurs de Jeux & Systèmes (Total: 51)
  | 'gamertag'
  | 'boss'
  | 'weapon'
  | 'spell'
  | 'tavern'
  | 'dungeon'
  | 'starship'
  | 'mecha'
  | 'cyberpunk'
  | 'steampunk'
  | 'alien_species'
  | 'mythic_creature'
  | 'crypto_token'
  | 'server_cluster'
  | 'os_system'
  // Groupe A — Public Général & Professionnels (36)
  | 'baby_name'
  | 'pet_name'
  | 'restaurant'
  | 'coffee_shop'
  | 'bakery'
  | 'food_truck'
  | 'clothing_brand'
  | 'jewelry_brand'
  | 'cosmetics_brand'
  | 'fitness_studio'
  | 'travel_agency'
  | 'hotel_name'
  | 'real_estate'
  | 'architecture_studio'
  | 'interior_decor'
  | 'photo_studio'
  | 'wedding_planner'
  | 'festival_event'
  | 'webradio_station'
  | 'newsletter'
  | 'blog_name'
  | 'indie_game_studio'
  | 'streaming_channel'
  | 'publishing_house'
  | 'novel_series'
  | 'comic_manga_series'
  | 'band_name'
  | 'album_title'
  | 'song_title'
  | 'board_game'
  | 'sports_team'
  | 'educational_project'
  | 'charity_ngo'
  | 'coworking_space'
  | 'marketing_agency'
  | 'ecommerce_store'
  // Groupe B — Jeux, Anime & Univers Imaginaires (17)
  | 'anime_hero'
  | 'anime_rival'
  | 'fictional_mentor'
  | 'magical_girl'
  | 'mecha_pilot'
  | 'anime_school'
  | 'clan_name'
  | 'secret_order'
  | 'sky_citadel'
  | 'special_attack'
  | 'elemental_power'
  | 'bio_chimera'
  | 'monster_beast'
  | 'magic_relic'
  | 'interstellar_empire'
  | 'anime_faction'
  | 'spirit_guardian'
  // Groupe C — Informatique & Technologie (9)
  | 'software_tool'
  | 'browser_extension'
  | 'ai_agent_workflow'
  | 'opensource_project'
  | 'code_library'
  | 'api_service'
  | 'database_engine'
  | 'cloud_platform'
  | 'cyber_lab'
  // Groupe D — Mathématiques & Sciences (9)
  | 'math_app'
  | 'math_puzzle'
  | 'fictional_theorem'
  | 'geometric_object'
  | 'fractal_pattern'
  | 'number_system'
  | 'math_olympiad_team'
  | 'scientific_model'
  | 'science_popularization'
  // Groupe E — Autres Usages (12)
  | 'tactical_operation'
  | 'research_project'
  | 'hackathon_team'
  | 'creative_workshop'
  | 'online_course'
  | 'study_group'
  | 'sprint_ritual'
  | 'personal_portfolio'
  | 'local_association'
  | 'eco_initiative'
  | 'exotic_resort'
  | 'calendar_era'
  // Lot 1 : Batch F — Fantasy, Nature, Sci-Fi & Marques (50)
  | 'griffin_rider'
  | 'nordic_valkyrie'
  | 'celtic_druid'
  | 'abyssal_leviathan'
  | 'desert_djinn'
  | 'gargoyle_sentinel'
  | 'phoenix_flame'
  | 'enchanted_forest'
  | 'sacred_artifact'
  | 'undead_lich'
  | 'shadow_assassin_guild'
  | 'elemental_golem'
  | 'orbital_station'
  | 'cyber_hacker'
  | 'quantum_reactor'
  | 'terraformed_colony'
  | 'interstellar_corridor'
  | 'ai_megacorp'
  | 'cyborg_bounty_hunter'
  | 'exoplanet_biodome'
  | 'deep_space_probe'
  | 'plasma_weapon'
  | 'nanotech_swarm'
  | 'neural_interface'
  | 'dystopian_city_sector'
  | 'carnivorous_plant'
  | 'ancient_tree'
  | 'deep_sea_species'
  | 'arctic_creature'
  | 'tropical_rainforest'
  | 'crystal_mineral'
  | 'mountain_summit'
  | 'coral_reef'
  | 'wild_sanctuary'
  | 'volcanic_geyser'
  | 'desert_oasis'
  | 'luminescent_fungi'
  | 'predatory_raptor'
  | 'specialty_coffee'
  | 'artisanal_bakery'
  | 'luxury_perfume'
  | 'architect_firm'
  | 'eco_fashion'
  | 'creative_coworking'
  | 'cocktail_lounge'
  | 'game_dev_studio'
  | 'green_energy_corp'
  | 'microbrewery_craft'
  | 'fintech_app'
  | 'wellness_spa'
  // Lot 1 : Batch G — Personnages, Cités, Gaming & Savoirs (50)
  | 'detective_noir'
  | 'steampunk_inventor'
  | 'space_pirate'
  | 'alchemist_healer'
  | 'court_diplomat'
  | 'bounty_hunter_guild'
  | 'gladiator_champion'
  | 'wandering_bard'
  | 'cyber_medic'
  | 'royal_knight_order'
  | 'smuggler_pilot'
  | 'mystic_oracle'
  | 'vampire_coven'
  | 'floating_skyland'
  | 'dwarven_citadel'
  | 'elven_sanctuary'
  | 'sunken_atlantis'
  | 'desert_empire'
  | 'frozen_fjord'
  | 'pirate_haven'
  | 'merchant_crossroad'
  | 'haunted_manor'
  | 'magical_academy'
  | 'forbidden_wasteland'
  | 'ancient_pyramid_tomb'
  | 'esport_team_pro'
  | 'epic_quest_name'
  | 'legendary_armor'
  | 'magic_potion'
  | 'raid_dungeon_boss'
  | 'moba_champion'
  | 'survival_server'
  | 'tcg_card_spell'
  | 'speedrun_marathon'
  | 'loot_box_tier'
  | 'retro_arcade_cabinet'
  | 'mmorpg_server_realm'
  | 'deep_learning_model'
  | 'quantum_particle'
  | 'space_telescope'
  | 'cryptographic_protocol'
  | 'astronomy_constellation'
  | 'open_source_framework'
  | 'scientific_expedition'
  | 'literary_magazine'
  | 'experimental_cinema'
  | 'indie_music_label'
  | 'ted_talk_theme'
  | 'boardgame_title'
  | 'educational_escape_game'
  | (string & {});

export type GeneratorFamily =
  | 'fantasy'
  | 'business'
  | 'creative'
  | 'innovation'
  | 'scifi'
  | 'characters'
  | 'places'
  | 'creatures'
  | 'writing'
  | 'lifestyle'
  | 'culture'
  | 'tech'
  | (string & {});

export type LengthOption = 'short' | 'medium' | 'long';
export type FormatOption = 'title' | 'full' | 'group' | 'minimal' | 'compound';
export type GenderOption = 'any' | 'female' | 'male' | 'neutral';

export type LanguageCode =
  | 'fr' | 'en' | 'ar' | 'tr' | 'es' | 'de' | 'it' | 'pt' | 'ja' | 'ko'
  | 'zh' | 'ru' | 'hi' | 'nl' | 'pl' | 'sv' | 'vi' | 'id' | 'th' | 'el'
  | 'he' | 'cs' | 'ro' | 'da' | 'fi'
  | 'af' | 'sq' | 'am' | 'hy' | 'az' | 'eu' | 'be' | 'bn' | 'my' | 'bg'
  | 'ca' | 'si' | 'hr' | 'et' | 'fil' | 'ka' | 'cy' | 'hu' | 'is' | 'ig'
  | 'ga' | 'kn' | 'kk' | 'km' | 'ky' | 'lo' | 'lv' | 'lt' | 'mk' | 'ml'
  | 'mr' | 'mn' | 'ne' | 'no' | 'or' | 'uz' | 'pa' | 'fa' | 'sr' | 'sk'
  | 'sl' | 'sw' | 'ta' | 'te' | 'ti' | 'tk' | 'uk' | 'ur' | 'yo' | 'zu'
  | 'ms' | 'bs' | 'gl' | 'mt' | 'so' | 'ku' | 'ps' | 'yi'
  | (string & {});

export type GenLanguageCode =
  | 'auto'
  | 'fr' | 'en' | 'es' | 'de' | 'it' | 'pt' | 'ar' | 'tr' | 'ja' | 'ko'
  | 'zh' | 'ru' | 'hi' | 'nl' | 'pl' | 'sv' | 'vi' | 'id' | 'th' | 'el'
  | 'he' | 'cs' | 'ro' | 'da' | 'fi'
  | 'latin'
  | 'nordic'
  | 'tech';

export type ThemeMode = 'dark' | 'light' | 'system';
export type TextSizeMode = 'normal' | 'large' | 'compact';

export interface AppSettings {
  language: LanguageCode;
  theme: ThemeMode;
  textSize: TextSizeMode;
  reduceMotion: boolean;
  defaultGenLanguage: GenLanguageCode;
}

export interface GeneratedName {
  name: string;
  description: string;
  style: string;
  icon: string;
  bestFor: string;
  tone: string;
  generatorId: GeneratorId;
  // Professional details
  pronunciation?: string;
  strengths?: string[];
  watchouts?: string[];
  origin?: string;
  disclaimer?: string;
  meaning?: string;
  isAttested?: boolean;
  variants?: string[];
  gender?: GenderOption;
}

export interface NamedCollection {
  id: string;
  name: string;
  description: string;
  color?: string;
  createdAt: string;
}

export interface HistoryEntry {
  id: string;
  name: string;
  generator: GeneratorId | string;
  style: string;
  tone: string;
  description: string;
  bestFor: string;
  generatedAt: string;
}

export interface SavedNameEntry {
  id: string;
  name: string;
  generator: GeneratorId | string;
  style: string;
  saved: boolean;
  liked: boolean;
  note: string;
  collectionId?: string;
  rating?: number;
  createdAt: string;
}

export interface StyleOption {
  key: string;
  label: string;
  icon?: string;
  description?: string;
}

export interface AttestedNameItem {
  name: string;
  gender: GenderOption;
  origin: string;
  meaning: string;
  variants?: string[];
}

export interface SubcategoryData {
  label: string;
  icon: string;
  bestFor: string;
  prefixes: string[];
  suffixes: string[];
  middle?: string[];
  descriptions: string[];
  groupTypes?: string[];
  titles?: string[];
  femaleStarts?: string[];
  maleStarts?: string[];
  tone?: string;
  styleKey?: string;
  strengths?: string[];
  watchouts?: string[];
  disclaimer?: string;
  attestedItems?: AttestedNameItem[];
}

export interface GeneratorMeta {
  id: GeneratorId;
  title: string;
  shortTitle: string;
  icon: string;
  badge: string;
  h1a: string;
  h1b: string;
  description: string;
  generatorTitle: string;
  generatorSubtitle: string;
  category: GeneratorFamily;
  advantages?: string[];
  limits?: string[];
  guideTitle: string;
  guide: { h: string; p: string }[];
  cardsTitle: string;
  cards: { icon: string; h: string; p: string }[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  footer: string;
  legalDisclaimer?: string;
}

export interface StorageStats {
  total: number;
  saved: number;
  liked: number;
  notes: number;
  generators: number;
  collections: number;
  history: number;
}

export interface ExportBundle {
  version: number;
  appName: string;
  exportedAt: string;
  names: SavedNameEntry[];
  collections: NamedCollection[];
  history: HistoryEntry[];
  settings?: AppSettings;
}

export interface ImportResult {
  success: boolean;
  added: number;
  updated: number;
  skipped: number;
  errors: string[];
}
