import { AppSettings, GenLanguageCode, LanguageCode, TextSizeMode, ThemeMode } from '../types';

const SETTINGS_KEY = 'nameforge_settings';

export interface LanguageMeta {
  code: LanguageCode;
  label: string;
  native: string;
  dir: 'ltr' | 'rtl';
  flag: string;
  region?: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  // Langues majeures & européennes
  { code: 'fr', label: 'Français', native: 'Français', dir: 'ltr', flag: '🇫🇷', region: 'Europe' },
  { code: 'en', label: 'English', native: 'English', dir: 'ltr', flag: '🇬🇧', region: 'Europe' },
  { code: 'es', label: 'Espagnol', native: 'Español', dir: 'ltr', flag: '🇪🇸', region: 'Europe' },
  { code: 'de', label: 'Allemand', native: 'Deutsch', dir: 'ltr', flag: '🇩🇪', region: 'Europe' },
  { code: 'it', label: 'Italien', native: 'Italiano', dir: 'ltr', flag: '🇮🇹', region: 'Europe' },
  { code: 'pt', label: 'Portugais', native: 'Português', dir: 'ltr', flag: '🇵🇹', region: 'Europe' },
  { code: 'nl', label: 'Néerlandais', native: 'Nederlands', dir: 'ltr', flag: '🇳🇱', region: 'Europe' },
  { code: 'pl', label: 'Polonais', native: 'Polski', dir: 'ltr', flag: '🇵🇱', region: 'Europe' },
  { code: 'sv', label: 'Suédois', native: 'Svenska', dir: 'ltr', flag: '🇸🇪', region: 'Europe' },
  { code: 'da', label: 'Danois', native: 'Dansk', dir: 'ltr', flag: '🇩🇰', region: 'Europe' },
  { code: 'fi', label: 'Finnois', native: 'Suomi', dir: 'ltr', flag: '🇫🇮', region: 'Europe' },
  { code: 'no', label: 'Norvégien', native: 'Norsk', dir: 'ltr', flag: '🇳🇴', region: 'Europe' },
  { code: 'is', label: 'Islandais', native: 'Íslenska', dir: 'ltr', flag: '🇮🇸', region: 'Europe' },
  { code: 'cs', label: 'Tchèque', native: 'Čeština', dir: 'ltr', flag: '🇨🇿', region: 'Europe' },
  { code: 'sk', label: 'Slovaque', native: 'Slovenčina', dir: 'ltr', flag: '🇸🇰', region: 'Europe' },
  { code: 'hu', label: 'Hongrois', native: 'Magyar', dir: 'ltr', flag: '🇭🇺', region: 'Europe' },
  { code: 'ro', label: 'Roumain', native: 'Română', dir: 'ltr', flag: '🇷🇴', region: 'Europe' },
  { code: 'bg', label: 'Bulgare', native: 'Български', dir: 'ltr', flag: '🇧🇬', region: 'Europe' },
  { code: 'el', label: 'Grec', native: 'Ελληνικά', dir: 'ltr', flag: '🇬🇷', region: 'Europe' },
  { code: 'uk', label: 'Ukrainien', native: 'Українська', dir: 'ltr', flag: '🇺🇦', region: 'Europe' },
  { code: 'ru', label: 'Russe', native: 'Русский', dir: 'ltr', flag: '🇷🇺', region: 'Europe' },
  { code: 'be', label: 'Biélorusse', native: 'Беларуская', dir: 'ltr', flag: '🇧🇾', region: 'Europe' },
  { code: 'hr', label: 'Croate', native: 'Hrvatski', dir: 'ltr', flag: '🇭🇷', region: 'Europe' },
  { code: 'sr', label: 'Serbe', native: 'Српски', dir: 'ltr', flag: '🇷🇸', region: 'Europe' },
  { code: 'bs', label: 'Bosnien', native: 'Bosanski', dir: 'ltr', flag: '🇧🇦', region: 'Europe' },
  { code: 'sl', label: 'Slovène', native: 'Slovenščina', dir: 'ltr', flag: '🇸🇮', region: 'Europe' },
  { code: 'mk', label: 'Macédonien', native: 'Македонски', dir: 'ltr', flag: '🇲🇰', region: 'Europe' },
  { code: 'sq', label: 'Albanais', native: 'Shqip', dir: 'ltr', flag: '🇦🇱', region: 'Europe' },
  { code: 'et', label: 'Estonien', native: 'Eesti', dir: 'ltr', flag: '🇪🇪', region: 'Europe' },
  { code: 'lv', label: 'Letton', native: 'Latviešu', dir: 'ltr', flag: '🇱🇻', region: 'Europe' },
  { code: 'lt', label: 'Lituanien', native: 'Lietuvių', dir: 'ltr', flag: '🇱🇹', region: 'Europe' },
  { code: 'ca', label: 'Catalan', native: 'Català', dir: 'ltr', flag: '🇪🇸', region: 'Europe' },
  { code: 'eu', label: 'Basque', native: 'Euskara', dir: 'ltr', flag: '🇪🇸', region: 'Europe' },
  { code: 'gl', label: 'Galicien', native: 'Galego', dir: 'ltr', flag: '🇪🇸', region: 'Europe' },
  { code: 'ga', label: 'Irlandais', native: 'Gaeilge', dir: 'ltr', flag: '🇮🇪', region: 'Europe' },
  { code: 'cy', label: 'Gallois', native: 'Cymraeg', dir: 'ltr', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', region: 'Europe' },
  { code: 'mt', label: 'Maltais', native: 'Malti', dir: 'ltr', flag: '🇲🇹', region: 'Europe' },

  // Asie & Pacifique
  { code: 'ja', label: 'Japonais', native: '日本語', dir: 'ltr', flag: '🇯🇵', region: 'Asie' },
  { code: 'ko', label: 'Coréen', native: '한국어', dir: 'ltr', flag: '🇰🇷', region: 'Asie' },
  { code: 'zh', label: 'Chinois', native: '中文', dir: 'ltr', flag: '🇨🇳', region: 'Asie' },
  { code: 'vi', label: 'Vietnamien', native: 'Tiếng Việt', dir: 'ltr', flag: '🇻🇳', region: 'Asie' },
  { code: 'id', label: 'Indonésien', native: 'Bahasa Indonesia', dir: 'ltr', flag: '🇮🇩', region: 'Asie' },
  { code: 'ms', label: 'Malais', native: 'Bahasa Melayu', dir: 'ltr', flag: '🇲🇾', region: 'Asie' },
  { code: 'fil', label: 'Filipino', native: 'Filipino', dir: 'ltr', flag: '🇵🇭', region: 'Asie' },
  { code: 'th', label: 'Thaï', native: 'ไทย', dir: 'ltr', flag: '🇹🇭', region: 'Asie' },
  { code: 'lo', label: 'Lao', native: 'ພາສາລາວ', dir: 'ltr', flag: '🇱🇦', region: 'Asie' },
  { code: 'km', label: 'Khmer', native: 'ភាសាខ្មែរ', dir: 'ltr', flag: '🇰🇭', region: 'Asie' },
  { code: 'my', label: 'Birman', native: 'မြန်မာစာ', dir: 'ltr', flag: '🇲🇲', region: 'Asie' },
  { code: 'mn', label: 'Mongol', native: 'Монгол', dir: 'ltr', flag: '🇲🇳', region: 'Asie' },

  // Sous-continent Indien
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', dir: 'ltr', flag: '🇮🇳', region: 'Inde & Asie du Sud' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', dir: 'ltr', flag: '🇧🇩', region: 'Inde & Asie du Sud' },
  { code: 'pa', label: 'Pendjabi', native: 'ਪੰਜਾਬੀ', dir: 'ltr', flag: '🇮🇳', region: 'Inde & Asie du Sud' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', dir: 'ltr', flag: '🇮🇳', region: 'Inde & Asie du Sud' },
  { code: 'ta', label: 'Tamoul', native: 'தமிழ்', dir: 'ltr', flag: '🇮🇳', region: 'Inde & Asie du Sud' },
  { code: 'te', label: 'Télougou', native: 'తెలుగు', dir: 'ltr', flag: '🇮🇳', region: 'Inde & Asie du Sud' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', dir: 'ltr', flag: '🇮🇳', region: 'Inde & Asie du Sud' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', dir: 'ltr', flag: '🇮🇳', region: 'Inde & Asie du Sud' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ', dir: 'ltr', flag: '🇮🇳', region: 'Inde & Asie du Sud' },
  { code: 'ne', label: 'Népalais', native: 'नेपाली', dir: 'ltr', flag: '🇳🇵', region: 'Inde & Asie du Sud' },
  { code: 'si', label: 'Cinghalais', native: 'සිංහල', dir: 'ltr', flag: '🇱🇰', region: 'Inde & Asie du Sud' },

  // Moyen-Orient & Caucase (dont RTL)
  { code: 'ar', label: 'Arabe', native: 'العربية', dir: 'rtl', flag: '🇸🇦', region: 'Moyen-Orient' },
  { code: 'he', label: 'Hébreu', native: 'עברית', dir: 'rtl', flag: '🇮🇱', region: 'Moyen-Orient' },
  { code: 'fa', label: 'Persan', native: 'فارسی', dir: 'rtl', flag: '🇮🇷', region: 'Moyen-Orient' },
  { code: 'ur', label: 'Ourdou', native: 'اردو', dir: 'rtl', flag: '🇵🇰', region: 'Moyen-Orient' },
  { code: 'ps', label: 'Pachto', native: 'پښتو', dir: 'rtl', flag: '🇦🇫', region: 'Moyen-Orient' },
  { code: 'ku', label: 'Kurde', native: 'Kurdî', dir: 'ltr', flag: '🇹🇷', region: 'Moyen-Orient' },
  { code: 'tr', label: 'Turc', native: 'Türkçe', dir: 'ltr', flag: '🇹🇷', region: 'Moyen-Orient' },
  { code: 'az', label: 'Azerbaïdjanais', native: 'Azərbaycan', dir: 'ltr', flag: '🇦🇿', region: 'Moyen-Orient' },
  { code: 'hy', label: 'Arménien', native: 'Հայերեն', dir: 'ltr', flag: '🇦🇲', region: 'Moyen-Orient' },
  { code: 'ka', label: 'Géorgien', native: 'ქართული', dir: 'ltr', flag: '🇬🇪', region: 'Moyen-Orient' },
  { code: 'kk', label: 'Kazakh', native: 'Қазақша', dir: 'ltr', flag: '🇰🇿', region: 'Asie' },
  { code: 'uz', label: 'Ouzbek', native: 'Oʻzbekcha', dir: 'ltr', flag: '🇺🇿', region: 'Asie' },
  { code: 'ky', label: 'Kirghiz', native: 'Кыргызча', dir: 'ltr', flag: '🇰🇬', region: 'Asie' },
  { code: 'tk', label: 'Turkmène', native: 'Türkmençe', dir: 'ltr', flag: '🇹🇲', region: 'Asie' },

  // Afrique
  { code: 'sw', label: 'Swahili', native: 'Kiswahili', dir: 'ltr', flag: '🇰🇪', region: 'Afrique' },
  { code: 'am', label: 'Amharique', native: 'አማርኛ', dir: 'ltr', flag: '🇪🇹', region: 'Afrique' },
  { code: 'ti', label: 'Tigrinya', native: 'ትግርኛ', dir: 'ltr', flag: '🇪🇷', region: 'Afrique' },
  { code: 'yo', label: 'Yoruba', native: 'Èdè Yorùbá', dir: 'ltr', flag: '🇳🇬', region: 'Afrique' },
  { code: 'ig', label: 'Igbo', native: 'Asụsụ Igbo', dir: 'ltr', flag: '🇳🇬', region: 'Afrique' },
  { code: 'so', label: 'Somali', native: 'Soomaali', dir: 'ltr', flag: '🇸🇴', region: 'Afrique' },
  { code: 'af', label: 'Afrikaans', native: 'Afrikaans', dir: 'ltr', flag: '🇿🇦', region: 'Afrique' },
  { code: 'zu', label: 'Zoulou', native: 'isiZulu', dir: 'ltr', flag: '🇿🇦', region: 'Afrique' },
];

export function getAlphabeticalLanguages(): LanguageMeta[] {
  return [...SUPPORTED_LANGUAGES].sort((a, b) => {
    return a.label.localeCompare(b.label, 'fr', { sensitivity: 'base' });
  });
}

export const GEN_LANGUAGES: {
  code: GenLanguageCode;
  label: string;
  desc: string;
}[] = [
  { code: 'auto', label: 'Par défaut (Style)', desc: 'Adapté selon l\'archétype' },
  { code: 'fr', label: 'Français', desc: 'Sonorités élégantes et claires' },
  { code: 'en', label: 'English / Anglo', desc: 'Punchy, international' },
  { code: 'ja', label: 'Japonais / Anime', desc: 'Syllabes rythmées (Kae, Ryu, Shin)' },
  { code: 'ar', label: 'Arabe & Oriental', desc: 'Racines poétiques & nobles' },
  { code: 'latin', label: 'Latin & Elfique', desc: 'Mélodique, fluide, mythologique' },
  { code: 'nordic', label: 'Nordique & Runique', desc: 'Rocailleux, viking, percutant' },
  { code: 'tech', label: 'Cyber & Modern Tech', desc: 'Futuriste, néo-racines, syllabes courtes' },
  { code: 'es', label: 'Español', desc: 'Raíces y sonidos españoles' },
  { code: 'de', label: 'Deutsch', desc: 'Raíces germánicas y compuestos' },
  { code: 'it', label: 'Italiano', desc: 'Sonoridad italiana melódica' },
  { code: 'pt', label: 'Português', desc: 'Raíces y sonidos portugueses' },
  { code: 'tr', label: 'Türkçe', desc: 'Sonidos y raíces turcas' },
  { code: 'ko', label: '한국어', desc: 'Sílabas y nombres coreanos' },
  { code: 'zh', label: '中文', desc: 'Caracteres y nombres chinos' },
  { code: 'ru', label: 'Русский', desc: 'Raíces y sonidos eslavos' },
  { code: 'hi', label: 'हिन्दी', desc: 'Sonidos y raíces hindi' },
  { code: 'nl', label: 'Nederlands', desc: 'Klanken en Nederlandse woordstammen' },
  { code: 'pl', label: 'Polski', desc: 'Polskie brzmienia i rdzenie' },
  { code: 'sv', label: 'Svenska', desc: 'Svenska ljud och namnformer' },
  { code: 'vi', label: 'Tiếng Việt', desc: 'Âm tiết và gốc từ tiếng Việt' },
  { code: 'id', label: 'Bahasa Indonesia', desc: 'Bunyi dan akar kata Indonesia' },
  { code: 'th', label: 'ไทย', desc: 'พยางค์และชื่อภาษาไทย' },
  { code: 'el', label: 'Ελληνικά', desc: 'Ελληνικές ρίζες και ήχοι' },
  { code: 'he', label: 'עברית', desc: 'שורשים וצלילים בעברית' },
  { code: 'cs', label: 'Čeština', desc: 'České kořeny a zvuky' },
  { code: 'ro', label: 'Română', desc: 'Rădăcini și sunete românești' },
  { code: 'da', label: 'Dansk', desc: 'Danske lyde og navnerødder' },
  { code: 'fi', label: 'Suomi', desc: 'Suomalaiset äänteet ja nimijuuret' },
];

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  theme: 'dark',
  textSize: 'normal',
  reduceMotion: false,
  defaultGenLanguage: 'auto',
};

export function normalizeAppSettings(raw: unknown): AppSettings {
  const parsed = raw && typeof raw === 'object' ? raw as Partial<AppSettings> : {};
  const language = SUPPORTED_LANGUAGES.some((item) => item.code === parsed.language)
    ? parsed.language!
    : DEFAULT_SETTINGS.language;
  const theme: ThemeMode = parsed.theme === 'dark' || parsed.theme === 'light' || parsed.theme === 'system'
    ? parsed.theme
    : DEFAULT_SETTINGS.theme;
  const textSize: TextSizeMode = parsed.textSize === 'normal' || parsed.textSize === 'large' || parsed.textSize === 'compact'
    ? parsed.textSize
    : DEFAULT_SETTINGS.textSize;
  const defaultGenLanguage: GenLanguageCode = GEN_LANGUAGES.some((item) => item.code === parsed.defaultGenLanguage)
    ? parsed.defaultGenLanguage!
    : DEFAULT_SETTINGS.defaultGenLanguage;

  return {
    language,
    theme,
    textSize,
    reduceMotion: typeof parsed.reduceMotion === 'boolean'
      ? parsed.reduceMotion
      : DEFAULT_SETTINGS.reduceMotion,
    defaultGenLanguage,
  };
}

export function getAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return normalizeAppSettings(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveAppSettings(newSettings: Partial<AppSettings>): AppSettings {
  try {
    const current = getAppSettings();
    // Callers can pass runtime values that bypass TypeScript (e.g. stale UI state or imported data).
    // Normalize the merged object before persisting or applying it to the document.
    const updated = normalizeAppSettings({ ...current, ...newSettings });
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    applySettingsToDOM(updated);
    notifySettingsChange();
    return updated;
  } catch (e) {
    console.error('Failed to save settings', e);
    return DEFAULT_SETTINGS;
  }
}

let systemThemeListenerRegistered = false;

export function applySettingsToDOM(settings: AppSettings): void {
  if (typeof document === 'undefined') return;

  // Keep "System" mode live when the operating system theme changes mid-session.
  if (!systemThemeListenerRegistered && typeof window !== 'undefined' && window.matchMedia) {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const syncSystemTheme = () => {
      if (getAppSettings().theme === 'system') applySettingsToDOM(getAppSettings());
    };
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', syncSystemTheme);
    } else {
      // Compatibility with older Safari versions.
      media.addListener(syncSystemTheme);
    }
    systemThemeListenerRegistered = true;
  }
  const root = document.documentElement;

  // Language & Direction
  root.lang = settings.language;
  const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === settings.language);
  root.dir = langMeta?.dir || 'ltr';

