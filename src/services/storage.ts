import {
  ExportBundle,
  GeneratorId,
  HistoryEntry,
  ImportResult,
  NamedCollection,
  SavedNameEntry,
  StorageStats,
} from '../types';

const STORAGE_KEY = 'nameforge_saved_names';
const COLLECTIONS_KEY = 'nameforge_collections';
const HISTORY_KEY = 'nameforge_generation_history';

function safeTrim(v: unknown): string {
  if (v === null || typeof v === 'undefined') return '';
  return String(v).trim();
}

function generateId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    // fallback
  }
  return Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
}

function notifyStorageChange() {
  try {
    window.dispatchEvent(new CustomEvent('nameforge:storage'));
  } catch (e) {
    console.warn('Unable to dispatch storage custom event', e);
  }
}

/**
 * Universal subscription helper that listens to both internal and cross-tab storage events
 */
export function subscribeToStorage(callback: () => void): () => void {
  const handleInternal = () => callback();
  const handleExternal = (event: StorageEvent) => {
    if (!event.key || event.key.startsWith('nameforge_')) {
      callback();
    }
  };

  window.addEventListener('nameforge:storage', handleInternal);
  window.addEventListener('storage', handleExternal);

  return () => {
    window.removeEventListener('nameforge:storage', handleInternal);
    window.removeEventListener('storage', handleExternal);
  };
}

/* =====================================================================
   RATING HELPERS
===================================================================== */

export function normalizeRating(value: unknown): number {
  const rating = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) return 0;
  return Math.round(rating);
}

export function getStoredRating(name: string): number {
  try {
    const val = localStorage.getItem('nameforge_rating_' + name);
    return val === null ? 0 : normalizeRating(val);
  } catch {
    return 0;
  }
}

export function setStoredRating(name: string, rating: number): void {
  try {
    const normalizedRating = normalizeRating(rating);
    if (normalizedRating === 0) {
      localStorage.removeItem('nameforge_rating_' + name);
    } else {
      localStorage.setItem('nameforge_rating_' + name, String(normalizedRating));
    }
    const names = getSavedNames();
    const entry = names.find((x) => x.name.toLowerCase() === name.toLowerCase());
    if (entry) {
      entry.rating = normalizedRating;
      saveAllNames(names);
    } else {
      notifyStorageChange();
    }
  } catch (e) {
    console.error('Error saving rating', e);
  }
}

/**
 * Returns top-rated names based on real user star evaluations, independently filterable by category
 */
export function getTopRatedNamesByCategory(generatorId?: string, limit = 10): SavedNameEntry[] {
  const all = getSavedNames();
  const rated = all.filter((entry) => {
    const hasStars = typeof entry.rating === 'number' && entry.rating > 0;
    if (!hasStars) return false;
    if (generatorId && generatorId !== 'all') {
      return entry.generator.toLowerCase() === generatorId.toLowerCase();
    }
    return true;
  });
  // Sort strictly by star rating descending (5 to 1), then by most recent
  rated.sort((a, b) => {
    const diff = (b.rating || 0) - (a.rating || 0);
    if (diff !== 0) return diff;
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });
  return rated.slice(0, limit);
}

/* =====================================================================
   SAVED NAMES CRUD
===================================================================== */

function normalizeEntry(raw: any): SavedNameEntry | null {
  if (!raw || typeof raw !== 'object') return null;
  const name = safeTrim(raw.name);
  if (!name) return null;

  return {
    id: safeTrim(raw.id) || generateId(),
    name,
    generator: safeTrim(raw.generator) || 'fantasy',
    style: safeTrim(raw.style) || 'warrior',
    saved: raw.saved === true,
    liked: raw.liked === true,
    note: safeTrim(raw.note),
    collectionId: safeTrim(raw.collectionId) || undefined,
    rating: normalizeRating(raw.rating) || getStoredRating(name),
    createdAt: safeTrim(raw.createdAt) || new Date().toISOString(),
  };
}

