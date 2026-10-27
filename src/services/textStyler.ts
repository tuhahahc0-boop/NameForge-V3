/**
 * NameForge Text Styler & Typography Workshop Engine
 * Provides Unicode transformations, visual CSS effects, texture fills,
 * clipping masks, and canvas HD image exports.
 */

export interface UnicodeStyleOption {
  id: string;
  name: string;
  category: 'formal' | 'creative' | 'gothic' | 'symbols' | 'fun';
  sample: string;
  transform: (text: string) => string;
}

export interface VisualEffectOption {
  id: string;
  name: string;
  category: 'neon' | 'metallic' | 'cosmic' | 'retro' | 'elemental';
  description: string;
  cssStyle: React.CSSProperties;
  gradientCSS: string;
  textShadowCSS: string;
  bgColor: string;
}

export interface TextureFillOption {
  id: string;
  name: string;
  patternType: 'gradient' | 'pattern' | 'mesh';
  previewGradient: string;
  canvasDrawer: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
  cssBackground: string;
}

/* =====================================================================
   1. UNICODE CHAR MAPPINGS & TRANSFORMS
   ===================================================================== */

const CHAR_MAPS: Record<string, { upper: number; lower: number; digits?: number }> = {
  boldSerif: { upper: 0x1d400, lower: 0x1d41a, digits: 0x1d7ce },
  boldSans: { upper: 0x1d5d4, lower: 0x1d5ee, digits: 0x1d7ec },
  italicSerif: { upper: 0x1d434, lower: 0x1d44e },
  italicSans: { upper: 0x1d608, lower: 0x1d622 },
  boldItalic: { upper: 0x1d468, lower: 0x1d482 },
  fraktur: { upper: 0x1d504, lower: 0x1d51e },
  boldFraktur: { upper: 0x1d56c, lower: 0x1d586 },
  script: { upper: 0x1d49c, lower: 0x1d4b6 },
  boldScript: { upper: 0x1d4d0, lower: 0x1d4ea },
  doubleStruck: { upper: 0x1d538, lower: 0x1d552, digits: 0x1d7d8 },
  monospace: { upper: 0x1d670, lower: 0x1d68a, digits: 0x1d7f6 },
};

// Exceptional code points in Unicode math blocks
const UNICODE_EXCEPTIONS: Record<string, Record<string, string>> = {
  italicSerif: { h: 'ℎ' },
  script: {
    B: 'ℬ',
    E: 'ℰ',
    F: 'ℱ',
    H: 'ℋ',
    I: 'ℐ',
    L: 'ℒ',
    M: 'ℳ',
    R: 'ℛ',
    e: 'ℯ',
    g: 'ℊ',
    o: 'ℴ',
  },
  fraktur: {
    C: 'ℭ',
    H: 'ℌ',
    I: 'ℑ',
    R: 'ℜ',
    Z: 'ℨ',
  },
  doubleStruck: {
    C: 'ℂ',
    H: 'ℍ',
    N: 'ℕ',
    P: 'ℙ',
    Q: 'ℚ',
    R: 'ℝ',
    Z: 'ℤ',
  },
};

function mapChars(
  text: string,
  styleKey: string,
  fallbackMap?: (c: string) => string
): string {
  const config = CHAR_MAPS[styleKey];
  const exceptions = UNICODE_EXCEPTIONS[styleKey] || {};

  return Array.from(text)
    .map((char) => {
      if (exceptions[char]) return exceptions[char];
      if (fallbackMap) {
        const mapped = fallbackMap(char);
        if (mapped !== char) return mapped;
      }

      const code = char.charCodeAt(0);

      // Uppercase A-Z (65-90)
      if (config && code >= 65 && code <= 90) {
        return String.fromCodePoint(config.upper + (code - 65));
      }
      // Lowercase a-z (97-122)
      if (config && code >= 97 && code <= 122) {
        return String.fromCodePoint(config.lower + (code - 97));
      }
      // Digits 0-9 (48-57)
      if (config && config.digits && code >= 48 && code <= 57) {
        return String.fromCodePoint(config.digits + (code - 48));
      }

      return char;
    })
    .join('');
}

