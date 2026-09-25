import { TargetLevel, CustomTargetGoal, StakingPlanStep } from '../types';

export const TARGET_LEVELS: TargetLevel[] = [
  {
    level: 1,
    code: 'TRACE',
    name: 'LEVEL 01 — TRACE',
    reqVerified: 10,
    badge: 'LVL.01',
    description: 'Initial signal acquisition and baseline sequence telemetry.'
  },
  {
    level: 2,
    code: 'SCAN',
    name: 'LEVEL 02 — SCAN',
    reqVerified: 25,
    badge: 'LVL.02',
    description: 'Multi-frequency calibration and recency weighting convergence.'
  },
  {
    level: 3,
    code: 'PATTERN',
    name: 'LEVEL 03 — PATTERN',
    reqVerified: 50,
    badge: 'LVL.03',
    description: 'Deep Markov transition modeling and 4-step sequence matching.'
  },
  {
    level: 4,
    code: 'DEEP',
    name: 'LEVEL 04 — DEEP',
    reqVerified: 100,
    badge: 'LVL.04',
    description: 'Bayesian historical posterior synthesis & streak momentum index.'
  },
  {
    level: 5,
    code: 'FORENSIC',
    name: 'LEVEL 05 — FORENSIC',
    reqVerified: 250,
    badge: 'LVL.05',
    description: 'Out-of-sample walk-forward validation & volatility phase lock.'
  },
  {
    level: 6,
    code: 'VANTA',
    name: 'LEVEL 06 — VANTA',
    reqVerified: 500,
    badge: 'LVL.06',
    description: 'Maximum theoretical entropy suppression & ultra-core precision.'
  }
];

export const DEFAULT_TARGET_GOALS: CustomTargetGoal[] = [
  {
    id: 'GOAL_01',
    title: 'First Blood: 5 Match Victories',
    category: 'WINS',
    targetValue: 5,
    currentValue: 0,
    achieved: false,
    rewardXp: 100
  },
  {
    id: 'GOAL_02',
    title: 'Flow Master: 4 Consecutive Streak',
    category: 'STREAK',
    targetValue: 4,
    currentValue: 0,
    achieved: false,
    rewardXp: 250
  },
  {
    id: 'GOAL_03',
    title: 'Precision Shield: 95% Accuracy',
    category: 'ACCURACY',
    targetValue: 95,
    currentValue: 0,
    achieved: false,
    rewardXp: 400
  },
  {
    id: 'GOAL_04',
    title: 'Vanta Grinder: 50 Verified Cycles',
    category: 'VOLUME',
    targetValue: 50,
    currentValue: 0,
    achieved: false,
    rewardXp: 600
  },
  {
    id: 'GOAL_05',
    title: 'Apex Dominance: 10 Consecutive Streak',
    category: 'STREAK',
    targetValue: 10,
    currentValue: 0,
    achieved: false,
    rewardXp: 1000
  }
];

export function computeStakingPlan(
  profile: 'CONSERVATIVE' | 'COMPOUND' | 'FIBONACCI' | 'MARTINGALE',
  baseUnit = 10,
  maxSteps = 6
): StakingPlanStep[] {
  const steps: StakingPlanStep[] = [];
  let cum = 0;

  for (let i = 1; i <= maxSteps; i++) {
    let multiplier = 1;
    if (profile === 'CONSERVATIVE') {
      multiplier = 1;
    } else if (profile === 'COMPOUND') {
      // 1, 2, 3, 5, 8, 12
      const seq = [1, 2, 3, 5, 8, 12, 18, 25];
      multiplier = seq[i - 1] || seq[seq.length - 1];
    } else if (profile === 'FIBONACCI') {
      // 1, 1, 2, 3, 5, 8
      const fib = [1, 1, 2, 3, 5, 8, 13, 21];
      multiplier = fib[i - 1] || fib[fib.length - 1];
    } else if (profile === 'MARTINGALE') {
      multiplier = Math.pow(2, i - 1);
    }

    const units = baseUnit * multiplier;
    cum += units;
    // Estimated return (assuming standard 1.95x WingGo payout on Big/Small)
    const targetWinUnits = Math.round(units * 1.95 - cum);

    steps.push({
      step: i,
      units,
      cumUnits: cum,
      targetWinUnits
    });
  }

  return steps;
}

export interface AchieverProgress {
  currentVerifiedCount: number;
  currentLevel: TargetLevel;
  nextLevel: TargetLevel | null;
  percentageToNext: number;
  visualBar: string;
}

export function computeAchieverProgress(uniqueVerifiedCount: number): AchieverProgress {
  let activeLevel = TARGET_LEVELS[0];
  let nextLevel: TargetLevel | null = TARGET_LEVELS[1];

  for (let i = TARGET_LEVELS.length - 1; i >= 0; i--) {
    if (uniqueVerifiedCount >= TARGET_LEVELS[i].reqVerified) {
      activeLevel = TARGET_LEVELS[i];
      nextLevel = i < TARGET_LEVELS.length - 1 ? TARGET_LEVELS[i + 1] : null;
      break;
    }
  }

  let pct = 0;
  if (!nextLevel) {
    pct = 100;
  } else {
    const prevBase = activeLevel.reqVerified;
    const nextReq = nextLevel.reqVerified;
    const countAboveBase = Math.max(0, uniqueVerifiedCount - (activeLevel.level === 1 && uniqueVerifiedCount < 10 ? 0 : prevBase));
    const span = activeLevel.level === 1 && uniqueVerifiedCount < 10 ? 10 : (nextReq - prevBase);
    pct = Math.min(100, Math.max(0, Math.round((countAboveBase / span) * 100)));
  }

  const totalBlocks = 12;
  const filledBlocks = Math.min(totalBlocks, Math.round((pct / 100) * totalBlocks));
  const emptyBlocks = totalBlocks - filledBlocks;
  const visualBar = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

  return {
    currentVerifiedCount: uniqueVerifiedCount,
    currentLevel: activeLevel,
    nextLevel,
    percentageToNext: pct,
    visualBar
  };
}
