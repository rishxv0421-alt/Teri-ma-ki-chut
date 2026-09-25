import React, { useState } from 'react';
import { TARGET_LEVELS, computeAchieverProgress, DEFAULT_TARGET_GOALS, computeStakingPlan } from '../services/targetService';
import { CustomTargetGoal, ColorTheme } from '../types';
import { soundService } from '../services/soundService';
import { ShieldCheck, Target, Award, Lock, Zap, CheckCircle2, TrendingUp, Calculator, Plus, Sparkles } from 'lucide-react';

interface TargetAchieverViewProps {
  verifiedCount: number;
  streakCount: number;
  winCount: number;
  accuracyRate: number;
  theme: ColorTheme;
}

export const TargetAchieverView: React.FC<TargetAchieverViewProps> = ({
  verifiedCount,
  streakCount,
  winCount,
  accuracyRate,
  theme
}) => {
  const achiever = computeAchieverProgress(verifiedCount);

  // Active sub-tab inside Target System: Milestones, Goal Tracker, or Staking Matrix
  const [subTab, setSubTab] = useState<'MILESTONES' | 'GOALS' | 'STAKING'>('MILESTONES');

  // Custom Target Goals with state
  const [goals, setGoals] = useState<CustomTargetGoal[]>(() => {
    try {
      const saved = localStorage.getItem('rhxvm_target_goals');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_TARGET_GOALS;
  });

  // Staking Calculator parameters
  const [riskProfile, setRiskProfile] = useState<'CONSERVATIVE' | 'COMPOUND' | 'FIBONACCI' | 'MARTINGALE'>('COMPOUND');
  const [baseUnit, setBaseUnit] = useState<number>(10);

  // New Custom Goal Dialog state
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState<'WINS' | 'STREAK' | 'VOLUME' | 'ACCURACY'>('WINS');
  const [newGoalTarget, setNewGoalTarget] = useState<number>(15);

  const stakingPlan = computeStakingPlan(riskProfile, baseUnit, 6);

  // Update goal progress with live session metrics
  const liveGoals = goals.map(g => {
    let current = g.currentValue;
    if (g.category === 'WINS') current = winCount;
    if (g.category === 'STREAK') current = streakCount;
    if (g.category === 'VOLUME') current = verifiedCount;
    if (g.category === 'ACCURACY') current = accuracyRate;

    const achieved = current >= g.targetValue;
    return {
      ...g,
      currentValue: current,
      achieved
    };
  });

  const handleClaimGoal = (id: string) => {
    soundService.win();
    if (navigator.vibrate) navigator.vibrate(60);
    const updated = goals.map(g => {
      if (g.id === id) {
        return { ...g, unlockedAt: new Date().toLocaleTimeString() };
      }
      return g;
    });
    setGoals(updated);
    try {
      localStorage.setItem('rhxvm_target_goals', JSON.stringify(updated));
    } catch {}
  };

  const handleAddGoal = () => {
    if (!newGoalTitle.trim() || newGoalTarget <= 0) return;
    soundService.levelUp();
    const newG: CustomTargetGoal = {
      id: `GOAL_CUSTOM_${Date.now()}`,
      title: newGoalTitle.trim(),
      category: newGoalCategory,
      targetValue: newGoalTarget,
      currentValue: 0,
      achieved: false,
      rewardXp: newGoalTarget * 20
    };
    const updated = [...goals, newG];
    setGoals(updated);
    try {
      localStorage.setItem('rhxvm_target_goals', JSON.stringify(updated));
    } catch {}
    setNewGoalTitle('');
    setShowGoalModal(false);
  };

  return (
    <div className="space-y-3">
      {/* Target Status Hero Card */}
      <div className="titanium-glass rounded-2xl p-4 sm:p-5 border border-violet-500/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-600 via-cyan-400 to-fuchsia-600" />

        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-tech text-[10px] text-slate-400 tracking-wider">RHXVM TARGET ENGINE</div>
              <h2 className="font-orbitron text-sm sm:text-base font-black text-white tracking-wider flex items-center gap-1.5">
                <span>TARGET ACHIEVER</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="px-2.5 py-1 rounded-md bg-violet-950/80 border border-violet-500/40 text-violet-300 font-orbitron text-xs font-bold">
              {achiever.currentLevel.code}
            </span>
          </div>
        </div>

        {/* Display Format Mandated: TARGET, CURRENT, NEXT, STATUS */}
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
          <div className="font-tech text-xs sm:text-sm tracking-widest text-cyan-400 font-bold flex justify-between items-center">
            <span>TARGET {achiever.visualBar}</span>
            <span className="text-white">{achiever.percentageToNext}%</span>
          </div>

          <div className="grid grid-cols-3 gap-2 font-tech text-xs pt-1 border-t border-slate-800/80">
            <div>
              <span className="text-slate-500 text-[10px] block">CURRENT</span>
              <span className="font-bold text-white text-sm">{achiever.currentVerifiedCount}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">NEXT TARGET</span>
              <span className="font-bold text-violet-400 text-sm">
                {achiever.nextLevel ? `${achiever.nextLevel.reqVerified}` : 'MAX ACHIEVED'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">STATUS</span>
              <span className="font-bold text-emerald-400 text-[11px] truncate block">
                {achiever.currentLevel.code} ANALYSIS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Sub-Navigation Selector */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
        <button
          onClick={() => {
            soundService.click();
            setSubTab('MILESTONES');
          }}
          className={`py-2 px-1 text-center font-orbitron text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
            subTab === 'MILESTONES'
              ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>LEVELS</span>
        </button>

        <button
          onClick={() => {
            soundService.click();
            setSubTab('GOALS');
          }}
          className={`py-2 px-1 text-center font-orbitron text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
            subTab === 'GOALS'
              ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>OBJECTIVES</span>
        </button>

        <button
          onClick={() => {
            soundService.click();
            setSubTab('STAKING');
          }}
          className={`py-2 px-1 text-center font-orbitron text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
            subTab === 'STAKING'
              ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>STAKE PLAN</span>
        </button>
      </div>

      {/* SUB-VIEW 1: LEVEL MILESTONES */}
      {subTab === 'MILESTONES' && (
        <div className="space-y-2">
          <div className="font-orbitron text-xs font-bold text-slate-300 tracking-wider px-1">
            VERIFIED PROTOCOL LEVELS
          </div>

          {TARGET_LEVELS.map(lvl => {
            const isUnlocked = verifiedCount >= lvl.reqVerified;
            const isCurrent = achiever.currentLevel.level === lvl.level;

            return (
              <div
                key={lvl.level}
                className={`titanium-glass rounded-xl p-3.5 border transition-all ${
                  isCurrent
                    ? 'border-cyan-400/50 bg-gradient-to-r from-violet-950/40 to-slate-900/60 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : isUnlocked
                    ? 'border-emerald-500/25 bg-slate-950/50'
                    : 'border-slate-800/60 opacity-60 bg-slate-950/30'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-orbitron font-bold text-xs shrink-0 ${
                        isUnlocked
                          ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-400'
                          : 'bg-slate-900 border border-slate-800 text-slate-500'
                      }`}
                    >
                      {isUnlocked ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="font-orbitron text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                        <span>{lvl.name}</span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-tech font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="font-tech text-[10px] text-slate-400 mt-0.5">
                        {lvl.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-tech text-xs font-bold text-slate-300">
                      {lvl.reqVerified}
                    </span>
                    <span className="text-[10px] font-tech text-slate-500 block">
                      VERIFIED
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-VIEW 2: CUSTOM OBJECTIVES & GOAL TRACKER */}
      {subTab === 'GOALS' && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="font-orbitron text-xs font-bold text-slate-300 tracking-wider">
              TACTICAL TARGET OBJECTIVES
            </span>
            <button
              onClick={() => {
                soundService.click();
                setShowGoalModal(true);
              }}
              className="px-2 py-1 rounded-md bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-400 font-orbitron text-[10px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>SET GOAL</span>
            </button>
          </div>

          <div className="space-y-2">
            {liveGoals.map(g => {
              const progressRatio = Math.min(1, Math.max(0, g.currentValue / g.targetValue));
              const progressPct = Math.round(progressRatio * 100);

              return (
                <div
                  key={g.id}
                  className={`titanium-glass rounded-xl p-3 border transition-all ${
                    g.achieved
                      ? 'border-emerald-500/40 bg-slate-950/60 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                      : 'border-slate-800/80 bg-slate-950/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="font-orbitron text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{g.title}</span>
                        <span className="px-1.5 py-0.2 rounded text-[8px] font-tech font-bold bg-slate-800 text-slate-400">
                          {g.category}
                        </span>
                      </div>
                      <div className="font-tech text-[10px] text-slate-400 mt-0.5">
                        PROGRESS: {g.currentValue} / {g.targetValue} {g.category === 'ACCURACY' ? '%' : ''}
                      </div>
                    </div>

                    {g.achieved ? (
                      <button
                        onClick={() => handleClaimGoal(g.id)}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-orbitron text-[9px] font-black tracking-wider cursor-pointer shadow-sm animate-pulse"
                      >
                        CLAIM +{g.rewardXp} XP
                      </button>
                    ) : (
                      <span className="text-[10px] font-tech font-bold text-violet-400">
                        +{g.rewardXp} XP
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        g.achieved
                          ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                          : 'bg-gradient-to-r from-violet-600 to-cyan-500'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: INTERACTIVE STAKING PLAN CALCULATOR */}
      {subTab === 'STAKING' && (
        <div className="space-y-3">
          <div className="titanium-glass rounded-xl p-3 sm:p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-orbitron text-xs font-bold text-white block">
                  CAPITAL PRESERVATION MATRIX
                </span>
                <span className="font-tech text-[10px] text-slate-400">
                  OPTIMIZED UNIT ALLOCATION BY RISK TOLERANCE
                </span>
              </div>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>

            {/* Profile Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-tech text-xs">
              {(['CONSERVATIVE', 'COMPOUND', 'FIBONACCI', 'MARTINGALE'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => {
                    soundService.click();
                    setRiskProfile(p);
                  }}
                  className={`py-1.5 px-1 rounded-lg font-orbitron text-[9px] font-bold cursor-pointer transition-all ${
                    riskProfile === p
                      ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Base Unit Selector */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 font-tech text-xs">
              <span className="text-slate-400">BASE UNIT SIZE:</span>
              <div className="flex items-center gap-1.5">
                {[10, 50, 100, 200].map(amt => (
                  <button
                    key={amt}
                    onClick={() => {
                      soundService.click();
                      setBaseUnit(amt);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-orbitron font-bold cursor-pointer ${
                      baseUnit === amt
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Staking Plan Schedule Table */}
            <div className="rounded-lg border border-slate-800 overflow-hidden font-tech text-xs">
              <div className="grid grid-cols-4 gap-1 p-2 bg-slate-900 font-bold text-[10px] text-slate-400 uppercase text-center">
                <div>STEP</div>
                <div>BET UNITS</div>
                <div>CUMULATIVE</div>
                <div>NET PROFIT</div>
              </div>
              <div className="divide-y divide-slate-800/60 bg-slate-950/70 text-center">
                {stakingPlan.map(s => (
                  <div key={s.step} className="grid grid-cols-4 gap-1 p-2 text-slate-200">
                    <div className="font-orbitron font-bold text-cyan-400">#{s.step}</div>
                    <div>${s.units}</div>
                    <div className="text-slate-400">${s.cumUnits}</div>
                    <div className="font-bold text-emerald-400">+${s.targetWinUnits}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Custom Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="titanium-glass rounded-2xl p-5 border border-cyan-400/40 max-w-sm w-full space-y-3">
            <h3 className="font-orbitron font-bold text-sm text-white">SET CUSTOM TARGET OBJECTIVE</h3>

            <div className="space-y-2 font-tech text-xs">
              <div>
                <label className="text-slate-400 block mb-1">GOAL TITLE</label>
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={e => setNewGoalTitle(e.target.value)}
                  placeholder="e.g. Daily Target 15 Wins"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">CATEGORY</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['WINS', 'STREAK', 'VOLUME', 'ACCURACY'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setNewGoalCategory(cat)}
                      className={`py-1.5 rounded text-[10px] font-orbitron font-bold cursor-pointer ${
                        newGoalCategory === cat
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-900 border border-slate-800 text-slate-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">TARGET VALUE</label>
                <input
                  type="number"
                  value={newGoalTarget}
                  onChange={e => setNewGoalTarget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowGoalModal(false)}
                className="py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-orbitron text-xs cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={handleAddGoal}
                className="py-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-orbitron text-xs font-bold cursor-pointer shadow-md"
              >
                SAVE TARGET
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