// Small Caps dictionary
const SMALL_CAPS_MAP: Record<string, string> = {
  a: 'ᴀ',
  b: 'ʙ',
  c: 'ᴄ',
  d: 'ᴅ',
  e: 'ᴇ',
  f: 'ꜰ',
  g: 'ɢ',
  h: 'ʜ',
  i: 'ɪ',
  j: 'ᴊ',
  k: 'ᴋ',
  l: 'ʟ',
  m: 'ᴍ',
  n: 'ɴ',
  o: 'ᴏ',
  p: 'ᴘ',
  q: 'ǫ',
  r: 'ʀ',
  s: 's',
  t: 'ᴛ',
  u: 'ᴜ',
  v: 'ᴠ',
  w: 'ᴡ',
  x: 'x',
  y: 'ʏ',
  z: 'ᴢ',
};

// Circled characters
function toCircled(text: string): string {
  return Array.from(text)
    .map((c) => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x24b6 + (code - 65));
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x24d0 + (code - 97));
      if (code >= 49 && code <= 57) return String.fromCodePoint(0x2460 + (code - 49));
      if (code === 48) return '⓪';
      return c;
    })
    .join('');
}

// Squared characters
function toSquared(text: string): string {
  return Array.from(text)
    .map((c) => {
      const code = c.toUpperCase().charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x1f130 + (code - 65));
      return c;
    })
    .join('');
}

// Inverted Upside Down
const INVERTED_MAP: Record<string, string> = {
  a: 'ɐ',
  b: 'q',
  c: 'ɔ',
  d: 'p',
  e: 'ǝ',
  f: 'ɟ',
  g: 'ƃ',
  h: 'ɥ',
  i: 'ᴉ',
  j: 'ɾ',
  k: 'ʞ',
  l: 'l',
  m: 'ɯ',
  n: 'u',
  o: 'o',
  p: 'd',
  q: 'b',
  r: 'ɹ',
  s: 's',
  t: 'ʇ',
  u: 'n',
  v: 'ʌ',
  w: 'ʍ',
  x: 'x',
  y: 'ʎ',
  z: 'z',
  A: '∀',
  B: '𐐒',
  C: 'Ɔ',
  D: 'ᗡ',
  E: 'Ǝ',
  F: 'Ⅎ',
  G: '⅁',
  H: 'H',
  I: 'I',
  J: 'ſ',
  K: 'ʞ',
  L: '˥',
  M: 'W',
  N: 'N',
  O: 'O',
  P: 'Ԁ',
  Q: 'Ò',
  R: 'ᴚ',
  S: 'S',
  T: '⊥',
  U: '∩',
  V: 'Λ',
  W: 'M',
  X: 'X',
  Y: '⅄',
  Z: 'Z',
  '1': '⇂',
  '2': 'ᄅ',
  '3': 'Ɛ',
  '4': 'ㄣ',
  '5': 'ϛ',
  '6': '9',
  '7': 'ㄥ',
  '8': '8',
  '9': '6',
  '0': '0',
  '?': '¿',
  '!': '¡',
  '.': '˙',
  ',': "'",
  '&': '⅋',
};

function toInverted(text: string): string {
  return Array.from(text)
    .reverse()
    .map((c) => INVERTED_MAP[c] || c)
    .join('');
}

// Combining marks (Strikethrough, Underline, Slash)
function toCombining(text: string, markCode: number): string {
  const mark = String.fromCodePoint(markCode);
  return Array.from(text)
    .map((c) => (c === ' ' ? ' ' : `${c}${mark}`))
    .join('');
}

// Fullwidth Vaporwave
function toFullwidth(text: string): string {
  return Array.from(text)
    .map((c) => {
      const code = c.charCodeAt(0);
      if (code === 32) return '　';
      if (code >= 33 && code <= 126) return String.fromCodePoint(code + 65248);
      return c;
    })
    .join('');
}