/** Remap an imported name's collection reference without attaching it to an unrelated local collection. */
export function remapImportedCollectionId(
  collectionId: string | undefined,
  importedCollectionIdMap: Map<string, string>,
  declaredImportedCollectionIds: Set<string>
): string | undefined {
  if (!collectionId || !declaredImportedCollectionIds.has(collectionId)) return collectionId;
  return importedCollectionIdMap.get(collectionId);
}

/** Validate imported history records without trusting fields from an external JSON file. */
export function normalizeHistoryEntry(raw: unknown): HistoryEntry | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const item = raw as Partial<HistoryEntry>;
  const name = safeTrim(item.name);
  const generator = safeTrim(item.generator);
  if (!name || !generator) return null;

  const rawGeneratedAt = safeTrim(item.generatedAt);
  const parsedGeneratedAt = Date.parse(rawGeneratedAt);
  const generatedAt = rawGeneratedAt && Number.isFinite(parsedGeneratedAt)
    ? new Date(parsedGeneratedAt).toISOString()
    : new Date().toISOString();

  return {
    id: safeTrim(item.id) || generateId(),
    name,
    generator,
    style: safeTrim(item.style) || 'default',
    tone: safeTrim(item.tone),
    description: safeTrim(item.description),
    bestFor: safeTrim(item.bestFor),
    generatedAt,
  };
}

function isEntryActive(item: SavedNameEntry): boolean {
  return (
    item.saved === true ||
    item.liked === true ||
    safeTrim(item.note) !== '' ||
    !!item.collectionId
  );
}

export function getSavedNames(): SavedNameEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const list: SavedNameEntry[] = [];
    const ids = new Set<string>();

    for (const item of parsed) {
      const entry = normalizeEntry(item);
      if (entry) {
        if (ids.has(entry.id)) {
          entry.id = generateId();
        }
        ids.add(entry.id);
        list.push(entry);
      }
    }
    return list;
  } catch (e) {
    console.error('Error loading saved names from localStorage', e);
    return [];
  }
}

function saveAllNames(names: SavedNameEntry[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
    notifyStorageChange();
    return true;
  } catch (e) {
    console.error('Error saving names to localStorage', e);
    return false;
  }
}

function findInList(list: SavedNameEntry[], name: string, generator?: string): SavedNameEntry | undefined {
  const target = safeTrim(name).toLowerCase();
  if (!target) return undefined;
  if (generator) {
    const genTarget = safeTrim(generator).toLowerCase();
    const exact = list.find((x) => x.name.toLowerCase() === target && x.generator.toLowerCase() === genTarget);
    if (exact) return exact;
  }
  return list.find((x) => x.name.toLowerCase() === target);
}

export function findSavedEntry(name: string, generator?: string): SavedNameEntry | undefined {
  const names = getSavedNames();
  return findInList(names, name, generator);
}

export function toggleSaveName(
  name: string,
  generator: GeneratorId | string,
  style: string,
  collectionId?: string
): boolean {
  const clean = safeTrim(name);
  if (!clean) return false;
  const names = getSavedNames();
  const existing = findInList(names, clean, generator);

  if (existing) {
    existing.saved = !existing.saved;
    if (generator) existing.generator = generator;
    if (style) existing.style = style;
    if (collectionId !== undefined) existing.collectionId = collectionId;

    if (!isEntryActive(existing)) {
      const filtered = names.filter((x) => x.id !== existing.id);
      saveAllNames(filtered);
      return false;
    }
    saveAllNames(names);
    return existing.saved;
  } else {
    const newEntry: SavedNameEntry = {
      id: generateId(),
      name: clean,
      generator,
      style,
      saved: true,
      liked: false,
      note: '',
      collectionId,
      rating: getStoredRating(clean),
      createdAt: new Date().toISOString(),
    };
    names.unshift(newEntry);
    saveAllNames(names);
    return true;
  }
}

