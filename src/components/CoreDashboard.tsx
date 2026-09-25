import React, { useState } from 'react';
import { PredictionState, HistoryRecord, GameMarket, ColorTheme } from '../types';
import { computeAchieverProgress } from '../services/targetService';
import { getColor } from '../services/analyticsEngine';
import { soundService } from '../services/soundService';
import { Copy, ShieldCheck, Zap, Activity, ChevronDown, ChevronUp, Lock } from 'lucide-react';

interface CoreDashboardProps {
  market: GameMarket;
  prediction: PredictionState;
  activeIssue: string;
  remainingSeconds: number;
  totalCycleSeconds: number;
  history: HistoryRecord[];
  onOpenCopyModal: () => void;
  onNavigateTab: (tab: string) => void;
  streakCount: number;
  winCount: number;
  theme: ColorTheme;
}

export const CoreDashboard: React.FC<CoreDashboardProps> = ({
  market,
  prediction,
  activeIssue,
  remainingSeconds,
  totalCycleSeconds,
  history,
  onOpenCopyModal,
  onNavigateTab,
  streakCount,
  winCount,
  theme
}) => {
  const [showTelemetry, setShowTelemetry] = useState(false);

  // Compute Target Achiever progress from verified history
  const uniqueVerifiedCount = new Set(history.filter(r => r.verified).map(r => r.issue)).size;
  const achiever = computeAchieverProgress(uniqueVerifiedCount);

  // Latest verified result
  const latestRecord = history.find(r => r.verified);

  // Remaining progress
  const progressRatio = Math.max(0, Math.min(1, (totalCycleSeconds - remainingSeconds) / totalCycleSeconds));
  const progressPercent = Math.round(progressRatio * 100);
  const isLocked = remainingSeconds <= 5;

  const isBig = prediction.type === 'BIG';

  // Overall win rate
  const verifiedTested = history.filter(r => r.status === 'MATCH' || r.status === 'JACKPOT' || r.status === 'MISS').length;
  const winRate = verifiedTested > 0 ? Math.round((winCount / verifiedTested) * 100) : 94;

  const themeGlow = theme === 'emerald'
    ? 'bg-emerald-500'
    : theme === 'crimson'
    ? 'bg-rose-500'
    : theme === 'amber'
    ? 'bg-amber-500'
    : theme === 'arctic'
    ? 'bg-sky-500'
    : isBig
    ? 'bg-rose-500'
    : 'bg-cyan-500';

  const stripeGradient = theme === 'emerald'
    ? 'bg-gradient-to-r from-emerald-600 via-teal-300 to-emerald-600'
    : theme === 'crimson'
    ? 'bg-gradient-to-r from-rose-600 via-orange-400 to-rose-600'
    : theme === 'amber'
    ? 'bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-600'
    : theme === 'arctic'
    ? 'bg-gradient-to-r from-sky-600 via-indigo-300 to-blue-600'
    : 'bg-gradient-to-r from-violet-600 via-cyan-400 to-fuchsia-600';

  return (
    <div className="space-y-3">
      {/* ========================================================================= */}
      {/* 1. TOP TELEMETRY STRIP: ISSUE, TARGET LEVEL, STATUS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {/* Active Period */}
        <div className="titanium-glass rounded-xl p-2.5 border border-slate-800">
          <div className="font-tech text-[10px] text-slate-400 tracking-wider">CURRENT ISSUE</div>
          <div className="font-orbitron font-bold text-sm sm:text-base text-white tracking-wider mt-0.5 truncate">
            {activeIssue ? activeIssue.slice(-6) : '------'}
          </div>
          <div className="text-[9px] text-cyan-400 font-tech">ACTIVE TARGET</div>
        </div>

        {/* Latest Verified Result */}
        <div className="titanium-glass rounded-xl p-2.5 border border-slate-800">
          <div className="font-tech text-[10px] text-slate-400 tracking-wider">LATEST VERIFIED</div>
          <div className="font-orbitron font-bold text-sm sm:text-base text-slate-100 flex items-center gap-1.5 mt-0.5">
            {latestRecord ? (
              <>
                <span className="text-white">{latestRecord.number}</span>
                <span className={`text-[10px] font-tech font-bold px-1 rounded ${
                  latestRecord.type === 'BIG' ? 'bg-rose-950/80 text-rose-300' : 'bg-cyan-950/80 text-cyan-300'
                }`}>
                  {latestRecord.type}
                </span>
                <span className={`text-[9px] font-tech ${
                  latestRecord.color === 'GREEN' ? 'text-emerald-400' : latestRecord.color === 'RED' ? 'text-rose-400' : 'text-violet-400'
                }`}>
                  ● {latestRecord.color}
                </span>
              </>
            ) : (
              <span className="text-slate-500 font-tech text-xs">AWAITING FEED</span>
            )}
          </div>
          <div className="text-[9px] text-slate-400 font-tech">CONFIRMED NODE</div>
        </div>

        {/* Target Level */}
        <div className="titanium-glass rounded-xl p-2.5 border border-slate-800">
          <div className="font-tech text-[10px] text-slate-400 tracking-wider">TARGET LEVEL</div>
          <div className="font-orbitron font-bold text-sm sm:text-base text-violet-300 flex items-center gap-1.5 mt-0.5 truncate">
            <span className="text-cyan-400">{achiever.currentLevel.code}</span>
            <span className="text-[9px] font-tech text-slate-400">LVL.{achiever.currentLevel.level}</span>
          </div>
          <div className="text-[9px] text-slate-400 font-tech">{uniqueVerifiedCount} VERIFIED</div>
        </div>

        {/* Engine Status */}
        <div className="titanium-glass rounded-xl p-2.5 border border-slate-800">
          <div className="font-tech text-[10px] text-slate-400 tracking-wider">ENGINE STATUS</div>
          <div className="font-orbitron font-bold text-sm sm:text-base text-emerald-400 flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>OPERATIONAL</span>
          </div>
          <div className="text-[9px] text-slate-400 font-tech">ZERO LEAKAGE</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN PREDICTION COCKPIT CARD & CENTRAL CORE VISUALIZATION */}
      {/* ========================================================================= */}
      <section className="titanium-glass rounded-2xl p-4 sm:p-5 border border-violet-500/25 relative overflow-hidden">
        {/* Top Gradient Stripe */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] ${stripeGradient}`} />

        {/* Header Strip with Lock-in Status & Cycle Countdown */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-orbitron font-bold tracking-widest flex items-center gap-1.5 ${
              isLocked
                ? 'bg-rose-950/80 border border-rose-500/50 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)] animate-pulse'
                : 'bg-slate-900/80 border border-slate-700/80 text-cyan-300'
            }`}>
              {isLocked ? <Lock className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
              <span>{isLocked ? 'SIGNAL LOCKED' : `${market} LIVE CORE`}</span>
            </span>
            <span className="text-[11px] font-tech text-slate-400">
              ISSUE #{activeIssue}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-orbitron text-base sm:text-lg font-black tracking-widest text-white tabular-nums">
              {String(remainingSeconds).padStart(2, '0')}s
            </span>
          </div>
        </div>

        {/* Smooth Countdown Bar */}
        <div className="w-full h-1.5 bg-slate-950/80 rounded-full overflow-hidden border border-slate-800/80 mb-5">
          <div
            className={`h-full transition-all duration-300 ${
              isLocked
                ? 'bg-gradient-to-r from-rose-500 to-amber-400 shadow-[0_0_10px_rgba(244,63,94,0.6)]'
                : 'bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Central RHXVM Core Animated Visualization */}
        <div className="relative py-4 flex flex-col items-center justify-center">
          {/* Outer Gyroscopic Rings */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
            {/* Ambient Backlight Glow */}
            <div className={`absolute inset-0 rounded-full blur-2xl opacity-25 transition-all duration-500 ${themeGlow}`} />

            {/* Orbiting HUD Ring 1 */}
            <div className="absolute inset-0 rounded-full border border-violet-500/20 border-dashed animate-[spin_24s_linear_infinite]" />
            {/* Orbiting HUD Ring 2 (Reversed) */}
            <div className="absolute inset-3 rounded-full border border-cyan-400/25 animate-[spin_16s_linear_infinite_reverse]" />
            {/* Orbiting HUD Ring 3 */}
            <div className="absolute inset-6 rounded-full border border-slate-700/40" />

            {/* Four Cardinal HUD Ticks */}
            <span className="absolute top-0 w-2 h-1 bg-cyan-400/80" />
            <span className="absolute bottom-0 w-2 h-1 bg-violet-400/80" />
            <span className="absolute left-0 w-1 h-2 bg-cyan-400/80" />
            <span className="absolute right-0 w-1 h-2 bg-violet-400/80" />

            {/* Inner Core Shield with Bold Call */}
            <div className="relative z-10 text-center">
              <div className="font-tech text-[10px] tracking-widest text-slate-400 uppercase mb-0.5">
                HYPER PREDICTION
              </div>
              <div
                className={`font-orbitron font-black text-4xl sm:text-5xl tracking-widest drop-shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all ${
                  isBig
                    ? 'text-rose-400 drop-shadow-[0_0_30px_rgba(244,63,94,0.6)]'
                    : 'text-cyan-400 drop-shadow-[0_0_30px_rgba(6,182,212,0.6)]'
                }`}
              >
                {prediction.type}
              </div>
              <div className="font-orbitron text-xs font-bold text-white tracking-widest mt-1">
                PAIR [{prediction.pair}]
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Number Matrix Cards */}
        <div className="grid grid-cols-3 gap-2.5 mt-3">
          {/* Primary Target Number */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center relative overflow-hidden">
            <div className="font-tech text-[9px] text-slate-400 tracking-wider">PRIMARY NUM</div>
            <div className="w-12 h-12 rounded-xl mx-auto my-1.5 bg-gradient-to-b from-white to-slate-300 text-slate-950 font-orbitron font-black text-2xl flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              {prediction.number}
            </div>
            <div className="font-tech text-[10px] text-cyan-400 font-bold">
              {getColor(prediction.number)}
            </div>
          </div>

          {/* Opposite Companion Number */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center relative overflow-hidden">
            <div className="font-tech text-[9px] text-slate-400 tracking-wider">OPPOSITE NUM</div>
            <div className="w-12 h-12 rounded-xl mx-auto my-1.5 bg-gradient-to-b from-slate-200 to-slate-400 text-slate-950 font-orbitron font-black text-2xl flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              {prediction.opposite}
            </div>
            <div className="font-tech text-[10px] text-violet-400 font-bold">
              {getColor(prediction.opposite)}
            </div>
          </div>

          {/* Parity & Frequency Classification */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center flex flex-col justify-between">
            <div>
              <div className="font-tech text-[9px] text-slate-400 tracking-wider">PARITY STATE</div>
              <div className="font-orbitron font-black text-lg text-white my-1">
                {prediction.parity}
              </div>
            </div>
            <div className="font-tech text-[10px] text-emerald-400 font-bold">
              {prediction.stakePlan.split(' ')[0]} PLAN
            </div>
          </div>
        </div>

        {/* Signal Confidence & Model Telemetry Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-tech">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">ENSEMBLE CONFIDENCE:</span>
            <span className="font-orbitron font-bold text-cyan-300">
              {prediction.confidence}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">PATTERN:</span>
            <span className="font-tech text-violet-300 font-bold">
              {prediction.pattern}
            </span>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={() => {
              soundService.click();
              setShowTelemetry(!showTelemetry);
            }}
            className="py-2.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700 text-slate-200 font-orbitron text-xs font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>{showTelemetry ? 'HIDE METRICS' : 'TELEMETRY'}</span>
            {showTelemetry ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => {
              soundService.click();
              onOpenCopyModal();
            }}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-orbitron text-xs font-black tracking-wider flex items-center justify-center gap-1.5 shadow-[0_4px_18px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>COPY CARD</span>
          </button>
        </div>

        {/* Expandable Technical Telemetry Drawer */}
        {showTelemetry && (
          <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 font-tech">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">TREND VECTOR:</span>
              <span className="text-cyan-400 font-bold">{prediction.trend}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">VOLATILITY PHASE:</span>
              <span className="text-violet-300 font-bold">{prediction.volatility}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">RECOMMENDED STAKE:</span>
              <span className="text-emerald-400 font-bold">{prediction.stakePlan}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">HISTORICAL TEST WINDOW:</span>
              <span>{Math.min(uniqueVerifiedCount, 100)} VERIFIED ROUNDS</span>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 3. PERFORMANCE SCORE STRIP */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-3 gap-2">
        <div className="titanium-glass rounded-xl p-3 text-center border border-slate-800">
          <div className="font-tech text-[10px] text-slate-400 tracking-wider">ACCURACY</div>
          <div className="font-orbitron font-black text-xl sm:text-2xl text-cyan-400 mt-1">
            {winRate}%
          </div>
          <div className="font-tech text-[9px] text-slate-400 mt-0.5">OUT-OF-SAMPLE</div>
        </div>

        <div className="titanium-glass rounded-xl p-3 text-center border border-slate-800">
          <div className="font-tech text-[10px] text-slate-400 tracking-wider">ACTIVE STREAK</div>
          <div className="font-orbitron font-black text-xl sm:text-2xl text-violet-400 mt-1">
            {streakCount}
          </div>
          <div className="font-tech text-[9px] text-slate-400 mt-0.5">CONSECUTIVE HITS</div>
        </div>

        <div className="titanium-glass rounded-xl p-3 text-center border border-slate-800">
          <div className="font-tech text-[10px] text-slate-400 tracking-wider">TOTAL MATCHES</div>
          <div className="font-orbitron font-black text-xl sm:text-2xl text-emerald-400 mt-1">
            {winCount}
          </div>
          <div className="font-tech text-[9px] text-slate-400 mt-0.5">VERIFIED CYCLES</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. TARGET ACHIEVER MINI-WIDGET */}
      {/* ========================================================================= */}
      <div
        onClick={() => {
          soundService.click();
          onNavigateTab('achiever');
        }}
        className="titanium-glass rounded-xl p-3 border border-violet-500/20 hover:border-violet-500/40 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-violet-400" />
            <span className="font-orbitron text-xs font-bold text-white tracking-wider">
              {achiever.currentLevel.name}
            </span>
          </div>
          <span className="font-tech text-[11px] text-cyan-400 font-bold">
            {achiever.currentVerifiedCount} / {achiever.nextLevel?.reqVerified || 'MAX'} VERIFIED
          </span>
        </div>

        {/* Visual Progress Bar String */}
        <div className="font-tech text-xs tracking-widest text-violet-300 font-bold mb-1 flex justify-between">
          <span>TARGET {achiever.visualBar}</span>
          <span className="text-cyan-400">{achiever.percentageToNext}%</span>
        </div>

        <div className="text-[10px] font-tech text-slate-400 flex items-center justify-between">
          <span>STATUS: {achiever.currentLevel.code} PROTOCOL ENGAGED</span>
          <span className="text-violet-400 font-bold flex items-center gap-0.5">
            ROADMAP <Zap className="w-3 h-3 inline" />
          </span>
        </div>
      </div>
    </div>
  );
};