export const UNICODE_STYLES: UnicodeStyleOption[] = [
  {
    id: 'bold-sans',
    name: 'Bold Sans Modern',
    category: 'formal',
    sample: '𝗕𝗼𝗹𝗱 𝗦𝗮𝗻𝘀',
    transform: (t) => mapChars(t, 'boldSans'),
  },
  {
    id: 'bold-serif',
    name: 'Bold Serif Classic',
    category: 'formal',
    sample: '𝐁𝐨𝐥𝐝 𝐒𝐞𝐫𝐢𝐟',
    transform: (t) => mapChars(t, 'boldSerif'),
  },
  {
    id: 'italic-sans',
    name: 'Italic Sans Dynamic',
    category: 'formal',
    sample: '𝘐𝘵𝘢𝘭𝘪𝘤 𝘚𝘢𝘯𝘴',
    transform: (t) => mapChars(t, 'italicSans'),
  },
  {
    id: 'bold-italic',
    name: 'Bold Italic Impact',
    category: 'formal',
    sample: '𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄',
    transform: (t) => mapChars(t, 'boldItalic'),
  },
  {
    id: 'script',
    name: 'Calligraphy Script',
    category: 'creative',
    sample: '𝒮𝒸𝓇𝒾𝓅𝓉 ℰ𝓁ℯℊ𝒶𝓃𝓉',
    transform: (t) => mapChars(t, 'script'),
  },
  {
    id: 'bold-script',
    name: 'Bold Calligraphy',
    category: 'creative',
    sample: '𝓑𝓸𝓵𝓭 𝓢𝓬𝓻𝓲𝓹𝓽',
    transform: (t) => mapChars(t, 'boldScript'),
  },
  {
    id: 'fraktur',
    name: 'Gothic Fraktur',
    category: 'gothic',
    sample: '𝔉𝔯𝔞𝔨𝔱𝔲𝔯 𝔐𝔶𝔰𝔱𝔦𝔮𝔲𝔢',
    transform: (t) => mapChars(t, 'fraktur'),
  },
  {
    id: 'bold-fraktur',
    name: 'Dark Gothic Heavy',
    category: 'gothic',
    sample: '𝕭𝖔𝖑𝖉 𝕲𝖔𝖙𝖍𝖎𝖈',
    transform: (t) => mapChars(t, 'boldFraktur'),
  },
  {
    id: 'double-struck',
    name: 'Blackboard Double',
    category: 'creative',
    sample: '𝔻𝕠𝕦𝕓𝕝𝕖 𝕊𝕥𝕣𝕦𝕔𝕜',
    transform: (t) => mapChars(t, 'doubleStruck'),
  },
  {
    id: 'monospace',
    name: 'Monospace Code',
    category: 'formal',
    sample: '𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎 𝚃𝚎𝚌𝚑',
    transform: (t) => mapChars(t, 'monospace'),
  },
  {
    id: 'small-caps',
    name: 'Small Capitals',
    category: 'formal',
    sample: 'ꜱᴍᴀʟʟ ᴄᴀᴘɪᴛᴀʟꜱ',
    transform: (t) =>
      Array.from(t.toLowerCase())
        .map((c) => SMALL_CAPS_MAP[c] || c)
        .join(''),
  },
  {
    id: 'circled',
    name: 'Circled Letters',
    category: 'symbols',
    sample: 'Ⓒⓘⓡⓒⓛⓔⓓ',
    transform: toCircled,
  },
  {
    id: 'squared',
    name: 'Squared Boxed',
    category: 'symbols',
    sample: '🅂🅀🅄🄰🅁🄴🄳',
    transform: toSquared,
  },
  {
    id: 'strikethrough',
    name: 'Strikethrough',
    category: 'fun',
    sample: 'S̶t̶r̶i̶k̶e̶',
    transform: (t) => toCombining(t, 0x0336),
  },
  {
    id: 'underline',
    name: 'Double Underline',
    category: 'formal',
    sample: 'U̲n̲d̲e̲r̲l̲i̲n̲e̲',
    transform: (t) => toCombining(t, 0x0332),
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave Fullwidth',
    category: 'fun',
    sample: 'Ｆｕｌｌｗｉｄｔｈ',
    transform: toFullwidth,
  },
  {
    id: 'inverted',
    name: 'Upside Down Flip',
    category: 'fun',
    sample: 'uʍop ǝpᴉsd∩',
    transform: toInverted,
  },
  {
    id: 'wings-royal',
    name: 'Royal Wings Emblem',
    category: 'symbols',
    sample: '꧁༺ Name ༻꧂',
    transform: (t) => `꧁༺ ${t} ༻꧂`,
  },
  {
    id: 'sword-shield',
    name: 'Cyber Knight Blades',
    category: 'symbols',
    sample: '⚔️ ⟪ Name ⟫ ⚔️',
    transform: (t) => `⚔️ ⟪ ${t} ⟫ ⚔️`,
  },
  {
    id: 'star-burst',
    name: 'Cosmic Constellation',
    category: 'symbols',
    sample: '✧･ﾟ: *✧ Name ✧*:･ﾟ✧',
    transform: (t) => `✧･ﾟ: *✧ ${t} ✧*:･ﾟ✧`,
  },
  {
    id: 'gamer-biohazard',
    name: 'Gamer Hazard Tag',
    category: 'symbols',
    sample: '☣︎ ⚡︎ Name ⚡︎ ☣︎',
    transform: (t) => `☣︎ ⚡︎ ${t} ⚡︎ ☣︎`,
  },
  {
    id: 'japanese-brackets',
    name: 'Japanese Focus Box',
    category: 'symbols',
    sample: '【 Name 】',
    transform: (t) => `【 ${t} 】`,
  },
];

