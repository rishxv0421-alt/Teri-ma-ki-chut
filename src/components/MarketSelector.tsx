import React from 'react';
import { GameMarket } from '../types';
import { soundService } from '../services/soundService';

interface MarketSelectorProps {
  currentMarket: GameMarket;
  onSelectMarket: (market: GameMarket) => void;
}

export const MarketSelector: React.FC<MarketSelectorProps> = ({
  currentMarket,
  onSelectMarket
}) => {
  const markets: { id: GameMarket; name: string; tag: string; pace: string }[] = [
    { id: '30S', name: '30 SEC', tag: 'SPRINT CORE', pace: '30s' },
    { id: '1M', name: '1 MIN', tag: 'HYPER PRIME', pace: '60s' },
    { id: '3M', name: '3 MIN', tag: 'DEEP MATRIX', pace: '180s' }
  ];

  return (
    <div className="grid grid-cols-3 gap-2 mb-3">
      {markets.map(m => {
        const isActive = currentMarket === m.id;
        return (
          <button
            key={m.id}
            onClick={() => {
              if (!isActive) {
                soundService.click();
                onSelectMarket(m.id);
              }
            }}
            className={`py-2 px-2 rounded-xl text-center transition-all cursor-pointer relative overflow-hidden ${
              isActive
                ? 'bg-gradient-to-b from-violet-900/80 to-slate-900/90 border border-cyan-400/60 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'bg-slate-950/40 hover:bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isActive && (
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-500" />
            )}
            <div className="font-orbitron text-xs sm:text-sm font-bold tracking-wider">
              {m.name}
            </div>
            <div className="font-tech text-[9px] tracking-widest text-cyan-400/90 mt-0.5">
              {m.tag}
            </div>
          </button>
        );
      })}
    </div>
  );
};
