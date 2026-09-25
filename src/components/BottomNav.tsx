import React from 'react';
import { Gauge, Layers, ShieldCheck, History, BarChart2, Terminal } from 'lucide-react';
import { soundService } from '../services/soundService';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'core', label: 'CORE', icon: Gauge },
    { id: 'pipeline', label: 'PIPELINE', icon: Layers },
    { id: 'achiever', label: 'ACHIEVER', icon: ShieldCheck },
    { id: 'history', label: 'HISTORY', icon: History },
    { id: 'validation', label: 'VALIDATE', icon: BarChart2 },
    { id: 'terminal', label: 'TERMINAL', icon: Terminal }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/90 px-2 py-1.5 max-w-lg mx-auto shadow-2xl safe-area-bottom">
      <div className="grid grid-cols-6 gap-1">
        {tabs.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                if (!isActive) {
                  soundService.click();
                  onSelectTab(t.id);
                }
              }}
              className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-all cursor-pointer ${
                isActive
                  ? 'text-cyan-400 bg-cyan-950/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]' : ''}`} />
              <span className="font-orbitron text-[9px] tracking-wider mt-1">
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
