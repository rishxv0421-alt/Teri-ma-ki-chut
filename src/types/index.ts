export type GameMarket = '30S' | '1M' | '3M';

export type OutcomeType = 'BIG' | 'SMALL';
export type ParityType = 'ODD' | 'EVEN';
export type OutcomeColor = 'RED' | 'GREEN' | 'VIOLET';
export type MatchStatus = 'MATCH' | 'MISS' | 'JACKPOT' | 'PENDING';

export type ColorTheme = 'spectral' | 'emerald' | 'crimson' | 'amber' | 'arctic';

export interface HistoryRecord {
  issue: string;
  number: number;
  type: OutcomeType;
  parity: ParityType;
  color: OutcomeColor;
  time: string;
  verified: boolean;
  status: MatchStatus;
  predictedType?: OutcomeType;
  predictedNum?: number;
  predictedOpp?: number;
}

export interface PredictionState {
  type: OutcomeType;
  number: number;
  opposite: number;
  pair: string;
  color: OutcomeColor;
  parity: ParityType;
  confidence: number;
  pattern: string;
  trend: string;
  volatility: string;
  stakePlan: string;
  ensembleAgreement: number;
}

export interface FusionModuleOutput {
  id: string;
  name: string;
  status: 'ONLINE' | 'ACTIVE' | 'CALIBRATING';
  sampleSize: number;
  signal: string;
  strength: number; // 0 - 100
  evidence: string;
}

export interface TargetLevel {
  level: number;
  code: string;
  name: string;
  reqVerified: number;
  badge: string;
  description: string;
}

export interface VolatilityDataPoint {
  index: number;
  issue: string;
  volatility: number; // 0 - 100
  phase: string;
  resultNum: number;
  resultType: OutcomeType;
  time: string;
}

export interface CustomTargetGoal {
  id: string;
  title: string;
  category: 'WINS' | 'STREAK' | 'VOLUME' | 'ACCURACY';
  targetValue: number;
  currentValue: number;
  achieved: boolean;
  rewardXp: number;
  unlockedAt?: string;
}

export interface StakingPlanStep {
  step: number;
  units: number;
  cumUnits: number;
  targetWinUnits: number;
}

export interface WalkForwardResult {
  tested: number;
  matched: number;
  missed: number;
  accuracy: number;
  sampleSize: number;
  windowSize: number;
  dateRange: string;
}

export interface SystemSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  compactMode: boolean;
  themeIntensity: 'midnight' | 'titanium' | 'spectral';
  colorTheme: ColorTheme;
  historySize: number;
  refreshRate: number; // in seconds
  autoPoll: boolean;
}
