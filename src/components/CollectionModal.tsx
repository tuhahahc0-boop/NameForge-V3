import React, { useState } from 'react';
import { X, FolderPlus, Check } from 'lucide-react';
import { createCollection, updateCollection } from '../services/storage';
import { NamedCollection } from '../types';
import { getAppSettings } from '../services/settings';
import { getCollectionModalLabels } from '../i18n/collectionModal';

interface CollectionModalProps {
  collection?: NamedCollection | null;
  onClose: () => void;
  onSaved: () => void;
}

const COLOR_OPTIONS = [
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#eab308', // Amber
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#f97316', // Orange
];

export const CollectionModal: React.FC<CollectionModalProps> = ({
  collection,
  onClose,
  onSaved,
}) => {
  const [name, setName] = useState(collection?.name || '');
  const [description, setDescription] = useState(collection?.description || '');
  const [color, setColor] = useState(collection?.color || '#8b5cf6');
  const [success, setSuccess] = useState(false);
  const t = getCollectionModalLabels(getAppSettings().language);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (collection) {
      updateCollection(collection.id, name.trim(), description.trim(), color);
    } else {
      createCollection(name.trim(), description.trim(), color);
    }

    setSuccess(true);
    onSaved();
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="collection-modal-title"
        className="w-full max-w-md bg-[#0f172a] border border-slate-700 rounded-2xl p-6 shadow-2xl relative text-start"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 end-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
          aria-label={t.close}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <FolderPlus className="w-4 h-4" />
          </div>
          <h3 id="collection-modal-title" className="text-base font-bold text-white">
            {collection ? t.titleEdit : t.titleNew}
          </h3>
        </div>

        <p className="text-xs text-slate-400 mb-5">
          {t.intro}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-1.5">
              {t.nameLabel}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              className="w-full h-10 px-3 bg-[#090d18] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-1.5">
              {t.descriptionLabel}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder={t.descriptionPlaceholder}
              className="w-full p-3 bg-[#090d18] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-1.5">
              {t.colorLabel}
            </label>
            <div className="flex items-center gap-2.5">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  aria-label={`${t.colorLabel}: ${c}`}
                  aria-pressed={color === c}
                  className={`w-7 h-7 rounded-full transition transform cursor-pointer ${
                    color === c ? 'scale-125 ring-2 ring-white shadow-lg' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 transition"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 shadow-md shadow-purple-600/25 transition flex items-center gap-1.5"
            >
              {success ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{t.saved}</span>
                </>
              ) : (
                <span>{t.save}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