/* =====================================================================
   2. VISUAL CSS PRESETS & GLOWS
   ===================================================================== */

export const VISUAL_EFFECTS: VisualEffectOption[] = [
  {
    id: 'cyber-neon',
    name: 'Cyber Neon Pulse',
    category: 'neon',
    description: 'Halo électroluminescent cyan & pourpre avec rétro-éclairage intense',
    gradientCSS: 'linear-gradient(135deg, #00f0ff 0%, #d946ef 50%, #8b5cf6 100%)',
    textShadowCSS:
      '0 0 10px rgba(0, 240, 255, 0.8), 0 0 20px rgba(0, 240, 255, 0.5), 0 0 35px rgba(217, 70, 239, 0.6), 0 0 50px rgba(139, 92, 246, 0.4)',
    bgColor: '#050714',
    cssStyle: {
      background: 'linear-gradient(135deg, #00f0ff 0%, #d946ef 50%, #8b5cf6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 0 14px rgba(0, 240, 255, 0.7)) drop-shadow(0 0 28px rgba(217, 70, 239, 0.5))',
    },
  },
  {
    id: 'pure-gold',
    name: 'Or Massif & Platine',
    category: 'metallic',
    description: 'Reflets métalliques dorés avec specular highlights et biseau précieux',
    gradientCSS: 'linear-gradient(180deg, #fff7ed 0%, #fde047 25%, #ca8a04 55%, #fef08a 80%, #854d0e 100%)',
    textShadowCSS: '0 2px 4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(234, 179, 8, 0.4)',
    bgColor: '#0c0a09',
    cssStyle: {
      background: 'linear-gradient(180deg, #fff7ed 0%, #fde047 25%, #ca8a04 55%, #fef08a 80%, #854d0e 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 4px 12px rgba(202, 138, 4, 0.45)) drop-shadow(0 1px 2px rgba(0,0,0,0.9))',
    },
  },
  {
    id: 'chrome-titanium',
    name: 'Chrome & Titane Liquide',
    category: 'metallic',
    description: 'Miroir argenté avec contraste tranchant et éclats métalliques',
    gradientCSS: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 30%, #475569 50%, #94a3b8 70%, #ffffff 100%)',
    textShadowCSS: '0 2px 8px rgba(0, 0, 0, 0.9), 0 0 15px rgba(255, 255, 255, 0.3)',
    bgColor: '#090d16',
    cssStyle: {
      background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 30%, #475569 50%, #94a3b8 70%, #ffffff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 3px 10px rgba(148, 163, 184, 0.5))',
    },
  },
  {
    id: 'magma-fire',
    name: 'Braises & Magma Épique',
    category: 'elemental',
    description: 'Chaleur incandescente du cœur volcanique avec aura de flammes',
    gradientCSS: 'linear-gradient(180deg, #fef08a 0%, #f97316 35%, #ef4444 70%, #7f1d1d 100%)',
    textShadowCSS: '0 0 12px rgba(249, 115, 22, 0.8), 0 0 25px rgba(239, 68, 68, 0.6), 0 0 45px rgba(185, 28, 28, 0.4)',
    bgColor: '#0f0505',
    cssStyle: {
      background: 'linear-gradient(180deg, #fef08a 0%, #f97316 35%, #ef4444 70%, #7f1d1d 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 0 16px rgba(249, 115, 22, 0.75)) drop-shadow(0 0 32px rgba(220, 38, 38, 0.5))',
    },
  },
  {
    id: 'cosmic-nebula',
    name: 'Nébuleuse Galactique',
    category: 'cosmic',
    description: 'Dégradé d’aurore céleste indigo, violet profond et bleu azur',
    gradientCSS: 'linear-gradient(135deg, #c084fc 0%, #818cf8 35%, #38bdf8 70%, #a855f7 100%)',
    textShadowCSS: '0 0 15px rgba(192, 132, 252, 0.6), 0 0 30px rgba(56, 189, 248, 0.4)',
    bgColor: '#06071a',
    cssStyle: {
      background: 'linear-gradient(135deg, #c084fc 0%, #818cf8 35%, #38bdf8 70%, #a855f7 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 0 18px rgba(168, 85, 247, 0.6))',
    },
  },
  {
    id: 'emerald-acid',
    name: 'Émeraude Toxique & Matrix',
    category: 'elemental',
    description: 'Fluorescence radioactive vert pomme et menthe astrale',
    gradientCSS: 'linear-gradient(135deg, #86efac 0%, #22c55e 50%, #15803d 100%)',
    textShadowCSS: '0 0 12px rgba(74, 222, 128, 0.8), 0 0 30px rgba(34, 197, 94, 0.5)',
    bgColor: '#031208',
    cssStyle: {
      background: 'linear-gradient(135deg, #86efac 0%, #22c55e 50%, #15803d 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 0 14px rgba(34, 197, 94, 0.7))',
    },
  },
  {
    id: 'synthwave-sunset',
    name: 'Synthwave 80s Sunset',
    category: 'retro',
    description: 'Atmosphère néo-rétro outrun rose fuchsia et soleil couchant orangé',
    gradientCSS: 'linear-gradient(180deg, #f43f5e 0%, #ec4899 45%, #f59e0b 80%, #fbbf24 100%)',
    textShadowCSS: '0 0 15px rgba(244, 63, 94, 0.7), 0 0 30px rgba(245, 158, 11, 0.5)',
    bgColor: '#14061a',
    cssStyle: {
      background: 'linear-gradient(180deg, #f43f5e 0%, #ec4899 45%, #f59e0b 80%, #fbbf24 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 0 16px rgba(244, 63, 94, 0.65)) drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
    },
  },
  {
    id: 'holographic-glitch',
    name: 'Hologramme Chromatique',
    category: 'neon',
    description: 'Séparation spectrale RVB avec liserés cyan & magenta cyberpunk',
    gradientCSS: 'linear-gradient(90deg, #38bdf8 0%, #f472b6 50%, #a78bfa 100%)',
    textShadowCSS: '-2px -1px 0px rgba(0, 240, 255, 0.9), 2px 1px 0px rgba(255, 0, 128, 0.9)',
    bgColor: '#070a14',
    cssStyle: {
      background: 'linear-gradient(90deg, #38bdf8 0%, #f472b6 50%, #a78bfa 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(-2px 0 0 rgba(6,182,212,0.8)) drop-shadow(2px 0 0 rgba(236,72,153,0.8))',
    },
  },
];

