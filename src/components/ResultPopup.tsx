import React from 'react';
import { HistoryRecord } from '../types';
import { soundService } from '../services/soundService';
import { CheckCircle2, XCircle, Star, X } from 'lucide-react';

interface ResultPopupProps {
  record: HistoryRecord | null;
  targetLevelName: string;
  onClose: () => void;
}

export const ResultPopup: React.FC<ResultPopupProps> = ({
  record,
  targetLevelName,
  onClose
}) => {
  if (!record) return null;

  const isJackpot = record.status === 'JACKPOT';
  const isMatch = record.status === 'MATCH';
  const isMiss = record.status === 'MISS';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="titanium-glass rounded-2xl p-5 sm:p-6 border border-violet-500/40 max-w-sm w-full relative overflow-hidden text-center shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        {/* Top Glow Stripe */}
        <div className={`absolute top-0 left-0 right-0 h-[3px] ${
          isJackpot
            ? 'bg-gradient-to-r from-amber-400 via-white to-amber-400'
            : isMatch
            ? 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400'
            : 'bg-gradient-to-r from-slate-600 via-rose-500 to-slate-600'
        }`} />

        {/* Close Button */}
        <button
          onClick={() => {
            soundService.click();
            onClose();
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Icon Lockup */}
        <div className="w-14 h-14 rounded-2xl mx-auto mb-3 bg-gradient-to-br from-violet-950 via-slate-900 to-cyan-950 border border-violet-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
          <span className="font-orbitron text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-violet-300">
            ☾𖤐
          </span>
        </div>

        {/* Primary Header */}
        <div className="font-orbitron font-black text-lg text-white tracking-widest">
          ☾ RHXVM 𖤐
        </div>
        <div className="font-tech text-xs tracking-widest text-cyan-400 font-bold mb-4">
          VERIFIED RESULT
        </div>

        {/* Issue & Result Digit Grid */}
        <div className="grid grid-cols-2 gap-2.5 my-3">
          {/* Issue */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="font-tech text-[10px] text-slate-400 block tracking-wider">ISSUE</span>
            <span className="font-orbitron font-bold text-sm sm:text-base text-white mt-0.5 block truncate">
              {record.issue.slice(-6)}
            </span>
          </div>

          {/* Number Result */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="font-tech text-[10px] text-slate-400 block tracking-wider">RESULT</span>
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <span className="font-orbitron font-black text-xl text-white">
                {record.number}
              </span>
              <span className={`text-[10px] font-tech font-bold px-1 rounded ${
                record.type === 'BIG' ? 'bg-rose-950 text-rose-300' : 'bg-cyan-950 text-cyan-300'
              }`}>
                {record.type}
              </span>
            </div>
          </div>
        </div>

        {/* Validation Status Block */}
        <div className={`p-3 rounded-xl border my-3 flex items-center justify-center gap-2 font-orbitron text-sm font-bold tracking-wider ${
          isJackpot
            ? 'bg-amber-950/50 border-amber-500/40 text-amber-300'
            : isMatch
            ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
            : 'bg-rose-950/50 border-rose-500/40 text-rose-300'
        }`}>
          {isJackpot && <Star className="w-4 h-4 fill-amber-300" />}
          {isMatch && <CheckCircle2 className="w-4 h-4" />}
          {isMiss && <XCircle className="w-4 h-4" />}

          <span>VALIDATION: {isJackpot ? '★ JACKPOT PAIR MATCH' : isMatch ? '✓ MATCH' : '✕ MISS'}</span>
        </div>

        {/* Target Level Info */}
        <div className="font-tech text-xs text-slate-400 py-1 flex items-center justify-between border-t border-slate-800/80">
          <span>TARGET STATUS:</span>
          <span className="font-orbitron text-violet-300 font-bold">
            {targetLevelName}
          </span>
        </div>

        {/* Continue Action Button */}
        <button
          onClick={() => {
            soundService.click();
            onClose();
          }}
          className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-orbitron text-xs font-black tracking-widest cursor-pointer shadow-md"
        >
          CONFIRM & PROCEED
        </button>
      </div>
    </div>
  );
};