  // Theme
  let isDark = true;
  if (settings.theme === 'light') {
    isDark = false;
  } else if (settings.theme === 'system') {
    isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  if (isDark) {
    root.classList.add('dark');
    root.classList.remove('light');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }

  // Text size
  root.classList.remove('text-size-compact', 'text-size-normal', 'text-size-large');
  root.classList.add(`text-size-${settings.textSize}`);

  // Reduce motion
  if (settings.reduceMotion) {
    root.classList.add('reduce-motion');
  } else {
    root.classList.remove('reduce-motion');
  }
}

export function subscribeToSettings(callback: (settings: AppSettings) => void): () => void {
  const handler = () => callback(getAppSettings());
  const storageHandler = (event: StorageEvent) => {
    // Synchronize settings changed in another tab without reacting to unrelated storage writes.
    if (event.key === SETTINGS_KEY || event.key === null) {
      const settings = getAppSettings();
      applySettingsToDOM(settings);
      callback(settings);
    }
  };

  window.addEventListener('nameforge:settings', handler);
  window.addEventListener('storage', storageHandler);
  return () => {
    window.removeEventListener('nameforge:settings', handler);
    window.removeEventListener('storage', storageHandler);
  };
}

function notifySettingsChange() {
  try {
    window.dispatchEvent(new CustomEvent('nameforge:settings'));
  } catch {
    // ignore
  }
}

/**
 * Resets all user local data cleanly
 */
export function resetAllLocalData(): void {
  const keysToRemove = [
    'nameforge_saved_names',
    'nameforge_collections',
    'nameforge_generation_history',
    'nameforge_recent_names',
  ];
  for (const k of keysToRemove) {
    localStorage.removeItem(k);
  }
  // Remove any rating items
  const allKeys = Object.keys(localStorage);
  for (const key of allKeys) {
    if (key.startsWith('nameforge_rating_')) {
      localStorage.removeItem(key);
    }
  }
  notifySettingsChange();
  window.dispatchEvent(new CustomEvent('nameforge:storage'));
}
