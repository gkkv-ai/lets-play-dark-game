import type { GameProgress, AppSettings, Dare } from '../types';

const PROGRESS_KEY = 'afterdark_progress';
const SETTINGS_KEY = 'afterdark_settings';
const CUSTOM_DARES_KEY = 'afterdark_custom_dares';

export const defaultProgress: GameProgress = {
  levels: {},
  unlockedLevels: [1],
};

export const defaultSettings: AppSettings = {
  sequentialUnlock: false,
  consent: {
    confirmed: false,
    skipAllowed: true,
    pauseAllowed: true,
    boundaries: [],
    customBoundaries: [],
  },
};

export const loadProgress = (): GameProgress => {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { ...defaultProgress, unlockedLevels: [1, 2, 3] };
    return JSON.parse(raw);
  } catch {
    return { ...defaultProgress, unlockedLevels: [1, 2, 3] };
  }
};

export const saveProgress = (progress: GameProgress): void => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
};

export const loadSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    return JSON.parse(raw);
  } catch {
    return defaultSettings;
  }
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const loadCustomDares = (): Dare[] => {
  try {
    const raw = localStorage.getItem(CUSTOM_DARES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveCustomDares = (dares: Dare[]): void => {
  localStorage.setItem(CUSTOM_DARES_KEY, JSON.stringify(dares));
};

export const resetLevelProgress = (
  progress: GameProgress,
  levelId: number
): GameProgress => {
  const updated = { ...progress };
  updated.levels = { ...updated.levels };
  delete updated.levels[levelId];
  return updated;
};

export const resetAllProgress = (): GameProgress => {
  localStorage.removeItem(PROGRESS_KEY);
  return { ...defaultProgress, unlockedLevels: [1, 2, 3] };
};

export const getCompletedDares = (
  progress: GameProgress,
  levelId: number
): string[] => {
  const lp = progress.levels[levelId];
  if (!lp) return [];
  return lp.dareProgress
    .filter((dp) => dp.completed)
    .map((dp) => dp.dareId);
};

export const markDareCompleted = (
  progress: GameProgress,
  levelId: number,
  dareId: string
): GameProgress => {
  const updated = { ...progress };
  const existing = updated.levels[levelId] || {
    levelId,
    dareProgress: [],
    startedAt: Date.now(),
  };
  const dps = [...existing.dareProgress];
  const idx = dps.findIndex((d) => d.dareId === dareId);
  if (idx >= 0) {
    dps[idx] = { ...dps[idx], completed: true, completedAt: Date.now() };
  } else {
    dps.push({ dareId, completed: true, skipped: false, completedAt: Date.now() });
  }
  updated.levels = {
    ...updated.levels,
    [levelId]: { ...existing, dareProgress: dps },
  };
  return updated;
};

export const markDareSkipped = (
  progress: GameProgress,
  levelId: number,
  dareId: string
): GameProgress => {
  const updated = { ...progress };
  const existing = updated.levels[levelId] || {
    levelId,
    dareProgress: [],
    startedAt: Date.now(),
  };
  const dps = [...existing.dareProgress];
  const idx = dps.findIndex((d) => d.dareId === dareId);
  if (idx >= 0) {
    dps[idx] = { ...dps[idx], skipped: true };
  } else {
    dps.push({ dareId, completed: false, skipped: true });
  }
  updated.levels = {
    ...updated.levels,
    [levelId]: { ...existing, dareProgress: dps },
  };
  return updated;
};

export const getRandomUncompletedDare = (
  dares: Dare[],
  progress: GameProgress,
  levelId: number,
  excludeId?: string
): Dare | null => {
  const completed = getCompletedDares(progress, levelId);
  const available = dares.filter(
    (d) => !completed.includes(d.id) && d.id !== excludeId
  );
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
};