/* =====================================================================
   3. TEXTURE FILLS & CLIPPING MASKS (CANVAS & CSS)
   ===================================================================== */

export const TEXTURE_FILLS: TextureFillOption[] = [
  {
    id: 'carbon-weave',
    name: 'Fibre de Carbone',
    patternType: 'pattern',
    previewGradient: 'linear-gradient(45deg, #18181b 25%, #27272a 50%, #09090b 75%)',
    cssBackground:
      'radial-gradient(circle, #27272a 10%, #09090b 90%), repeating-linear-gradient(45deg, #18181b 0px, #18181b 4px, #27272a 4px, #27272a 8px)',
    canvasDrawer: (ctx, width, height) => {
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 2;
      for (let x = 0; x < width + height; x += 8) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x - height, height);
        ctx.stroke();
      }
      ctx.strokeStyle = '#3f3f46';
      ctx.lineWidth = 1;
      for (let x = -height; x < width; x += 8) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + height, height);
        ctx.stroke();
      }
    },
  },
  {
    id: 'molten-magma',
    name: 'Magma & Veines Volcaniques',
    patternType: 'gradient',
    previewGradient: 'linear-gradient(135deg, #f97316, #ef4444, #7f1d1d)',
    cssBackground:
      'radial-gradient(ellipse at 30% 20%, #fef08a 0%, #ea580c 40%, #7f1d1d 80%, #180505 100%)',
    canvasDrawer: (ctx, width, height) => {
      const grad = ctx.createRadialGradient(
        width * 0.4,
        height * 0.3,
        width * 0.1,
        width * 0.5,
        height * 0.5,
        width * 0.7
      );
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.3, '#f97316');
      grad.addColorStop(0.7, '#dc2626');
      grad.addColorStop(1, '#450a0a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Veins
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.6);
      ctx.bezierCurveTo(width * 0.3, height * 0.2, width * 0.7, height * 0.8, width, height * 0.4);
      ctx.stroke();
    },
  },
  {
    id: 'cosmic-nebula-texture',
    name: 'Poussière d’Étoiles Céleste',
    patternType: 'gradient',
    previewGradient: 'linear-gradient(135deg, #a855f7, #6366f1, #06b6d4)',
    cssBackground:
      'radial-gradient(circle at 70% 30%, #e879f9 0%, #6366f1 45%, #0f172a 90%)',
    canvasDrawer: (ctx, width, height) => {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#c084fc');
      grad.addColorStop(0.4, '#6366f1');
      grad.addColorStop(0.8, '#06b6d4');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Star sparkles
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 40; i++) {
        const x = (Math.sin(i * 99) * 0.5 + 0.5) * width;
        const y = (Math.cos(i * 33) * 0.5 + 0.5) * height;
        const r = (i % 3) + 1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
  {
    id: 'brushed-gold',
    name: 'Feuille d’Or Brossée',
    patternType: 'gradient',
    previewGradient: 'linear-gradient(90deg, #fef08a, #ca8a04, #eab308, #854d0e)',
    cssBackground:
      'linear-gradient(90deg, #fef08a 0%, #eab308 25%, #a16207 50%, #fde047 75%, #ca8a04 100%)',
    canvasDrawer: (ctx, width, height) => {
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, '#fef9c3');
      grad.addColorStop(0.2, '#facc15');
      grad.addColorStop(0.45, '#a16207');
      grad.addColorStop(0.75, '#fde047');
      grad.addColorStop(1, '#ca8a04');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Brush lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    },
  },
  {
    id: 'iridescent-pearl',
    name: 'Nacre Iridescente Holo',
    patternType: 'gradient',
    previewGradient: 'linear-gradient(135deg, #f472b6, #38bdf8, #4ade80, #facc15)',
    cssBackground:
      'linear-gradient(135deg, #f472b6 0%, #c084fc 25%, #38bdf8 50%, #4ade80 75%, #facc15 100%)',
    canvasDrawer: (ctx, width, height) => {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#f472b6');
      grad.addColorStop(0.25, '#c084fc');
      grad.addColorStop(0.5, '#38bdf8');
      grad.addColorStop(0.75, '#4ade80');
      grad.addColorStop(1, '#facc15');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    },
  },
  {
    id: 'matrix-rain',
    name: 'Code Binaire Cyber',
    patternType: 'pattern',
    previewGradient: 'linear-gradient(180deg, #22c55e, #14532d, #052e16)',
    cssBackground:
      'linear-gradient(180deg, #4ade80 0%, #15803d 60%, #022c22 100%)',
    canvasDrawer: (ctx, width, height) => {
      ctx.fillStyle = '#022c22';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#4ade80';
      ctx.font = '12px monospace';
      const cols = Math.floor(width / 16);
      for (let c = 0; c < cols; c++) {
        const char = String.fromCharCode(0x30a0 + ((c * 17) % 96));
        ctx.fillText(char, c * 16, ((c * 23) % height) + 12);
      }
    },
  },
];

