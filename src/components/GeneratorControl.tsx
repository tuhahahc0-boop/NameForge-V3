import React from 'react';
import { Sparkles, RefreshCw, Globe } from 'lucide-react';
import { FormatOption, GenderOption, GeneratorId, GenLanguageCode, LengthOption } from '../types';
import { getStyleOptions } from '../data/styles';
import { GEN_LANGUAGES } from '../services/settings';
import { getTranslations } from '../i18n';
import { getAppSettings } from '../services/settings';
import { getLocalizedStyleLabel } from '../i18n/styleLabels';

interface GeneratorControlProps {
  generatorId?: GeneratorId;
  style: string;
  onStyleChange: (s: string) => void;
  length: LengthOption;
  onLengthChange: (l: LengthOption) => void;
  format: FormatOption;
  onFormatChange: (f: FormatOption) => void;
  gender: GenderOption;
  onGenderChange: (g: GenderOption) => void;
  genLanguage?: GenLanguageCode;
  onGenLanguageChange?: (gl: GenLanguageCode) => void;
  quantity?: number;
  onQuantityChange?: (q: number) => void;
  keyword?: string;
  onKeywordChange?: (kw: string) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
}

export const GeneratorControl: React.FC<GeneratorControlProps> = ({
  generatorId,
  style,
  onStyleChange,
  length,
  onLengthChange,
  format,
  onFormatChange,
  gender,
  onGenderChange,
  genLanguage = 'auto',
  onGenLanguageChange,
  quantity = 9,
  onQuantityChange,
  keyword = '',
  onKeywordChange,
  onGenerate,
  isGenerating = false,
}) => {
  const settings = getAppSettings();
  const t = getTranslations(settings.language).generatorControl;
  const styles = getStyleOptions(generatorId);
  const quantityWord: Record<string, string> = {
    en: 'names', fr: 'noms', es: 'nombres', de: 'Namen', it: 'nomi', pt: 'nomes',
    ar: 'أسماء', tr: 'isim', ja: '個', ko: '개', zh: '个名称', ru: 'имён', hi: 'नाम',
    nl: 'namen', pl: 'nazw', sv: 'namn', vi: 'tên', id: 'nama', th: 'ชื่อ', el: 'ονόματα',
    he: 'שמות', cs: 'jmen', ro: 'nume', da: 'navne', fi: 'nimeä'
  };
  const namesLabel = quantityWord[settings.language] || 'names';
  const keywordCopy: Record<string, { placeholder: string; clear: string }> = {
    en:{placeholder:'💡 Optional inspiration keyword or root (e.g. Aero, Wolf, Luna, Zen, Cyber, Nova)...',clear:'Clear keyword'},
    fr:{placeholder:'💡 Mot-clé ou racine d’inspiration optionnel (ex. Aero, Loup, Luna, Zen, Cyber, Nova)...',clear:'Effacer le mot-clé'},
    es:{placeholder:'💡 Palabra clave o raíz opcional para inspirarte (p. ej., Aero, Lobo, Luna, Zen, Cyber, Nova)…',clear:'Borrar palabra clave'},
    de:{placeholder:'💡 Optionales Stichwort oder eine Wortwurzel als Inspiration (z. B. Aero, Wolf, Luna, Zen, Cyber, Nova)…',clear:'Stichwort löschen'},
    it:{placeholder:'💡 Parola chiave o radice facoltativa da usare come ispirazione (es. Aero, Lupo, Luna, Zen, Cyber, Nova)…',clear:'Cancella parola chiave'},
    pt:{placeholder:'💡 Palavra-chave ou raiz opcional para inspiração (ex.: Aero, Lobo, Luna, Zen, Cyber, Nova)…',clear:'Limpar palavra-chave'},
    ar:{placeholder:'💡 كلمة مفتاحية أو جذر اختياري للإلهام (مثل Aero وLuna وZen وNova)…',clear:'مسح الكلمة المفتاحية'},
    tr:{placeholder:'💡 İsteğe bağlı ilham anahtar sözcüğü veya kökü (örn. Aero, Wolf, Luna, Zen, Cyber, Nova)…',clear:'Anahtar kelimeyi temizle'},
    ja:{placeholder:'💡 任意のインスピレーション用キーワード（例：Aero、Luna、Zen、Nova）…',clear:'キーワードをクリア'},
    ko:{placeholder:'💡 선택 사항인 영감 키워드 또는 어근 (예: Aero, Luna, Zen, Nova)…',clear:'키워드 지우기'},
    zh:{placeholder:'💡 可选的灵感关键词或词根（例如 Aero、Luna、Zen、Nova）…',clear:'清除关键词'},
    ru:{placeholder:'💡 Необязательное ключевое слово или корень для вдохновения (например, Aero, Luna, Zen, Nova)...',clear:'Очистить ключевое слово'},
    hi:{placeholder:'💡 प्रेरणा के लिए वैकल्पिक कीवर्ड या मूल शब्द (जैसे Aero, Luna, Zen, Nova)…',clear:'कीवर्ड हटाएँ'},
    nl:{placeholder:'💡 Optioneel trefwoord of woordstam ter inspiratie (bijv. Aero, Wolf, Luna, Zen, Cyber, Nova)…',clear:'Zoekwoord wissen'},
    pl:{placeholder:'💡 Opcjonalne słowo kluczowe lub rdzeń jako inspiracja (np. Aero, Luna, Zen, Nova)…',clear:'Wyczyść słowo kluczowe'},
    sv:{placeholder:'💡 Valfritt inspirationsord eller en ordstam (t.ex. Aero, Luna, Zen, Nova)…',clear:'Rensa nyckelord'},
    vi:{placeholder:'💡 Từ khóa hoặc gốc từ tùy chọn để lấy cảm hứng (ví dụ: Aero, Luna, Zen, Nova)…',clear:'Xóa từ khóa'},
    id:{placeholder:'💡 Kata kunci atau akar kata opsional sebagai inspirasi (misalnya Aero, Luna, Zen, Nova)…',clear:'Hapus kata kunci'},
    th:{placeholder:'💡 คำหลักหรือรากศัพท์สำหรับเป็นแรงบันดาลใจ (ไม่บังคับ) เช่น Aero, Luna, Zen, Nova…',clear:'ล้างคำหลัก'},
    el:{placeholder:'💡 Προαιρετική λέξη-κλειδί ή ρίζα ως πηγή έμπνευσης (π.χ. Aero, Luna, Zen, Nova)…',clear:'Εκκαθάριση λέξης-κλειδιού'},
    he:{placeholder:'💡 מילת מפתח או שורש אופציונליים להשראה (למשל Aero, Luna, Zen, Nova)…',clear:'נקה מילת מפתח'},
    cs:{placeholder:'💡 Volitelné inspirativní klíčové slovo nebo slovní kořen (např. Aero, Luna, Zen, Nova)…',clear:'Vymazat klíčové slovo'},
    ro:{placeholder:'💡 Cuvânt-cheie sau rădăcină opțională pentru inspirație (de exemplu, Aero, Luna, Zen, Nova)…',clear:'Șterge cuvântul-cheie'},
    da:{placeholder:'💡 Valgfrit inspirationsord eller en ordstamme (f.eks. Aero, Luna, Zen, Nova)…',clear:'Ryd søgeord'},
    fi:{placeholder:'💡 Valinnainen inspiraatiosana tai sanan vartalo (esim. Aero, Luna, Zen, Nova)…',clear:'Tyhjennä avainsana'}
  };
  const keywordLabels = keywordCopy[settings.language] || keywordCopy.en;

  // If the current selected style doesn't exist in the new options list, pick the first
  React.useEffect(() => {
    if (styles.length > 0 && !styles.some((s) => s.key === style)) {
      onStyleChange(styles[0].key);
    }
  }, [generatorId, styles, style, onStyleChange]);

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* 1. Style selector */}
        <div className="lg:col-span-1">
          <label htmlFor="generator-style" className="block text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-1.5">
            {t.styleLabel}
          </label>
          <select
            id="generator-style"
            aria-label={t.styleLabel}
            value={style}
            onChange={(e) => onStyleChange(e.target.value)}
            className="w-full h-11 px-3 py-2 bg-[#0a0f1d] border border-slate-700/80 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 cursor-pointer shadow-inner"
          >
            {styles.map((s) => (
              <option key={s.key} value={s.key} className="bg-[#0e1627] text-white py-1">
                {getLocalizedStyleLabel(s.label, settings.language, generatorId)}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Generation Language */}
        <div>
          <label htmlFor="generator-language" className="block text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-1.5 flex items-center gap-1">
            <Globe className="w-3 h-3 text-cyan-400" />
            <span>{t.genLangLabel}</span>
          </label>
          <select
            id="generator-language"
            aria-label={t.genLangLabel}
            value={genLanguage}
            onChange={(e) => onGenLanguageChange && onGenLanguageChange(e.target.value as GenLanguageCode)}
            className="w-full h-11 px-3 py-2 bg-[#0a0f1d] border border-slate-700/80 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 cursor-pointer shadow-inner"
          >
            {GEN_LANGUAGES.map((gl) => (
              <option key={gl.code} value={gl.code} className="bg-[#0e1627]">
                {gl.label}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Length selector */}
        <div>
          <label htmlFor="generator-length" className="block text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-1.5">
            {t.lengthLabel}
          </label>
          <select
            id="generator-length"
            aria-label={t.lengthLabel}
            value={length}
            onChange={(e) => onLengthChange(e.target.value as LengthOption)}
            className="w-full h-11 px-3 py-2 bg-[#0a0f1d] border border-slate-700/80 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 cursor-pointer shadow-inner"
          >
            <option value="short" className="bg-[#0e1627]">{t.shortLength}</option>
            <option value="medium" className="bg-[#0e1627]">{t.mediumLength}</option>
            <option value="long" className="bg-[#0e1627]">{t.longLength}</option>
          </select>
        </div>

        {/* 4. Format selector */}
        <div>
          <label htmlFor="generator-format" className="block text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-1.5">
            {t.formatLabel}
          </label>
          <select
            id="generator-format"
            aria-label={t.formatLabel}
            value={format}
            onChange={(e) => onFormatChange(e.target.value as FormatOption)}
            className="w-full h-11 px-3 py-2 bg-[#0a0f1d] border border-slate-700/80 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 cursor-pointer shadow-inner"
          >
            <option value="title" className="bg-[#0e1627]">{t.formatTitle}</option>
            <option value="full" className="bg-[#0e1627]">{t.formatFull}</option>
            <option value="group" className="bg-[#0e1627]">{t.formatGroup}</option>
          </select>
        </div>

        {/* 5. Gender / Nuance */}
        <div>
          <label htmlFor="generator-gender" className="block text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-1.5">
            {t.genderLabel}
          </label>
          <select
            id="generator-gender"
            aria-label={t.genderLabel}
            value={gender}
            onChange={(e) => onGenderChange(e.target.value as GenderOption)}
            className="w-full h-11 px-3 py-2 bg-[#0a0f1d] border border-slate-700/80 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 cursor-pointer shadow-inner"
          >
            <option value="any" className="bg-[#0e1627]">{t.genderAny}</option>
            <option value="female" className="bg-[#0e1627]">{t.genderFemale}</option>
            <option value="male" className="bg-[#0e1627]">{t.genderMale}</option>
          </select>
        </div>

        {/* 6. Quantity */}
        <div>
          <label htmlFor="generator-quantity" className="block text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-1.5">
            {t.quantityLabel}
          </label>
          <select
            id="generator-quantity"
            aria-label={t.quantityLabel}
            value={quantity}
            onChange={(e) => onQuantityChange && onQuantityChange(Number(e.target.value))}
            className="w-full h-11 px-3 py-2 bg-[#0a0f1d] border border-slate-700/80 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 cursor-pointer shadow-inner"
          >
            <option value={6} className="bg-[#0e1627]">{`6 ${namesLabel}`}</option>
            <option value={9} className="bg-[#0e1627]">{`9 ${namesLabel}`}</option>
            <option value={12} className="bg-[#0e1627]">{`12 ${namesLabel}`}</option>
            <option value={18} className="bg-[#0e1627]">{`18 ${namesLabel}`}</option>
          </select>
        </div>
      </div>

      {/* 7. Optional Keyword Inspiration Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder={keywordLabels.placeholder}
            value={keyword}
            onChange={(e) => onKeywordChange && onKeywordChange(e.target.value)}
            className="w-full h-11 px-4 bg-[#0a0f1d] border border-slate-700/80 rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-inner"
          />
          {keyword && onKeywordChange && (
            <button
              onClick={() => onKeywordChange('')}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded cursor-pointer"
              title={keywordLabels.clear}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Trigger Button */}
      <div className="flex items-center justify-center pt-2">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full sm:w-auto min-w-[280px] h-13 px-8 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-black text-sm tracking-wide shadow-xl shadow-purple-600/30 hover:shadow-cyan-500/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-white" />
              <span>{t.generatingBtn}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-cyan-200" />
              <span>{t.generateBtn}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
