import React from 'react';
import { FusionModuleOutput, PredictionState, HistoryRecord, ColorTheme } from '../types';
import { D3VolatilityChart } from './D3VolatilityChart';
import { Layers, Activity, CheckCircle2 } from 'lucide-react';

interface FusionPipelineViewProps {
  modules: FusionModuleOutput[];
  prediction: PredictionState;
  verifiedCount: number;
  history: HistoryRecord[];
  theme: ColorTheme;
}

export const FusionPipelineView: React.FC<FusionPipelineViewProps> = ({
  modules,
  prediction,
  verifiedCount,
  history,
  theme
}) => {
  return (
    <div className="space-y-3">
      {/* Header Info Banner */}
      <div className="titanium-glass rounded-xl p-3 sm:p-4 border border-violet-500/20">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-950/80 border border-violet-500/40 flex items-center justify-center text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-orbitron text-xs sm:text-sm font-bold text-white tracking-wider">
                FUSION ANALYTICS PIPELINE
              </h2>
              <p className="font-tech text-[10px] text-slate-400">
                10-MODULE DECOUPLED SYNTHESIS & D3.JS TELEMETRY
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-orbitron text-sm font-black text-cyan-400">
              {prediction.confidence}%
            </div>
            <div className="font-tech text-[9px] text-slate-400">
              AGREEMENT SCORE
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Flow Visualization */}
      <div className="titanium-glass rounded-xl p-3 border border-slate-800 text-[10px] font-tech text-slate-400 overflow-x-auto whitespace-nowrap flex items-center gap-1.5 py-2.5">
        <span className="text-cyan-400 font-bold">DATA</span>
        <span>→</span>
        <span>NORM</span>
        <span>→</span>
        <span>RECENCY</span>
        <span>→</span>
        <span>PATTERN</span>
        <span>→</span>
        <span>TREND</span>
        <span>→</span>
        <span>FREQ</span>
        <span>→</span>
        <span>TRANS</span>
        <span>→</span>
        <span className="text-cyan-300 font-bold">D3_VOLATILITY</span>
        <span>→</span>
        <span>SEQ</span>
        <span>→</span>
        <span className="text-violet-400 font-bold">ENSEMBLE</span>
        <span>→</span>
        <span className="text-emerald-400 font-bold">VALIDATION</span>
      </div>

      {/* D3.js Line Chart Integration */}
      <D3VolatilityChart history={history} theme={theme} />

      {/* Module Breakdown Header */}
      <div className="flex items-center justify-between text-xs font-orbitron font-bold text-slate-300 px-1 pt-1">
        <span>INDEPENDENT ANALYTICAL NODES</span>
        <span className="font-tech text-slate-500 text-[10px]">{modules.length} VERIFIED MODULES</span>
      </div>

      {/* Module Cards Grid */}
      <div className="space-y-2">
        {modules.map((mod, idx) => (
          <div
            key={mod.id || idx}
            className="titanium-glass rounded-xl p-3 border border-slate-800 hover:border-violet-500/30 transition-all space-y-2"
          >
            {/* Top row: Name, Status, Sample Size */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-orbitron text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <span>{mod.name}</span>
                </div>
                <div className="font-tech text-[10px] text-slate-400 mt-0.5">
                  SAMPLE SIZE: {mod.sampleSize} VERIFIED CYCLES
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[9px] font-tech font-bold tracking-wider ${
                  mod.status === 'ACTIVE'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                    : mod.status === 'ONLINE'
                    ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/30'
                    : 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                }`}>
                  {mod.status}
                </span>
              </div>
            </div>

            {/* Signal & Strength Meter */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 font-tech text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block">MODULE SIGNAL</span>
                <span className="font-bold text-cyan-300">{mod.signal}</span>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
                  <span>STRENGTH</span>
                  <span className="text-violet-300 font-bold">{mod.strength}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-cyan-400"
                    style={{ width: `${Math.min(100, Math.max(5, mod.strength))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Evidence Rationale Text */}
            <div className="font-tech text-[11px] text-slate-300 leading-relaxed bg-slate-900/30 p-2 rounded border border-slate-800/50">
              <span className="text-slate-500 mr-1.5">EVIDENCE:</span>
              <span>{mod.evidence}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Transparency Guarantee Footer */}
      <div className="titanium-glass rounded-xl p-3 border border-slate-800 text-center font-tech text-[10px] text-slate-400">
        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 inline mr-1" />
        <span>RHXVM PRINCIPLE: ZERO HALLUCINATED CONFIDENCE. ALL WEIGHTS ROOTED IN OUT-OF-SAMPLE DATA.</span>
      </div>
    </div>
  );
};