/* =====================================================================
   4. CANVAS EXPORT ENGINE (HD RETINA 2X / 3X TRANSPARENT PNG)
   ===================================================================== */

export interface RenderCanvasOptions {
  text: string;
  fontSize: number;
  fontFamily: string;
  letterSpacing: number;
  effectId: string;
  textureId: string;
  isTransparentBg: boolean;
  scale?: number;
  outlineColor?: string;
  outlineWidth?: number;
}

/**
 * Split text into user-perceived character clusters for Canvas spacing and SVG sizing.
 * Keeps combining accents, emoji skin tones, ZWJ sequences, and flag pairs intact.
 */
export function splitGraphemes(text: string): string[] {
  const points = Array.from(String(text ?? ''));
  const clusters: string[] = [];
  let regionalRun = 0;
  for (const point of points) {
    const isMark = /[\p{M}\uFE0E\uFE0F]/u.test(point);
    const isModifier = /\p{Emoji_Modifier}/u.test(point);
    const isRegional = /\p{Regional_Indicator}/u.test(point);
    const previous = clusters.length ? clusters[clusters.length - 1] : '';
    if (!clusters.length) clusters.push(point);
    else if (isMark || isModifier || point === '\u200D' || previous.endsWith('\u200D')) clusters[clusters.length - 1] += point;
    else if (isRegional && regionalRun % 2 === 1) clusters[clusters.length - 1] += point;
    else clusters.push(point);
    regionalRun = isRegional ? regionalRun + 1 : 0;
  }
  return clusters;
}

