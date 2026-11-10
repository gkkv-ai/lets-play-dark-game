export type Dare = {
  id: string;
  level: 1 | 2 | 3;
  title: string;
  description: string;
  duration?: number; // in seconds
  category: string;
  isCustom?: boolean;
};

export type GameLevel = {
  id: 1 | 2 | 3;
  title: string;
  subtitle: string;
  description: string;
  intensity: number; // 1-5
  dares: Dare[];
  color: string;
  accentColor: string;
};

export type DareProgress = {
  dareId: string;
  completed: boolean;
  skipped: boolean;
  completedAt?: number;
};

export type LevelProgress = {
  levelId: number;
  dareProgress: DareProgress[];
  startedAt?: number;
  completedAt?: number;
};

export type GameProgress = {
  levels: Record<number, LevelProgress>;
  currentLevel?: number;
  currentDareId?: string;
  unlockedLevels: number[];
};

export type ConsentSettings = {
  confirmed: boolean;
  skipAllowed: boolean;
  pauseAllowed: boolean;
  boundaries: string[];
  customBoundaries: string[];
};

export type AppSettings = {
  sequentialUnlock: boolean;
  consent: ConsentSettings;
};

export type AppView =
  | 'landing'
  | 'consent'
  | 'levels'
  | 'dare-grid'
  | 'completion';

export type CustomDare = Dare & { isCustom: true };

