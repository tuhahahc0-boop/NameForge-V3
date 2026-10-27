import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Bookmark,
  Heart,
  Star,
  CheckCircle2,
  AlertCircle,
  Volume2,
  ShieldAlert,
  Lightbulb,
  Wand2,
} from 'lucide-react';
import { GeneratedName, GeneratorId, LanguageCode } from '../types';
import {
  findSavedEntry,
  getStoredRating,
  setStoredRating,
  toggleLikeName,
  toggleSaveName,
} from '../services/storage';
import { GENERATORS_METADATA } from '../data/generators';
import { getAppSettings } from '../services/settings';
import { getNameDetailsLabels } from '../i18n/nameDetails';
import { getLocalizedGeneratorTitle } from '../i18n/generatorTitles';
import { getLocalizedGeneratorDescription } from '../i18n/generatorContent';
import { getShellLabels } from '../i18n/shell';

const LEGAL_NOTICE: Partial<Record<LanguageCode, string>> = {
  en: 'Creative suggestion only. Check official trademark and domain registries before using this name commercially.',
  fr: 'Suggestion créative uniquement. Vérifiez les registres officiels des marques et des domaines avant tout usage commercial.',
  es: 'Sugerencia creativa únicamente. Consulte los registros oficiales de marcas y dominios antes de usar este nombre comercialmente.',
  de: 'Nur ein kreativer Vorschlag. Prüfen Sie vor der kommerziellen Nutzung die offiziellen Marken- und Domainregister.',
  it: 'Solo un suggerimento creativo. Prima dell’uso commerciale, verifica i registri ufficiali di marchi e domini.',
  pt: 'Apenas uma sugestão criativa. Verifique os registos oficiais de marcas e domínios antes de usar este nome comercialmente.',
  ar: 'اقتراح إبداعي فقط. تحقّق من السجلات الرسمية للعلامات التجارية والنطاقات قبل استخدام هذا الاسم تجاريًا.',
  tr: 'Yalnızca yaratıcı bir öneridir. Bu adı ticari amaçla kullanmadan önce resmî marka ve alan adı kayıtlarını kontrol edin.',
  ja: '創作上の提案です。商用利用の前に、公式の商標登録とドメイン登録状況を確認してください。',
  ko: '창작용 제안입니다. 상업적으로 사용하기 전에 공식 상표 및 도메인 등록 정보를 확인하세요.',
  zh: '此内容仅为创意建议。用于商业用途前，请查询官方商标和域名注册信息。',
  ru: 'Это только творческое предложение. Перед коммерческим использованием проверьте официальные реестры товарных знаков и доменов.',
  hi: 'यह केवल एक रचनात्मक सुझाव है। व्यावसायिक उपयोग से पहले आधिकारिक ट्रेडमार्क और डोमेन रजिस्ट्रियों की जाँच करें।',
  nl: 'Dit is alleen een creatieve suggestie. Controleer officiële merken- en domeinregisters voordat je de naam commercieel gebruikt.',
  pl: 'To wyłącznie propozycja kreatywna. Przed użyciem komercyjnym sprawdź oficjalne rejestry znaków towarowych i domen.',
  sv: 'Detta är endast ett kreativt förslag. Kontrollera officiella varumärkes- och domänregister före kommersiell användning.',
  vi: 'Đây chỉ là gợi ý sáng tạo. Hãy kiểm tra cơ sở dữ liệu nhãn hiệu và tên miền chính thức trước khi sử dụng cho mục đích thương mại.',
  id: 'Ini hanya saran kreatif. Periksa daftar resmi merek dagang dan domain sebelum menggunakan nama ini secara komersial.',
  th: 'นี่เป็นเพียงข้อเสนอเชิงสร้างสรรค์ โปรดตรวจสอบทะเบียนเครื่องหมายการค้าและโดเมนอย่างเป็นทางการก่อนนำชื่อไปใช้ในเชิงพาณิชย์',
  el: 'Πρόκειται μόνο για δημιουργική πρόταση. Ελέγξτε τα επίσημα μητρώα εμπορικών σημάτων και domain πριν από εμπορική χρήση.',
  he: 'זוהי הצעה יצירתית בלבד. לפני שימוש מסחרי, בדקו במאגרים הרשמיים של סימני מסחר ודומיינים.',
  cs: 'Jde pouze o kreativní návrh. Před komerčním použitím ověřte oficiální rejstříky ochranných známek a domén.',
  ro: 'Aceasta este doar o sugestie creativă. Verifică registrele oficiale de mărci și domenii înainte de utilizarea comercială.',
  da: 'Dette er kun et kreativt forslag. Kontrollér officielle varemærke- og domæneregistre før kommerciel brug.',
  fi: 'Tämä on vain luova ehdotus. Tarkista viralliset tavaramerkki- ja verkkotunnusrekisterit ennen kaupallista käyttöä.',
};