function drawTextWithLetterSpacing(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  letterSpacing: number,
  stroke = false
): void {
  const characters = splitGraphemes(text);
  if (letterSpacing <= 0 || characters.length < 2) {
    if (stroke) ctx.strokeText(text, x, y);
    else ctx.fillText(text, x, y);
    return;
  }

  const widths = characters.map((character) => ctx.measureText(character).width);
  const totalWidth = widths.reduce((sum, width) => sum + width, 0)
    + letterSpacing * (characters.length - 1);
  let cursorX = x - totalWidth / 2;
  const previousAlign = ctx.textAlign;
  ctx.textAlign = 'left';

  characters.forEach((character, index) => {
    if (stroke) ctx.strokeText(character, cursorX, y);
    else ctx.fillText(character, cursorX, y);
    cursorX += widths[index] + letterSpacing;
  });

  ctx.textAlign = previousAlign;
}

export function renderStyledTextToCanvas(
  canvas: HTMLCanvasElement,
  options: RenderCanvasOptions
): void {
  const {
    text,
    fontSize,
    fontFamily,
    letterSpacing,
    effectId,
    textureId,
    isTransparentBg,
    scale = 2,
    outlineColor = 'rgba(0, 0, 0, 0.75)',
    outlineWidth = 0,
  } = options;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const fontStr = `bold ${fontSize * scale}px ${fontFamily}, system-ui, sans-serif`;
  ctx.font = fontStr;

  // Measure text
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width + Math.max(0, Array.from(text).length - 1) * letterSpacing * scale;
  const paddingX = 60 * scale;
  const paddingY = 50 * scale;
  const width = Math.max(300 * scale, Math.ceil(textWidth + paddingX * 2));
  const height = Math.max(160 * scale, Math.ceil(fontSize * scale * 1.8 + paddingY * 2));

  canvas.width = width;
  canvas.height = height;

  // Clear or background
  ctx.clearRect(0, 0, width, height);

  const effect = VISUAL_EFFECTS.find((e) => e.id === effectId) || VISUAL_EFFECTS[0];

  if (!isTransparentBg) {
    ctx.fillStyle = effect.bgColor;
    ctx.fillRect(0, 0, width, height);
  }

  // Draw texture fill pattern offscreen
  const offscreen = document.createElement('canvas');
  offscreen.width = width;
  offscreen.height = height;
  const offCtx = offscreen.getContext('2d');

  if (offCtx) {
    const texture = TEXTURE_FILLS.find((t) => t.id === textureId) || TEXTURE_FILLS[0];
    texture.canvasDrawer(offCtx, width, height);
  }

  const posX = width / 2;
  const posY = height / 2 + (fontSize * scale * 0.35);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font = fontStr;

  // Glow shadow pass
  if (effectId === 'cyber-neon') {
    ctx.shadowColor = 'rgba(0, 240, 255, 0.9)';
    ctx.shadowBlur = 24 * scale;
  } else if (effectId === 'magma-fire') {
    ctx.shadowColor = 'rgba(249, 115, 22, 0.9)';
    ctx.shadowBlur = 22 * scale;
  } else if (effectId === 'pure-gold') {
    ctx.shadowColor = 'rgba(234, 179, 8, 0.7)';
    ctx.shadowBlur = 18 * scale;
  } else if (effectId === 'cosmic-nebula') {
    ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
    ctx.shadowBlur = 20 * scale;
  } else if (effectId === 'emerald-acid') {
    ctx.shadowColor = 'rgba(34, 197, 94, 0.85)';
    ctx.shadowBlur = 20 * scale;
  } else {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 10 * scale;
  }

  // Outline stroke if requested
  if (outlineWidth > 0) {
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = outlineWidth * scale;
    drawTextWithLetterSpacing(ctx, text, posX, posY, letterSpacing * scale, true);
  }

  // Base color comes from the selected visual effect, not a fixed neon gradient.
  // Parse the preset's CSS hex colors so Canvas and the preview/export share the same palette.
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  const gradientStops = effect.gradientCSS.match(/#[0-9a-fA-F]{3,8}/g) || ['#ffffff', '#8b5cf6'];
  gradientStops.forEach((color, index) => {
    gradient.addColorStop(gradientStops.length === 1 ? 0 : index / (gradientStops.length - 1), color);
  });
  ctx.fillStyle = gradient;
  drawTextWithLetterSpacing(ctx, text, posX, posY, letterSpacing * scale);

  // Apply the selected texture as a subtle clipped overlay inside the glyphs.
  // source-atop keeps the texture within the text shape, preserving transparent backgrounds.
  const pattern = ctx.createPattern(offscreen, 'no-repeat');
  if (pattern) {
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.globalAlpha = 0.32;
    ctx.fillStyle = pattern;
    drawTextWithLetterSpacing(ctx, text, posX, posY, letterSpacing * scale);
    ctx.restore();
  }

  // Specular top highlight pass
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  drawTextWithLetterSpacing(ctx, text, posX, posY - 2 * scale, letterSpacing * scale);
}

/**
 * Downloads a canvas as high-resolution PNG
 */
export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string): void {
  try {
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.replace(/[^\p{L}\p{N}_-]/gu, '_') || 'nameforge'}_styled.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (err) {
    console.error('Failed to export image', err);
  }
}