export function toggleLikeName(name: string, generator: GeneratorId | string, style: string): boolean {
  const clean = safeTrim(name);
  if (!clean) return false;
  const names = getSavedNames();
  const existing = findInList(names, clean, generator);

  if (existing) {
    existing.liked = !existing.liked;
    if (generator) existing.generator = generator;
    if (style) existing.style = style;

    if (!isEntryActive(existing)) {
      const filtered = names.filter((x) => x.id !== existing.id);
      saveAllNames(filtered);
      return false;
    }
    saveAllNames(names);
    return existing.liked;
  } else {
    const newEntry: SavedNameEntry = {
      id: generateId(),
      name: clean,
      generator,
      style,
      saved: false,
      liked: true,
      note: '',
      rating: getStoredRating(clean),
      createdAt: new Date().toISOString(),
    };
    names.unshift(newEntry);
    saveAllNames(names);
    return true;
  }
}

export function updateEntryNote(
  name: string,
  note: string,
  generator?: GeneratorId | string,
  style?: string
): boolean {
  const clean = safeTrim(name);
  if (!clean) return false;
  const names = getSavedNames();
  const existing = findInList(names, clean, generator);

  if (existing) {
    existing.note = safeTrim(note);
    if (generator) existing.generator = generator;
    if (style) existing.style = style;

    if (!isEntryActive(existing)) {
      const filtered = names.filter((x) => x.id !== existing.id);
      saveAllNames(filtered);
      return true;
    }
    saveAllNames(names);
    return true;
  } else {
    const newEntry: SavedNameEntry = {
      id: generateId(),
      name: clean,
      generator: generator || 'fantasy',
      style: style || 'warrior',
      saved: false,
      liked: false,
      note: safeTrim(note),
      rating: getStoredRating(clean),
      createdAt: new Date().toISOString(),
    };
    if (isEntryActive(newEntry)) {
      names.unshift(newEntry);
      saveAllNames(names);
    }
    return true;
  }
}

export function assignNameToCollection(name: string, collectionId?: string): boolean {
  const clean = safeTrim(name);
  if (!clean) return false;
  const names = getSavedNames();
  const existing = findInList(names, clean);
  if (!existing) return false;

  existing.collectionId = collectionId ? safeTrim(collectionId) : undefined;
  saveAllNames(names);
  return true;
}

export function deleteSavedName(name: string, generator?: string): boolean {
  const clean = safeTrim(name);
  if (!clean) return false;
  const names = getSavedNames();
  const target = clean.toLowerCase();
  const filtered = names.filter((x) => {
    if (x.name.toLowerCase() !== target) return true;
    if (generator && x.generator.toLowerCase() !== generator.toLowerCase()) return true;
    return false;
  });
  saveAllNames(filtered);
  try {
    localStorage.removeItem('nameforge_rating_' + clean);
  } catch {}
  return true;
}

/* =====================================================================
   COLLECTIONS CRUD
===================================================================== */

