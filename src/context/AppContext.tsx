import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import type { GameProgress, AppSettings, Dare, AppView } from '../types';
import {
  loadProgress,
  saveProgress,
  loadSettings,
  saveSettings,
  loadCustomDares,
  saveCustomDares,
  markDareCompleted,
  markDareSkipped,
  resetLevelProgress,
  resetAllProgress,
  getRandomUncompletedDare,
} from '../utils/storage';
import { gameLevels } from '../data/dares';

interface AppContextType {
  progress: GameProgress;
  settings: AppSettings;
  customDares: Dare[];
  view: AppView;
  activeLevel: number | null;
  activeDare: Dare | null;
  setView: (v: AppView) => void;
  setActiveLevel: (id: number | null) => void;
  setActiveDare: (d: Dare | null) => void;
  completeDare: (levelId: number, dareId: string) => void;
  skipDare: (levelId: number, dareId: string) => void;
  nextRandomDare: (levelId: number, excludeId?: string) => Dare | null;
  resetLevel: (levelId: number) => void;
  resetAll: () => void;
  updateSettings: (s: Partial<AppSettings>) => void;
  addCustomDare: (d: Dare) => void;
  updateCustomDare: (d: Dare) => void;
  deleteCustomDare: (id: string) => void;
  getDaresForLevel: (levelId: number) => Dare[];
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [progress, setProgress] = useState<GameProgress>(loadProgress);
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [customDares, setCustomDares] = useState<Dare[]>(loadCustomDares);
  const [view, setView] = useState<AppView>('landing');
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const [activeDare, setActiveDare] = useState<Dare | null>(null);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveCustomDares(customDares);
  }, [customDares]);

  const getDaresForLevel = useCallback(
    (levelId: number): Dare[] => {
      const level = gameLevels.find((l) => l.id === levelId);
      const baseDares = level ? level.dares : [];
      const custom = customDares.filter((d) => d.level === levelId);
      return [...baseDares, ...custom];
    },
    [customDares]
  );

  const completeDare = useCallback((levelId: number, dareId: string) => {
    setProgress((prev) => markDareCompleted(prev, levelId, dareId));
  }, []);

  const skipDare = useCallback((levelId: number, dareId: string) => {
    setProgress((prev) => markDareSkipped(prev, levelId, dareId));
  }, []);

  const nextRandomDare = useCallback(
    (levelId: number, excludeId?: string): Dare | null => {
      const dares = getDaresForLevel(levelId);
      return getRandomUncompletedDare(dares, progress, levelId, excludeId);
    },
    [getDaresForLevel, progress]
  );

  const resetLevel = useCallback((levelId: number) => {
    setProgress((prev) => resetLevelProgress(prev, levelId));
  }, []);

  const resetAll = useCallback(() => {
    setProgress(resetAllProgress());
  }, []);

  const updateSettings = useCallback((s: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...s }));
  }, []);

  const addCustomDare = useCallback((d: Dare) => {
    setCustomDares((prev) => [...prev, { ...d, isCustom: true }]);
  }, []);

  const updateCustomDare = useCallback((d: Dare) => {
    setCustomDares((prev) => prev.map((x) => (x.id === d.id ? d : x)));
  }, []);

  const deleteCustomDare = useCallback((id: string) => {
    setCustomDares((prev) => prev.filter((x) => x.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        progress,
        settings,
        customDares,
        view,
        activeLevel,
        activeDare,
        setView,
        setActiveLevel,
        setActiveDare,
        completeDare,
        skipDare,
        nextRandomDare,
        resetLevel,
        resetAll,
        updateSettings,
        addCustomDare,
        updateCustomDare,
        deleteCustomDare,
        getDaresForLevel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

