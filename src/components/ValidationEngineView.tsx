import React, { useState, useMemo } from 'react';
import { HistoryRecord } from '../types';
import { calculateWalkForwardValidation } from '../services/analyticsEngine';
import { soundService } from '../services/soundService';
import { ShieldCheck, RotateCcw, TrendingUp, HelpCircle } from 'lucide-react';

interface ValidationEngineViewProps {
  history: HistoryRecord[];
}

export const ValidationEngineView: React.FC<ValidationEngineViewProps> = ({ history }) => {
  const [windowSize, setWindowSize] = useState<number>(30);
  const [showExplanation, setShowExplanation] = useState(false);

  const validation = useMemo(() => {
    return calculateWalkForwardValidation(history, windowSize);
  }, [history, windowSize]);

  return (
    <div className="space-y-3">
      {/* Header Card */}
      <div className="titanium-glass rounded-2xl p-4 sm:p-5 border border-cyan-400/25 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-violet-500 to-cyan-400" />

        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-tech text-[10px] text-slate-400 tracking-wider">OUT-OF-SAMPLE BACKTEST</div>
              <h2 className="font-orbitron text-sm sm:text-base font-black text-white tracking-wider">
                HISTORICAL VALIDATION
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              soundService.click();
              setShowExplanation(!showExplanation);
            }}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
            title="Explanation of Walk-Forward Methodology"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Methodology Notice */}
        {showExplanation && (
          <div className="mb-4 p-3 rounded-xl bg-slate-950/90 border border-slate-800 font-tech text-xs text-slate-300 space-y-1.5">
            <div className="font-bold text-cyan-300">WALK-FORWARD PROTOCOL:</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every historical record N is tested by computing model weights using ONLY records prior to N (N+1 ... M). Future data is strictly sequestered to eliminate lookahead bias and over-fitting.
            </p>
          </div>
        )}

        {/* Window Selector Tabs */}
        <div className="flex items-center justify-between gap-2 font-tech text-xs mb-4">
          <span className="text-slate-400">TEST WINDOW:</span>
          <div className="flex items-center gap-1">
            {[15, 30, 50, 100].map(sz => (
              <button
                key={sz}
                onClick={() => {
                  soundService.click();
                  setWindowSize(sz);
                }}
                className={`px-2.5 py-1 rounded-md font-orbitron text-[10px] font-bold cursor-pointer transition-all ${
                  windowSize === sz
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {sz} WND
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="font-tech text-[10px] text-slate-400 block uppercase">VALIDATION %</span>
            <span className="font-orbitron font-black text-2xl text-cyan-400 mt-1 block">
              {validation.accuracy}%
            </span>
            <span className="text-[9px] font-tech text-slate-500">HIT EFFICIENCY</span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="font-tech text-[10px] text-slate-400 block uppercase">TESTED</span>
            <span className="font-orbitron font-black text-2xl text-white mt-1 block">
              {validation.tested}
            </span>
            <span className="text-[9px] font-tech text-slate-500">SAMPLE RUNS</span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="font-tech text-[10px] text-slate-400 block uppercase">MATCHED</span>
            <span className="font-orbitron font-black text-2xl text-emerald-400 mt-1 block">
              {validation.matched}
            </span>
            <span className="text-[9px] font-tech text-slate-500">CORRECT CALLS</span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="font-tech text-[10px] text-slate-400 block uppercase">MISSED</span>
            <span className="font-orbitron font-black text-2xl text-rose-400 mt-1 block">
              {validation.missed}
            </span>
            <span className="text-[9px] font-tech text-slate-500">REVERSALS</span>
          </div>
        </div>

        {/* Supplementary Spec Data */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap justify-between text-xs font-tech text-slate-400">
          <div>
            <span>SAMPLE SIZE: </span>
            <span className="text-white font-bold">{validation.sampleSize} VERIFIED</span>
          </div>
          <div>
            <span>ACTIVE WINDOW: </span>
            <span className="text-cyan-400 font-bold">{validation.windowSize} ROUNDS</span>
          </div>
          <div>
            <span>PERIOD RANGE: </span>
            <span className="text-violet-300 font-bold">{validation.dateRange}</span>
          </div>
        </div>
      </div>

      {/* Stability Guarantee */}
      <div className="titanium-glass rounded-xl p-3 border border-slate-800 font-tech text-[10px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>REAL-TIME ADAPTIVE WEIGHTS ACTIVE</span>
        </div>
        <span className="text-slate-500">RHXVM V2 CORE</span>
      </div>
    </div>
  );
};