export function getCollections(): NamedCollection[] {
  try {
    const raw = localStorage.getItem(COLLECTIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((c) => ({
      id: safeTrim(c.id) || generateId(),
      name: safeTrim(c.name) || 'Collection sans nom',
      description: safeTrim(c.description),
      color: safeTrim(c.color) || '#8b5cf6',
      createdAt: safeTrim(c.createdAt) || new Date().toISOString(),
    }));
  } catch (e) {
    console.error('Error reading collections from localStorage', e);
    return [];
  }
}

export function saveCollections(collections: NamedCollection[]): boolean {
  try {
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
    notifyStorageChange();
    return true;
  } catch (e) {
    console.error('Error saving collections', e);
    return false;
  }
}

export function createCollection(name: string, description = '', color = '#8b5cf6'): NamedCollection | null {
  const clean = safeTrim(name);
  if (!clean) return null;
  const list = getCollections();
  const newCol: NamedCollection = {
    id: generateId(),
    name: clean,
    description: safeTrim(description),
    color,
    createdAt: new Date().toISOString(),
  };
  list.unshift(newCol);
  saveCollections(list);
  return newCol;
}

export function updateCollection(id: string, name: string, description: string, color?: string): boolean {
  const list = getCollections();
  const existing = list.find((c) => c.id === id);
  if (!existing) return false;
  existing.name = safeTrim(name) || existing.name;
  existing.description = safeTrim(description);
  if (color) existing.color = color;
  return saveCollections(list);
}

export function deleteCollection(id: string): boolean {
  const list = getCollections();
  const filtered = list.filter((c) => c.id !== id);
  // Also unassign names belonging to this collection
  const names = getSavedNames();
  names.forEach((n) => {
    if (n.collectionId === id) {
      n.collectionId = undefined;
    }
  });
  saveAllNames(names);
  return saveCollections(filtered);
}

/* =====================================================================
   GENERATION HISTORY (50 RECENT NAMES)
===================================================================== */

export function getGenerationHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function addGenerationHistory(
  entries: Array<{
    name: string;
    generatorId: GeneratorId | string;
    style: string;
    tone: string;
    description: string;
    bestFor: string;
  }>
): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const current = getGenerationHistory();
    const existingNames = new Set(current.map((x) => x.name.toLowerCase()));
    const newItems: HistoryEntry[] = [];

    for (const item of entries) {
      if (!existingNames.has(item.name.toLowerCase())) {
        existingNames.add(item.name.toLowerCase());
        newItems.push({
          id: generateId(),
          name: item.name,
          generator: item.generatorId,
          style: item.style,
          tone: item.tone,
          description: item.description,
          bestFor: item.bestFor,
          generatedAt: new Date().toISOString(),
        });
      }
    }

    const updated = [...newItems, ...current].slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    notifyStorageChange();
  } catch (e) {
    console.error('Error saving generation history', e);
  }
}

export function clearGenerationHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
    notifyStorageChange();
  } catch (e) {
    console.error('Error clearing history', e);
  }
}

/* =====================================================================
   STATS & CLEAR ALL
===================================================================== */

export function getNameForgeStats(): StorageStats {
  const names = getSavedNames();
  const collections = getCollections();
  const history = getGenerationHistory();
  const uniqueGens = new Set(names.map((x) => x.generator).filter(Boolean));

  return {
    total: names.length,
    saved: names.filter((x) => x.saved).length,
    liked: names.filter((x) => x.liked).length,
    notes: names.filter((x) => safeTrim(x.note) !== '').length,
    generators: uniqueGens.size,
    collections: collections.length,
    history: history.length,
  };
}

export function clearAllSavedNames(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(COLLECTIONS_KEY);
    localStorage.removeItem(HISTORY_KEY);
    notifyStorageChange();
    return true;
  } catch (e) {
    console.error('Error clearing localStorage', e);
    return false;
  }
}

/* =====================================================================
   IMPORT & EXPORT (JSON & CSV)
===================================================================== */

export function exportDataJSON(): string {
  const bundle: ExportBundle = {
    version: 2,
    appName: 'NameForge',
    exportedAt: new Date().toISOString(),
    names: getSavedNames(),
    collections: getCollections(),
    history: getGenerationHistory(),
  };
  return JSON.stringify(bundle, null, 2);
}

