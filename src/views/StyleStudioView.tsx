import React, { useState, useEffect, useRef } from 'react';
import {
  Wand2,
  Copy,
  Check,
  Download,
  Code,
  Sparkles,
  Sliders,
  Type,
  Layers,
  Palette,
  RotateCcw,
  Image as ImageIcon,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import {
  UNICODE_STYLES,
  VISUAL_EFFECTS,
  TEXTURE_FILLS,
  renderStyledTextToCanvas,
  downloadCanvasAsPng,
  generateSvgCode,
} from '../services/textStyler';
import { GeneratorId } from '../types';
import { getAppSettings, subscribeToSettings, SUPPORTED_LANGUAGES } from '../services/settings';
import { getTranslations } from '../i18n';
import { getStudioLabel } from '../i18n/studio';

interface StyleStudioViewProps {
  initialText?: string;
  onNavigate: (view: string, generatorId?: GeneratorId) => void;
}

const PRESET_SAMPLE_NAMES = [
  'NameForge',
  'AeroVance',
  'CyberVex',
  'Kaelith',
  'L’Atelier Doré',
  'Solaris Prime',
  'Valkyrie',
  'Apex Studio',
];

// 30+ built-in font stacks: no network font download required. Actual glyphs depend
// on fonts installed on the user's device; Unicode styles remain available separately.
const FONT_OPTIONS = [
  { id: 'sans', name: '01 · Modern Sans', family: 'system-ui, -apple-system, sans-serif' },
  { id: 'serif', name: '02 · Classic Serif', family: 'Georgia, Cambria, serif' },
  { id: 'mono', name: '03 · Monospace', family: 'ui-monospace, SFMono-Regular, Consolas, monospace' },
  { id: 'display', name: '04 · Impact Display', family: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif' },
  { id: 'cursive', name: '05 · Calligraphy', family: 'cursive, "Brush Script MT", sans-serif' },
  { id: 'arial', name: '06 · Arial', family: 'Arial, Helvetica, sans-serif' },
  { id: 'verdana', name: '07 · Verdana', family: 'Verdana, Geneva, sans-serif' },
  { id: 'tahoma', name: '08 · Tahoma', family: 'Tahoma, Geneva, sans-serif' },
  { id: 'trebuchet', name: '09 · Trebuchet', family: '"Trebuchet MS", sans-serif' },
  { id: 'gill', name: '10 · Gill Sans', family: '"Gill Sans", "Gill Sans MT", sans-serif' },
  { id: 'optima', name: '11 · Optima', family: 'Optima, "Segoe UI", sans-serif' },
  { id: 'futura', name: '12 · Geometric', family: 'Futura, "Century Gothic", sans-serif' },
  { id: 'rounded', name: '13 · Rounded', family: '"Arial Rounded MT Bold", "Trebuchet MS", sans-serif' },
  { id: 'narrow', name: '14 · Condensed', family: '"Arial Narrow", "Roboto Condensed", sans-serif' },
  { id: 'georgia', name: '15 · Georgia Editorial', family: 'Georgia, serif' },
  { id: 'times', name: '16 · Times', family: '"Times New Roman", Times, serif' },
  { id: 'palatino', name: '17 · Palatino', family: 'Palatino, "Book Antiqua", serif' },
  { id: 'garamond', name: '18 · Garamond', family: 'Garamond, "EB Garamond", serif' },
  { id: 'baskerville', name: '19 · Baskerville', family: 'Baskerville, "Times New Roman", serif' },
  { id: 'didot', name: '20 · Didot', family: 'Didot, "Bodoni MT", serif' },
  { id: 'rockwell', name: '21 · Slab Serif', family: 'Rockwell, "Roboto Slab", serif' },
  { id: 'consolas', name: '22 · Consolas', family: 'Consolas, "Courier New", monospace' },
  { id: 'courier', name: '23 · Courier', family: '"Courier New", Courier, monospace' },
  { id: 'monaco', name: '24 · Monaco', family: 'Monaco, "Lucida Console", monospace' },
  { id: 'lucida', name: '25 · Lucida', family: '"Lucida Console", "Lucida Sans Typewriter", monospace' },
  { id: 'comic', name: '26 · Comic', family: '"Comic Sans MS", "Comic Sans", cursive' },
  { id: 'script', name: '27 · Script', family: '"Segoe Script", "Brush Script MT", cursive' },
  { id: 'zapf', name: '28 · Decorative Script', family: '"Apple Chancery", "URW Chancery L", cursive' },
  { id: 'fantasy', name: '29 · Fantasy', family: 'Papyrus, Herculanum, fantasy' },
  { id: 'emoji', name: '30 · Emoji-friendly', family: 'system-ui, "Apple Color Emoji", "Segoe UI Emoji", sans-serif' },
  { id: 'math', name: '31 · Math & Symbols', family: '"Cambria Math", "STIX Two Math", "DejaVu Sans", serif' },
  { id: 'cjk', name: '32 · CJK Fallback', family: '"Yu Gothic", "Meiryo", "Noto Sans CJK JP", sans-serif' },
  { id: 'arabic', name: '33 · Arabic Fallback', family: '"Noto Naskh Arabic", "Traditional Arabic", Tahoma, serif' },
  { id: 'devanagari', name: '34 · Indic Fallback', family: '"Nirmala UI", "Noto Sans Devanagari", sans-serif' },
  { id: 'symbol', name: '35 · Symbol Fallback', family: '"Segoe UI Symbol", "DejaVu Sans", sans-serif' },
];

export const StyleStudioView: React.FC<StyleStudioViewProps> = ({
  initialText = 'NameForge',
  onNavigate,
}) => {
  const [inputText, setInputText] = useState(initialText);
  const [activeTab, setActiveTab] = useState<'unicode' | 'effects' | 'textures' | 'export'>('unicode');
  const [selectedEffect, setSelectedEffect] = useState(VISUAL_EFFECTS[0].id);
  const [selectedUnicodeStyle, setSelectedUnicodeStyle] = useState<string | null>(null);
  const [selectedTexture, setSelectedTexture] = useState(TEXTURE_FILLS[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedGeneral, setCopiedGeneral] = useState(false);

  // Canvas Studio Controls
  const [fontSize, setFontSize] = useState<number>(48);
  const [letterSpacing, setLetterSpacing] = useState<number>(2);
  const [fontFamily, setFontFamily] = useState<string>(FONT_OPTIONS[0].family);
  const [isTransparent, setIsTransparent] = useState<boolean>(true);
  const [exportScale, setExportScale] = useState<number>(2);
  const [svgCopied, setSvgCopied] = useState(false);
  const [cssCopied, setCssCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [settings, setSettings] = useState(getAppSettings);
  const t = getTranslations(settings.language);
  const isRtl = SUPPORTED_LANGUAGES.find((language) => language.code === settings.language)?.dir === 'rtl';

  // Keep the studio's labels and direction in sync while it remains open.
  useEffect(() => subscribeToSettings(setSettings), []);

  // When initialText changes, update input
  useEffect(() => {
    if (initialText) {
      setInputText(initialText);
    }
  }, [initialText]);

  // Keep Unicode styling, visual effects, textures and HD exports on one shared text source.
  const selectedUnicode = UNICODE_STYLES.find((style) => style.id === selectedUnicodeStyle);
  const canvasText = selectedUnicode ? selectedUnicode.transform(inputText || 'NameForge') : (inputText || 'NameForge');

  // Redraw canvas whenever parameters change
  useEffect(() => {
    if (!canvasRef.current) return;
    renderStyledTextToCanvas(canvasRef.current, {
      text: canvasText,
      fontSize,
      fontFamily,
      letterSpacing,
      effectId: selectedEffect,
      textureId: selectedTexture,
      isTransparentBg: isTransparent,
      scale: exportScale,
    });
  }, [canvasText, fontSize, fontFamily, letterSpacing, selectedEffect, selectedTexture, isTransparent, exportScale, activeTab]);

  const handleCopyText = async (textToCopy: string, id: string) => {
    try {
      await copyToClipboard(textToCopy);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleExportPng = () => {
    if (!canvasRef.current) return;
    downloadCanvasAsPng(canvasRef.current, inputText || 'styled_name');
  };

  const copyToClipboard = async (value: string): Promise<void> => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }

    // Clipboard API may be unavailable on older browsers or non-secure origins.
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    if (!copied) {
      throw new Error('Clipboard copy is not supported in this browser.');
    }
  };

  const handleCopySvg = async () => {
    const code = generateSvgCode(
      canvasText,
      fontSize,
      fontFamily,
      selectedEffect,
      selectedTexture,
      isTransparent,
      letterSpacing
    );
    try {
      await copyToClipboard(code);
      setSvgCopied(true);
      setTimeout(() => setSvgCopied(false), 1500);
    } catch (e) {
      console.error('Failed to copy SVG', e);
    }
  };

  const handleCopyCss = async () => {
    const currentEffect = VISUAL_EFFECTS.find((e) => e.id === selectedEffect) || VISUAL_EFFECTS[0];
    const currentTexture = TEXTURE_FILLS.find((texture) => texture.id === selectedTexture) || TEXTURE_FILLS[0];
    const cssCode = `/* NameForge Styled Typography: ${currentEffect.name} + ${currentTexture.name} */
.styled-text {
  font-family: ${fontFamily};
  font-size: ${fontSize}px;
  font-weight: 800;
  letter-spacing: ${letterSpacing}px;
  background: ${currentTexture.cssBackground};
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(${currentEffect.textShadowCSS.split(',')[0]});
}`;
    try {
      await copyToClipboard(cssCode);
      setCssCopied(true);
      setTimeout(() => setCssCopied(false), 1500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div lang={settings.language} dir={isRtl ? 'rtl' : 'ltr'} className="max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-12 animate-fade-in">
      {/* Top Breadcrumb & Return */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{getStudioLabel(settings.language, 'backHome')}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 border border-purple-400/30 text-purple-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{getStudioLabel(settings.language, 'title')}</span>
          </span>
        </div>
      </div>

      {/* Hero Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="nf-animated-heading text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          {getStudioLabel(settings.language, 'heroTitle')}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
            {getStudioLabel(settings.language, 'heroAccent')}
          </span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
          {getStudioLabel(settings.language, 'heroDescription')}
        </p>
      </div>

      {/* Main Studio Input Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#11182c] to-[#0a101d] border border-slate-700/80 shadow-2xl mb-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="flex-1 relative">
            <label htmlFor="styler-input" className="sr-only">
              {getStudioLabel(settings.language, 'inputLabel')}
            </label>
            <input
              id="styler-input"
              type="text"
              dir={isRtl ? 'rtl' : 'ltr'}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={getStudioLabel(settings.language, 'inputPlaceholder')}
              className={`w-full px-5 py-4 rounded-2xl bg-[#090d19] border border-slate-700 text-lg sm:text-xl font-bold text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition shadow-inner ${isRtl ? 'text-end ps-12' : 'text-start pe-12'}`}
              maxLength={60}
              aria-describedby="styler-input-counter"
            />
            <span id="styler-input-counter" aria-live="polite" className="absolute bottom-1 end-4 text-[10px] text-slate-500">
              {inputText.length}/60
            </span>
            {inputText && (
              <button
                onClick={() => setInputText('')}
                className={`absolute top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-slate-300 p-1 ${isRtl ? 'start-4' : 'end-4'}`}
                title={getStudioLabel(settings.language, 'clearInput')}
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick copy input button */}
          <button
            aria-live="polite"
            onClick={() => handleCopyText(inputText, 'input-raw')}
            className="px-6 py-4 rounded-2xl font-bold text-sm bg-purple-600 hover:bg-purple-500 text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-900/30"
          >
            {copiedId === 'input-raw' ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>{getStudioLabel(settings.language, 'copied')}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{getStudioLabel(settings.language, 'copyPlain')}</span>
              </>
            )}
          </button>
        </div>

        {/* Preset sample names quick pills */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 shrink-0">
            {`${getStudioLabel(settings.language, 'quickPresets')}:`}
          </span>
          {PRESET_SAMPLE_NAMES.map((name) => (
            <button
              key={name}
              onClick={() => setInputText(name)}
              className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition shrink-0 cursor-pointer"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div role="tablist" aria-label={getStudioLabel(settings.language, 'title')} className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-8 overflow-x-auto scrollbar-none">
        <button
          role="tab"
          aria-selected={activeTab === 'unicode'}
          onClick={() => setActiveTab('unicode')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shrink-0 border ${
            activeTab === 'unicode'
              ? 'bg-purple-600/30 text-purple-200 border-purple-500/80 shadow-md'
              : 'bg-[#0f172a] text-slate-400 hover:text-white border-slate-800'
          }`}
        >
          <Type className="w-4 h-4 text-purple-400" />
          <span>{getStudioLabel(settings.language, 'unicodeTab')}</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'effects'}
          onClick={() => setActiveTab('effects')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shrink-0 border ${
            activeTab === 'effects'
              ? 'bg-cyan-600/30 text-cyan-200 border-cyan-500/80 shadow-md'
              : 'bg-[#0f172a] text-slate-400 hover:text-white border-slate-800'
          }`}
        >
          <Palette className="w-4 h-4 text-cyan-400" />
          <span>{getStudioLabel(settings.language, 'effectsTab')}</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'textures'}
          onClick={() => setActiveTab('textures')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shrink-0 border ${
            activeTab === 'textures'
              ? 'bg-pink-600/30 text-pink-200 border-pink-500/80 shadow-md'
              : 'bg-[#0f172a] text-slate-400 hover:text-white border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-pink-400" />
          <span>{getStudioLabel(settings.language, 'texturesTab')}</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'export'}
          onClick={() => setActiveTab('export')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shrink-0 border ${
            activeTab === 'export'
              ? 'bg-emerald-600/30 text-emerald-200 border-emerald-500/80 shadow-md'
              : 'bg-[#0f172a] text-slate-400 hover:text-white border-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>{getStudioLabel(settings.language, 'exportTab')}</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: UNICODE COPYABLE FONTS
          ========================================================================= */}
      {activeTab === 'unicode' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-slate-400">
              {getStudioLabel(settings.language, 'unicodeHint')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {UNICODE_STYLES.map((style) => {
              const styledText = style.transform(inputText || 'NameForge');
              const isCopied = copiedId === style.id;

              return (
                <div
                  key={style.id}
                  className={`p-5 rounded-2xl bg-[#0f172a] border transition-all group flex flex-col justify-between shadow-md ${selectedUnicodeStyle === style.id ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-slate-800 hover:border-purple-500/70'}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                        {style.name}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        {style.category}
                      </span>
                    </div>

                    <div id={`studio-style-${style.id}-preview`} className="text-xl sm:text-2xl font-medium text-white break-words py-2 group-hover:text-cyan-200 transition">
                      {styledText}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => void handleCopyText(styledText, style.id)}
                      className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition ${isCopied ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/40' : 'bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white'}`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? getStudioLabel(settings.language, 'copied') : getStudioLabel(settings.language, 'copy')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedUnicodeStyle(style.id); setActiveTab('export'); }}
                      aria-pressed={selectedUnicodeStyle === style.id}
                      className="px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 bg-cyan-600/20 text-cyan-700 hover:bg-cyan-600 hover:text-white border border-cyan-500/30 transition"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>{getStudioLabel(settings.language, 'applyToCanvas')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: VISUAL EFFECTS & GLOWS
          ========================================================================= */}
      {activeTab === 'effects' && (
        <div className="space-y-6">
          <p className="text-xs sm:text-sm text-slate-400">
            {getStudioLabel(settings.language, 'effectsHint')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VISUAL_EFFECTS.map((effect) => {
              const isSelected = selectedEffect === effect.id;

              return (
                <div
                  key={effect.id}
                  onClick={() => setSelectedEffect(effect.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedEffect(effect.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={effect.name}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'border-purple-500 shadow-2xl shadow-purple-950/50 bg-[#0d1424]'
                      : 'border-slate-800 hover:border-slate-700 bg-[#0c101d]'
                  }`}
                  style={{ backgroundColor: effect.bgColor }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                      {effect.name}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                      {effect.category}
                    </span>
                  </div>

                  {/* Live Render Sample */}
                  <div className="py-8 text-center flex items-center justify-center">
                    <span
                      className="text-3xl sm:text-4xl font-black tracking-tight"
                      style={effect.cssStyle}
                    >
                      {inputText || 'NameForge'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2">{effect.description}</p>

                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">
                      {isSelected ? `✓ ${getStudioLabel(settings.language, 'selectedForStudio')}` : getStudioLabel(settings.language, 'clickToApply')}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEffect(effect.id);
                        setActiveTab('export');
                      }}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <span>{getStudioLabel(settings.language, 'openCanvas')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: TEXTURE FILLS & CLIPPING MASKS
          ========================================================================= */}
      {activeTab === 'textures' && (
        <div className="space-y-6">
          <p className="text-xs sm:text-sm text-slate-400">
            {getStudioLabel(settings.language, 'texturesHint')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEXTURE_FILLS.map((texture) => {
              const isSelected = selectedTexture === texture.id;

              return (
                <div
                  key={texture.id}
                  onClick={() => setSelectedTexture(texture.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedTexture(texture.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={texture.name}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-pink-500 shadow-2xl shadow-pink-950/40 bg-[#101526]'
                      : 'border-slate-800 hover:border-slate-700 bg-[#0a0f1d]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-pink-300 uppercase tracking-wider">
                        {texture.name}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        {texture.patternType}
                      </span>
                    </div>

                    {/* Preview box */}
                    <div className="h-28 rounded-2xl flex items-center justify-center p-4 bg-[#05070e] border border-slate-800/80 my-3">
                      <span
                        className="text-2xl sm:text-3xl font-black tracking-tight"
                        style={{
                          background: texture.cssBackground,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))',
                        }}
                      >
                        {inputText || 'NameForge'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      {isSelected ? `✓ ${getStudioLabel(settings.language, 'textureActive')}` : getStudioLabel(settings.language, 'chooseTexture')}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTexture(texture.id);
                        setActiveTab('export');
                      }}
                      className="text-xs font-bold text-pink-400 hover:text-pink-300"
                    >
                      Canvas →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: STUDIO CANVAS & HD RETINA EXPORT
          ========================================================================= */}
      {activeTab === 'export' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0d1424] border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>{getStudioLabel(settings.language, 'typographySettings')}</span>
              </h3>
              <button
                onClick={() => {
                  setFontSize(48);
                  setLetterSpacing(2);
                  setFontFamily(FONT_OPTIONS[0].family);
                  setIsTransparent(true);
                  setExportScale(2);
                }}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                title={getStudioLabel(settings.language, 'reset')}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{getStudioLabel(settings.language, 'reset')}</span>
              </button>
            </div>

            {/* Font Family */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">{getStudioLabel(settings.language, 'fontFamily')}</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090e1c] border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-cyan-500"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.id} value={f.family}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">{getStudioLabel(settings.language, 'fontSize')}</span>
                <span className="text-cyan-400">{fontSize}px</span>
              </div>
              <input
                type="range"
                min="24"
                max="96"
                step="2"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Letter Spacing */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">{getStudioLabel(settings.language, 'letterSpacing')}</span>
                <span className="text-cyan-400">{letterSpacing}px</span>
              </div>
              <input
                type="range"
                min="-2"
                max="16"
                step="1"
                value={letterSpacing}
                onChange={(e) => setLetterSpacing(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Active Effect & Texture Pickers */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">{getStudioLabel(settings.language, 'visualEffect')}</label>
                <select
                  value={selectedEffect}
                  onChange={(e) => setSelectedEffect(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-[#090e1c] border border-slate-700 text-xs font-semibold text-white focus:outline-none"
                >
                  {VISUAL_EFFECTS.map((eff) => (
                    <option key={eff.id} value={eff.id}>
                      {eff.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">{getStudioLabel(settings.language, 'textureMask')}</label>
                <select
                  value={selectedTexture}
                  onChange={(e) => setSelectedTexture(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-[#090e1c] border border-slate-700 text-xs font-semibold text-white focus:outline-none"
                >
                  {TEXTURE_FILLS.map((tex) => (
                    <option key={tex.id} value={tex.id}>
                      {tex.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Transparent vs Dark Backing Toggle */}
            <div className="flex items-center justify-between pt-2">
              <label htmlFor="transparent-toggle" className="text-xs font-bold text-slate-300">
                {getStudioLabel(settings.language, 'transparentBg')}
              </label>
              <input
                id="transparent-toggle"
                type="checkbox"
                checked={isTransparent}
                onChange={(e) => setIsTransparent(e.target.checked)}
                className="w-5 h-5 accent-purple-500 cursor-pointer rounded"
              />
            </div>

            {/* Resolution multiplier */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-slate-300">{getStudioLabel(settings.language, 'exportQuality')}</span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    onClick={() => setExportScale(s)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                      exportScale === s
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}x {s === 2 ? '(HD)' : s === 3 ? '(4K)' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Canvas Live Preview & Export Action Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-3xl bg-[#0a0f1d] border border-slate-800 shadow-2xl flex flex-col items-center justify-center min-h-[300px] overflow-hidden relative">
              {/* Checkerboard background for transparent canvas visual check */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #334155 25%, transparent 25%), linear-gradient(-45deg, #334155 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #334155 75%), linear-gradient(-45deg, transparent 75%, #334155 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                }}
              />

              {/* HTML5 Canvas Element */}
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto rounded-xl shadow-2xl z-10"
              />
            </div>

            {/* Action Buttons for Export */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleExportPng}
                className="py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-950/40 transition"
              >
                <Download className="w-4 h-4" />
                <span>{getStudioLabel(settings.language, 'exportPng')}</span>
              </button>

              <button
                onClick={handleCopySvg}
                className="py-3 px-4 rounded-2xl bg-[#0d1424] hover:bg-[#141f38] border border-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition"
              >
                {svgCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{getStudioLabel(settings.language, 'svgCopied')}</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 text-pink-400" />
                    <span>{getStudioLabel(settings.language, 'copySvg')}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopyCss}
                className="py-3 px-4 rounded-2xl bg-[#0d1424] hover:bg-[#141f38] border border-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition"
              >
                {cssCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{getStudioLabel(settings.language, 'cssCopied')}</span>
                  </>
                ) : (
                  <>
                    <Code className="w-4 h-4 text-cyan-400" />
                    <span>{getStudioLabel(settings.language, 'copyCss')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StyleStudioView;