interface NameDetailsModalProps {
  nameItem: GeneratedName;
  onClose: () => void;
  onUpdate?: () => void;
}

export const NameDetailsModal: React.FC<NameDetailsModalProps> = ({
  nameItem,
  onClose,
  onUpdate,
}) => {
  const [copied, setCopied] = useState(false);
  const existing = findSavedEntry(nameItem.name, nameItem.generatorId);
  const [isSaved, setIsSaved] = useState(existing?.saved || false);
  const [isLiked, setIsLiked] = useState(existing?.liked || false);
  const [rating, setRating] = useState<number>(getStoredRating(nameItem.name));
  const language = getAppSettings().language;
  const t = getNameDetailsLabels(language);
  const familyLabels = getShellLabels(language).families;

  const meta = GENERATORS_METADATA[nameItem.generatorId] || GENERATORS_METADATA.fantasy;
  const localizedStrengths = [t.fallbackStrength];
  const localizedWatchouts = t.fallbackWatchout.split(';').map((item) => item.trim()).filter(Boolean);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(nameItem.name);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = nameItem.name;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = () => {
    const s = toggleSaveName(nameItem.name, nameItem.generatorId, nameItem.style);
    setIsSaved(s);
    if (onUpdate) onUpdate();
  };

  const handleLike = () => {
    const l = toggleLikeName(nameItem.name, nameItem.generatorId, nameItem.style);
    setIsLiked(l);
    if (onUpdate) onUpdate();
  };

  const handleRate = (r: number) => {
    const next = rating === r ? 0 : r;
    setRating(next);
    setStoredRating(nameItem.name, next);
    if (onUpdate) onUpdate();
  };

  const handleSpeak = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(nameItem.name);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="name-details-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div dir={language === 'ar' || language === 'he' ? 'rtl' : 'ltr'} className="relative w-full max-w-2xl bg-[#0c1224] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-purple-900/40 via-indigo-950 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-xl">
              {nameItem.icon || '✨'}
            </div>
            <div>
              <span className="text-[11px] font-bold text-purple-300 uppercase tracking-widest">
                {t.header} {getLocalizedGeneratorTitle(nameItem.generatorId, language, meta.title)}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <h2 id="name-details-title" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {nameItem.name}
                </h2>
                <button
                  onClick={handleSpeak}
                  className="p-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-cyan-300 border border-purple-500/30 transition cursor-pointer"
                  title={t.listen}
                  aria-label={t.listen}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#10182e] border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">{t.archetype}</span>
              <div className="font-bold text-white text-sm mt-0.5">{familyLabels[meta.category as keyof typeof familyLabels] || getLocalizedGeneratorTitle(nameItem.generatorId, language, meta.title)}</div>
            </div>

            <button
              onClick={handleSpeak}
              className="p-3 rounded-2xl bg-[#10182e] border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer text-start group"
              title={t.listen}
            >
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                <span>{t.phonetics}</span>
                <span className="text-[9px] text-cyan-400 opacity-0 group-hover:opacity-100 transition">{t.listen} ▶</span>
              </span>
              <div className="font-bold text-cyan-300 text-sm mt-0.5 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition" />
                <span>{nameItem.pronunciation || '—'}</span>
              </div>
            </button>

            <div className="p-3 rounded-2xl bg-[#10182e] border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">{t.rating}</span>
              <div className="flex items-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleRate(s)}
                    aria-label={`${t.rating} ${s}/5`}
                    aria-pressed={rating === s}
                    className="p-0.5 cursor-pointer hover:scale-110 transition"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#10182e] border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">{t.length}</span>
              <div className="font-bold text-purple-300 text-sm mt-0.5">
                {nameItem.name.length} {t.letters}
              </div>
            </div>
          </div>

          {/* Description & Ambience */}
          <div className="p-4 rounded-2xl bg-[#10182e] border border-purple-500/20 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-purple-300">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{t.whyFits}</span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {getLocalizedGeneratorDescription(meta, language)}
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-semibold">
                {t.tone} {t.fallbackStrength}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold">
                {t.usage} {getShellLabels(language).families[meta.category as keyof ReturnType<typeof getShellLabels>['families']] || t.idealFor}
              </span>
            </div>
          </div>

          {/* Attested Data Box for Baby Names / Real Names */}
          {nameItem.isAttested !== undefined && (
            <div
              className={`p-4 rounded-2xl border ${
                nameItem.isAttested
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-indigo-950/20 border-indigo-500/30'
              } space-y-2`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2
                    className={`w-4 h-4 ${nameItem.isAttested ? 'text-emerald-400' : 'text-indigo-400'}`}
                  />
                  <span className={nameItem.isAttested ? 'text-emerald-300' : 'text-indigo-300'}>
                    {nameItem.isAttested ? t.attested : t.invented}
                  </span>
                </span>
                {nameItem.origin && (
                  <span className="text-[11px] font-semibold text-slate-300 px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60">
                    {nameItem.isAttested ? nameItem.origin : getLocalizedGeneratorTitle(nameItem.generatorId, language, GENERATORS_METADATA[nameItem.generatorId]?.title || nameItem.generatorId)}
                  </span>
                )}
              </div>
              {nameItem.isAttested && nameItem.meaning && (
                <div className="text-slate-200 text-xs">
                  <strong className="text-white">{t.etymology}</strong> « {nameItem.meaning} »
                </div>
              )}
              {nameItem.isAttested && nameItem.variants && nameItem.variants.length > 0 && (
                <div className="text-slate-400 text-[11px]">
                  <strong>{t.variants}</strong> {nameItem.variants.join(', ')}
                </div>
              )}
              {!nameItem.isAttested && (
                <p className="text-[11px] text-slate-400 italic">
                  {t.transparency}
                </p>
              )}
            </div>
          )}

          {/* Strengths vs Watch-outs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-300 text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t.strengths}</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                {localizedStrengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Watch-outs */}
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>{t.watchouts}</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                {localizedWatchouts.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Practical Advice */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-2 font-bold text-indigo-300 text-xs uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-indigo-400" />
              <span>{t.chooseTip}</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {t.adviceText}
            </p>
          </div>

          {/* Legal / Clearance notice if applicable */}
          {nameItem.disclaimer && (
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-start gap-2.5 text-[11px] text-slate-400">
              <ShieldAlert className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>{LEGAL_NOTICE[language] || t.transparency}</span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 bg-[#080d1a] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`py-2 px-3.5 rounded-xl font-bold transition flex items-center gap-1.5 text-xs cursor-pointer border ${
                isSaved
                  ? 'bg-purple-600/30 text-purple-300 border-purple-500/60'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? t.saved : t.save}</span>
            </button>

            <button
              onClick={handleLike}
              className={`py-2 px-3.5 rounded-xl font-bold transition flex items-center gap-1.5 text-xs cursor-pointer border ${
                isLiked
                  ? 'bg-pink-600/30 text-pink-300 border-pink-500/60'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{isLiked ? t.liked : t.like}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                window.dispatchEvent(
                  new CustomEvent('nameforge:navigate', {
                    detail: { view: 'style-studio', name: nameItem.name },
                  })
                );
              }}
              className="py-2 px-3.5 rounded-xl font-bold transition flex items-center gap-1.5 text-xs cursor-pointer border bg-pink-600/20 text-pink-300 border-pink-500/50 hover:bg-pink-600 hover:text-white"
              title={t.style}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{t.style}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`py-2 px-4 rounded-xl font-bold transition flex items-center gap-1.5 text-xs cursor-pointer border ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-purple-600 hover:bg-purple-500 text-white border-purple-500 shadow-md shadow-purple-600/30'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>✓ {t.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.copy}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