export function exportDataCSV(): string {
  const names = getSavedNames();
  const collections = getCollections();
  const colMap = new Map<string, string>();
  collections.forEach((c) => colMap.set(c.id, c.name));

  const header = [
    'Nom',
    'Generateur',
    'Style',
    'Enregistre (Saved)',
    'Aime (Liked)',
    'Note etoiles',
    'Collection',
    'Note privee',
    'Date creation',
  ];

  const escapeCSV = (field: any) => {
    const str = String(field ?? '').replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = names.map((n) => [
    escapeCSV(n.name),
    escapeCSV(n.generator),
    escapeCSV(n.style),
    escapeCSV(n.saved ? 'Oui' : 'Non'),
    escapeCSV(n.liked ? 'Oui' : 'Non'),
    escapeCSV(n.rating || 0),
    escapeCSV(n.collectionId ? colMap.get(n.collectionId) || 'Autre' : 'Aucune'),
    escapeCSV(n.note || ''),
    escapeCSV(n.createdAt),
  ]);

  return [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function importDataJSON(jsonStr: string): ImportResult {
  const result: ImportResult = {
    success: false,
    added: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed || typeof parsed !== 'object') {
      result.errors.push('Format de fichier JSON invalide.');
      return result;
    }

    // Validate the payload shape before writing anything to localStorage.
    // Legacy exports containing only an array of names remain supported.
    if (!Array.isArray(parsed) && !Array.isArray(parsed.names)) {
      result.errors.push('Le fichier ne contient pas de liste de noms valide.');
      return result;
    }
    if (!Array.isArray(parsed) && parsed.collections !== undefined && !Array.isArray(parsed.collections)) {
      result.errors.push('La liste des collections du fichier est invalide.');
      return result;
    }
    if (!Array.isArray(parsed) && parsed.history !== undefined && !Array.isArray(parsed.history)) {
      result.errors.push("La liste de l'historique du fichier est invalide.");
      return result;
    }

    const rawNames: any[] = Array.isArray(parsed) ? parsed : parsed.names;
    const rawCollections: any[] = Array.isArray(parsed) ? [] : (parsed.collections || []);
    const importedHistory: HistoryEntry[] = !Array.isArray(parsed) && Array.isArray(parsed.history)
      ? parsed.history
          .map((item: unknown) => normalizeHistoryEntry(item))
          .filter((item: HistoryEntry | null): item is HistoryEntry => item !== null)
      : [];

    // Snapshot the affected keys so a quota/security error cannot leave a half-imported backup.
    const previousStorage = {
      names: localStorage.getItem(STORAGE_KEY),
      collections: localStorage.getItem(COLLECTIONS_KEY),
      history: localStorage.getItem(HISTORY_KEY),
    };
    const rollbackImport = () => {
      const restore = (key: string, value: string | null) => {
        try {
          if (value === null) localStorage.removeItem(key);
          else localStorage.setItem(key, value);
        } catch {
          // Best effort: storage may remain unavailable (e.g. quota exceeded).
        }
      };
      restore(STORAGE_KEY, previousStorage.names);
      restore(COLLECTIONS_KEY, previousStorage.collections);
      restore(HISTORY_KEY, previousStorage.history);
    };
    const failImport = (message: string): ImportResult => {
      rollbackImport();
      result.success = false;
      result.errors.push(message);
      result.added = 0;
      result.updated = 0;
      return result;
    };

    const existingNames = getSavedNames();
    const existingMap = new Map<string, SavedNameEntry>();
    existingNames.forEach((item) => {
      existingMap.set(item.name.toLowerCase() + '_' + item.generator.toLowerCase(), item);
    });

    // Keep imported collection references attached to the imported collection,
    // even when its original ID already belongs to a different local collection.
    const importedCollectionIdMap = new Map<string, string>();
    const declaredImportedCollectionIds = new Set<string>();
    for (const rawCollection of rawCollections) {
      if (rawCollection && typeof rawCollection === 'object' && !Array.isArray(rawCollection)) {
        const originalId = safeTrim(rawCollection.id);
        if (originalId) declaredImportedCollectionIds.add(originalId);
      }
    }

    // Import collections with stable, unique destination IDs; malformed entries are ignored.
    if (rawCollections.length > 0) {
      const currentCols = getCollections();
      const colIdSet = new Set(currentCols.map((c) => c.id));
      for (const rawCollection of rawCollections) {
        if (!rawCollection || typeof rawCollection !== 'object' || Array.isArray(rawCollection)) {
          result.skipped++;
          continue;
        }
        const colName = safeTrim(rawCollection.name);
        if (!colName) {
          result.skipped++;
          continue;
        }
        const originalId = safeTrim(rawCollection.id);
        let id = originalId || generateId();
        if (colIdSet.has(id)) {
          do {
            id = generateId();
          } while (colIdSet.has(id));
        }
        colIdSet.add(id);
        if (originalId && !importedCollectionIdMap.has(originalId)) {
          importedCollectionIdMap.set(originalId, id);
        }
        currentCols.push({
          id,
          name: colName,
          description: safeTrim(rawCollection.description),
          color: safeTrim(rawCollection.color) || '#8b5cf6',
          createdAt: safeTrim(rawCollection.createdAt) || new Date().toISOString(),
        });
      }
      if (!saveCollections(currentCols)) {
        return failImport('Impossible d’enregistrer les collections importées. Aucune modification n’a été conservée.');
      }
    }

    // Import Names with merge. Remap collection IDs to avoid cross-linking a name
    // to an unrelated local collection that happens to share the same ID.
    for (const item of rawNames) {
      const entry = normalizeEntry(item);
      if (!entry) {
        result.skipped++;
        continue;
      }
      entry.collectionId = remapImportedCollectionId(
        entry.collectionId,
        importedCollectionIdMap,
        declaredImportedCollectionIds
      );

      const key = entry.name.toLowerCase() + '_' + entry.generator.toLowerCase();
      if (existingMap.has(key)) {
        const current = existingMap.get(key)!;
        let modified = false;
        if (entry.saved && !current.saved) {
          current.saved = true;
          modified = true;
        }
        if (entry.liked && !current.liked) {
          current.liked = true;
          modified = true;
        }
        if (entry.note && entry.note !== current.note) {
          if (!current.note) {
            current.note = entry.note;
          } else if (!current.note.includes(entry.note)) {
            current.note = `${current.note} | ${entry.note}`;
          }
          modified = true;
        }
        if (entry.rating && (!current.rating || entry.rating > current.rating)) {
          current.rating = entry.rating;
          modified = true;
        }
        if (entry.collectionId && !current.collectionId) {
          current.collectionId = entry.collectionId;
          modified = true;
        }
        if (modified) {
          result.updated++;
        } else {
          result.skipped++;
        }
      } else {
        existingNames.unshift(entry);
        existingMap.set(key, entry);
        result.added++;
      }
    }

    if (!saveAllNames(existingNames)) {
      return failImport('Impossible d’enregistrer les noms importés. Aucune modification n’a été conservée.');
    }

    // Restore history too, merge by name, then retain the 50 most recent entries.
    if (importedHistory.length > 0) {
      const currentHistory = getGenerationHistory();
      const seenHistoryNames = new Set<string>();
      const mergedHistory: HistoryEntry[] = [];
      for (const item of [...currentHistory, ...importedHistory]) {
        // A name can legitimately appear in multiple generators or styles.
        // Deduplicate only equivalent history entries, not by display name alone.
        const key = [
          safeTrim(item.name).toLocaleLowerCase(),
          safeTrim(item.generator).toLocaleLowerCase(),
          safeTrim(item.style).toLocaleLowerCase(),
        ].join('::');
        if (!safeTrim(item.name) || seenHistoryNames.has(key)) {
          result.skipped++;
          continue;
        }
        seenHistoryNames.add(key);
        mergedHistory.push(item);
      }
      mergedHistory.sort((a, b) =>
        new Date(b.generatedAt || 0).getTime() - new Date(a.generatedAt || 0).getTime()
      );
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(mergedHistory.slice(0, 50)));
        notifyStorageChange();
      } catch {
        return failImport("Impossible de restaurer l'historique. Les modifications de cet import ont été annulées.");
      }
    }

    result.success = true;
    return result;
  } catch (e: any) {
    result.errors.push(e?.message || 'Erreur lors de la lecture du fichier JSON.');
    return result;
  }
}