/**
 * Generates an SVG vector representation of the styled text
 */
export function generateSvgCode(
  text: string,
  fontSize: number,
  fontFamily: string,
  effectId: string,
  textureId: string,
  isTransparentBg: boolean,
  letterSpacing = 0
): string {
  const effect = VISUAL_EFFECTS.find((e) => e.id === effectId) || VISUAL_EFFECTS[0];
  const texture = TEXTURE_FILLS.find((t) => t.id === textureId) || TEXTURE_FILLS[0];
  // Estimate a canvas wide enough for long labels instead of clipping them in a fixed 800px SVG.
  const characters = Array.from(text);
  const width = Math.max(320, Math.ceil(characters.length * fontSize * 0.78 + Math.max(0, characters.length - 1) * letterSpacing + 120));
  const height = Math.max(160, Math.ceil(fontSize * 2.8));
  const colors = effect.gradientCSS.match(/#[0-9a-fA-F]{3,8}/g) || ['#ffffff', '#8b5cf6'];
  const stops = colors.map((color, index) =>
    `<stop offset="${colors.length === 1 ? 0 : Math.round((index / (colors.length - 1)) * 100)}%" stop-color="${color}" />`
  ).join('\\n      ');
  const safeText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
  const safeFontFamily = fontFamily.replace(/["<>]/g, '');
  const safeTextureId = texture.id.replace(/[^a-zA-Z0-9_-]/g, '');
  const textureColors = texture.previewGradient.match(/#[0-9a-fA-F]{3,8}/g) || ['#ffffff', '#8b5cf6'];
  const textureStops = textureColors.map((color, index) =>
    `<stop offset="${textureColors.length === 1 ? 0 : Math.round((index / (textureColors.length - 1)) * 100)}%" stop-color="${color}" />`
  ).join('\\n      ');

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="nf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      ${stops}
    </linearGradient>
    <linearGradient id="nf-texture-${safeTextureId}" x1="0%" y1="0%" x2="100%" y2="100%">
      ${textureStops}
    </linearGradient>
    <pattern id="nf-pattern-${safeTextureId}" width="18" height="18" patternUnits="userSpaceOnUse">
      <rect width="18" height="18" fill="url(#nf-texture-${safeTextureId})" />
      <path d="M-4 4 L4 -4 M0 18 L18 0 M14 22 L22 14" stroke="#ffffff" stroke-opacity="0.28" stroke-width="1.5" />
    </pattern>
    <clipPath id="nf-text-clip">
      <text x="50%" y="53%" font-family="${safeFontFamily}, system-ui, sans-serif"
        font-size="${fontSize}px" letter-spacing="${letterSpacing}px" font-weight="900" text-anchor="middle"
        dominant-baseline="middle">${safeText}</text>
    </clipPath>
    <filter id="nf-glow" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  ${!isTransparentBg ? `<rect width="100%" height="100%" fill="${effect.bgColor}" />` : ''}
  <text x="50%" y="53%" font-family="${safeFontFamily}, system-ui, sans-serif"
    font-size="${fontSize}px" letter-spacing="${letterSpacing}px" font-weight="900" text-anchor="middle"
    dominant-baseline="middle" fill="url(#nf-grad)" filter="url(#nf-glow)">${safeText}</text>
  <rect width="100%" height="100%" fill="url(#nf-pattern-${safeTextureId})"
    clip-path="url(#nf-text-clip)" opacity="0.32" />
</svg>`.trim();
}
