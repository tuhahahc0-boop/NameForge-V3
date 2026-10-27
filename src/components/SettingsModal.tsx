import React, { useState } from 'react';
import {
  X,
  Globe,
  Sun,
  Moon,
  Laptop,
  Type,
  Zap,
  Trash2,
  AlertTriangle,
  Check,
  RotateCcw,
} from 'lucide-react';
import { AppSettings, GenLanguageCode, LanguageCode, TextSizeMode, ThemeMode } from '../types';
import {
  GEN_LANGUAGES,
  SUPPORTED_LANGUAGES,
  getAppSettings,
  resetAllLocalData,
  saveAppSettings,
} from '../services/settings';
import { FULL_TRANSLATION_LANGUAGES, getTranslations, isLanguageFullyTranslated } from '../i18n';
import { getLanguageModalLabels } from '../i18n/languageModal';

interface SettingsModalProps {
  onClose: () => void;
  onSettingsChanged?: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  onSettingsChanged,
}) => {
  const [settings, setSettings] = useState<AppSettings>(getAppSettings());
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const t = getTranslations(settings.language).settingsModal;

  const handleUpdate = (partial: Partial<AppSettings>) => {
    const updated = saveAppSettings(partial);
    setSettings(updated);
    if (onSettingsChanged) onSettingsChanged(updated);
  };

  const handleResetData = () => {
    resetAllLocalData();
    setShowConfirmReset(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-xl bg-[#0c1222] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-gradient-to-r from-purple-900/30 via-slate-900 to-indigo-900/20">
          <div>
            <h2 id="settings-title" className="text-xl font-black text-white flex items-center gap-2">
              <span className="text-purple-400">⚙️</span>
              <span>{t.title}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">{t.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
            aria-label={t.closeBtn}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Notification on Reset */}
          {resetDone && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{t.dataClearedMsg}</span>
            </div>
          )}

          {/* 1. Language selector */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
                <Globe className="w-4 h-4 text-cyan-400" />
                <h3>{t.languageTitle} ({FULL_TRANSLATION_LANGUAGES.length} / {SUPPORTED_LANGUAGES.length})</h3>
              </div>
              <span className="text-[11px] font-semibold text-purple-300">
                {SUPPORTED_LANGUAGES.find(l => l.code === settings.language)?.native}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">{t.languageDesc}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 max-h-56 overflow-y-auto pe-1">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isActive = settings.language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleUpdate({ language: lang.code })}
                    className={`py-2 px-3 rounded-xl border text-start transition flex items-center gap-2.5 cursor-pointer ${
                      isActive
                        ? 'bg-purple-600/35 border-purple-500 text-white font-bold shadow-sm'
                        : 'bg-[#10182c] border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <div className="truncate">
                      <div className="text-xs font-semibold leading-tight">{lang.native}</div>
                      <div className="text-[10px] text-slate-400">{lang.label}</div>
                      {!isLanguageFullyTranslated(lang.code) && <div className="text-[9px] text-amber-500 font-semibold">{getLanguageModalLabels(settings.language).fallback}</div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 2. Theme selector */}
          <section className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
              <Sun className="w-4 h-4 text-amber-400" />
              <h3>{t.themeTitle}</h3>
            </div>
            <p className="text-slate-400 leading-relaxed">{t.themeDesc}</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleUpdate({ theme: 'dark' })}
                className={`py-2.5 px-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                  settings.theme === 'dark'
                    ? 'bg-purple-600/30 border-purple-500 text-white font-bold'
                    : 'bg-[#10182c] border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Moon className="w-4 h-4 text-purple-400" />
                <span className="text-xs">{t.themeDark}</span>
              </button>

              <button
                onClick={() => handleUpdate({ theme: 'light' })}
                className={`py-2.5 px-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                  settings.theme === 'light'
                    ? 'bg-purple-600/30 border-purple-500 text-white font-bold'
                    : 'bg-[#10182c] border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-xs">{t.themeLight}</span>
              </button>

              <button
                onClick={() => handleUpdate({ theme: 'system' })}
                className={`py-2.5 px-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                  settings.theme === 'system'
                    ? 'bg-purple-600/30 border-purple-500 text-white font-bold'
                    : 'bg-[#10182c] border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Laptop className="w-4 h-4 text-cyan-400" />
                <span className="text-xs">{t.themeSystem}</span>
              </button>
            </div>
          </section>

          {/* 3. Text size */}
          <section className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
              <Type className="w-4 h-4 text-pink-400" />
              <h3>{t.textSizeTitle}</h3>
            </div>
            <p className="text-slate-400">{t.textSizeDesc}</p>
            <div className="grid grid-cols-3 gap-2">
              {(['compact', 'normal', 'large'] as TextSizeMode[]).map((size) => {
                const labels: Record<TextSizeMode, string> = {
                  compact: t.textCompact,
                  normal: t.textNormal,
                  large: t.textLarge,
                };
                const isActive = settings.textSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => handleUpdate({ textSize: size })}
                    className={`py-2 px-3 rounded-xl border text-center transition cursor-pointer ${
                      isActive
                        ? 'bg-purple-600/30 border-purple-500 text-white font-bold'
                        : 'bg-[#10182c] border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    {labels[size]}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 4. Motion / Animations */}
          <section className="space-y-2 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <h3>{t.motionTitle}</h3>
                </div>
                <p className="text-slate-400 mt-1">{t.motionDesc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.reduceMotion}
                  onChange={(e) => handleUpdate({ reduceMotion: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </section>

          {/* 5. Default Generation Language */}
          <section className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
              <Globe className="w-4 h-4 text-indigo-400" />
              <h3>{t.genLangTitle}</h3>
            </div>
            <p className="text-slate-400">{t.genLangDesc}</p>
            <select
              id="settings-default-generation-language"
              aria-label={t.genLangTitle}
              value={settings.defaultGenLanguage}
              onChange={(e) =>
                handleUpdate({ defaultGenLanguage: e.target.value as GenLanguageCode })
              }
              className="w-full h-11 px-3 bg-[#10182c] border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              {GEN_LANGUAGES.map((gl) => (
                <option key={gl.code} value={gl.code} className="bg-[#0e1627]">
                  {gl.label} — {gl.desc}
                </option>
              ))}
            </select>
          </section>

          {/* 6. Data management */}
          <section className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold text-rose-400">
              <Trash2 className="w-4 h-4" />
              <h3>{t.dataTitle}</h3>
            </div>
            <p className="text-slate-400">{t.dataDesc}</p>
            {!showConfirmReset ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="py-2.5 px-4 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.clearDataBtn}</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/60 space-y-3">
                <div className="flex items-start gap-2.5 text-rose-300">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
                  <div>
                    <h4 className="font-black text-rose-200">{t.confirmClearTitle}</h4>
                    <p className="text-[11px] text-rose-300/80 mt-1">{t.confirmClearMsg}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleResetData}
                    className="py-2 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition cursor-pointer"
                  >
                    {t.confirmClearYes}
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                  >
                    {t.confirmClearCancel}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0a0f1d] flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer shadow-lg shadow-purple-600/30"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
