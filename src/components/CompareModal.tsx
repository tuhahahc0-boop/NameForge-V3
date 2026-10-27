import React, { useState } from 'react';
import { X, Copy, Check, Star, Plus, Scale } from 'lucide-react';
import { findSavedEntry, getGenerationHistory, getSavedNames, setStoredRating } from '../services/storage';
import { getAppSettings } from '../services/settings';
import { getCompareModalLabels } from '../i18n/compareModal';
import { getNameDetailsLabels } from '../i18n/nameDetails';

interface CompareModalProps {
  initialNames: string[];
  onClose: () => void;
  onUpdate?: () => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  initialNames,
  onClose,
  onUpdate,
}) => {
  const [comparedNames, setComparedNames] = useState<string[]>(initialNames.slice(0, 4));
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const language = getAppSettings().language;
  const t = getCompareModalLabels(language);
  const common = getNameDetailsLabels(language);
  const allSaved = getSavedNames();
  const allHistory = getGenerationHistory();

  // Find info for each compared name
  const nameDetails = comparedNames.map((name) => {
    const saved = findSavedEntry(name);
    const hist = allHistory.find((h) => h.name.toLowerCase() === name.toLowerCase());

    return {
      name,
      generator: saved?.generator || hist?.generator || 'fantasy',
      style: saved?.style || hist?.style || 'warrior',
      tone: hist?.tone || t.fallbackTone,
      description: hist?.description || t.fallbackDescription,
      bestFor: hist?.bestFor || t.fallbackBestFor,
      rating: saved?.rating || 0,
      note: saved?.note || '',
      saved: !!saved?.saved,
    };
  });

  const handleCopy = async (name: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(name);
      }
      setCopiedName(name);
      setTimeout(() => setCopiedName(null), 1200);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRate = (name: string, r: number, currentRating: number) => {
    const next = currentRating === r ? 0 : r;
    setStoredRating(name, next);
    if (onUpdate) onUpdate();
  };

  const handleRemove = (name: string) => {
    setComparedNames(comparedNames.filter((n) => n !== name));
  };

  const handleAddName = (name: string) => {
    if (comparedNames.length < 4 && !comparedNames.includes(name)) {
      setComparedNames([...comparedNames, name]);
    }
  };

  // Names available to add
  const availableToAdd = allSaved
    .map((s) => s.name)
    .filter((n) => !comparedNames.includes(n));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-modal-title"
        className="w-full max-w-5xl bg-[#0d1424] border border-slate-700/80 rounded-3xl p-5 sm:p-8 shadow-2xl relative text-start my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 id="compare-modal-title" className="text-xl sm:text-2xl font-black text-white">
                {t.title}
              </h2>
              <p className="text-xs text-slate-400">
                {t.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-800 transition cursor-pointer"
            aria-label={common.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add more slot selector if < 4 */}
        {comparedNames.length < 4 && availableToAdd.length > 0 && (
          <div className="mb-6 flex items-center gap-2.5 p-3 rounded-xl bg-[#090f1e] border border-slate-800">
            <Plus className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-slate-300 font-semibold">
              {t.addName}
            </span>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddName(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="h-8 px-2 bg-[#10182b] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="" disabled>
                {t.selectFavorite}
              </option>
              {availableToAdd.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Comparison Columns */}
        {comparedNames.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            {t.empty}
          </div>
        ) : (
          <div
            className={`grid gap-4 ${
              comparedNames.length === 1
                ? 'grid-cols-1'
                : comparedNames.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : comparedNames.length === 3
                ? 'grid-cols-1 md:grid-cols-3'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            }`}
          >
            {nameDetails.map((item) => (
              <div
                key={item.name}
                className="p-5 rounded-2xl bg-gradient-to-b from-[#11192c] to-[#0a101d] border border-slate-700/80 flex flex-col justify-between space-y-4 shadow-lg relative group"
              >
                {/* Remove button */}
                <button
                  onClick={() => handleRemove(item.name)}
                  className="absolute top-3 end-3 text-slate-500 hover:text-red-400 p-1 rounded-lg transition"
                  title={t.remove}
                  aria-label={t.remove}
                >
                  <X className="w-4 h-4" />
                </button>

                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-1">
                    {item.generator}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white break-words pe-6">
                    {item.name}
                  </h3>

                  <div className="mt-2 text-xs font-semibold text-pink-400">
                    {t.style} {item.style}
                  </div>

                  <div className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-purple-500/10 border border-purple-400/20 text-purple-300">
                    {item.tone}
                  </div>

                  {/* 5-star rating */}
                  <div className="flex items-center gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRate(item.name, star, item.rating)}
                        className="p-0.5 text-slate-600 hover:text-amber-400 transition cursor-pointer"
                        title={t.rate.replace('{count}', String(star))}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            star <= item.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-[11px] text-slate-400 ms-1">
                      {item.rating > 0 ? `${item.rating}/5` : t.unrated}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs text-slate-300 leading-relaxed min-h-[44px]">
                    {item.description}
                  </p>

                  <div className="mt-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <strong className="text-slate-200">{common.idealFor}</strong> {item.bestFor}
                  </div>

                  {/* Note */}
                  {item.note && (
                    <div className="mt-3 p-2.5 rounded-xl bg-[#090d18] border border-slate-800 text-xs text-purple-200 italic">
                      "{item.note}"
                    </div>
                  )}
                </div>

                {/* Bottom Copy action */}
                <div className="pt-3 border-t border-slate-800">
                  <button
                    onClick={() => handleCopy(item.name)}
                    className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    {copiedName === item.name ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>{common.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t.chooseCopy}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
