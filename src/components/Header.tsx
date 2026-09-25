import React, { useState } from 'react';
import { Volume2, VolumeX, RefreshCw, Copy, Wifi, WifiOff, Palette } from 'lucide-react';
import { soundService } from '../services/soundService';
import { ColorTheme } from '../types';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRefresh: () => void;
  isSyncing: boolean;
  isOnline: boolean;
  onOpenCopyModal: () => void;
  currentTheme: ColorTheme;
  onChangeTheme: (theme: ColorTheme) => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onRefresh,
  isSyncing,
  isOnline,
  onOpenCopyModal,
  currentTheme,
  onChangeTheme
}) => {
  const [showThemePicker, setShowThemePicker] = useState(false);

  const themeOptions: { id: ColorTheme; name: string; dotClass: string }[] = [
    { id: 'spectral', name: 'SPECTRAL CORE', dotClass: 'bg-gradient-to-r from-violet-500 to-cyan-400' },
    { id: 'emerald', name: 'CYBER EMERALD', dotClass: 'bg-emerald-400' },
    { id: 'crimson', name: 'MAGMA CRIMSON', dotClass: 'bg-rose-500' },
    { id: 'amber', name: 'TITANIUM GOLD', dotClass: 'bg-amber-400' },
    { id: 'arctic', name: 'ARCTIC SAPPHIRE', dotClass: 'bg-sky-400' }
  ];

  return (
    <header className="titanium-glass rounded-2xl p-3 sm:p-4 mb-3 border border-violet-500/20 relative overflow-hidden">
      {/* Top Dynamic Spectral Line based on theme */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-300 ${
        currentTheme === 'emerald'
          ? 'bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-600'
          : currentTheme === 'crimson'
          ? 'bg-gradient-to-r from-rose-500 via-orange-400 to-rose-600'
          : currentTheme === 'amber'
          ? 'bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600'
          : currentTheme === 'arctic'
          ? 'bg-gradient-to-r from-sky-500 via-indigo-300 to-blue-600'
          : 'bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-600'
      }`} />

      <div className="flex items-center justify-between gap-3">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-950 via-slate-900 to-cyan-950 border border-violet-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.25)] shrink-0">
            <span className="font-orbitron text-lg font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-white to-violet-400">
              ☾𖤐
            </span>
          </div>
          <div>
            <h1 className="font-orbitron text-sm sm:text-base font-black tracking-wider text-white leading-tight flex items-center gap-1.5">
              <span>☾ 𝗥𝗛𝗫𝗩𝗠 𖤐</span>
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-orbitron tracking-widest text-cyan-400 font-bold">
                HYPER CORE
              </span>
              <span className="text-slate-600 text-xs">/</span>
              <span className="text-[10px] font-rajdhani font-semibold tracking-wider text-slate-400">
                TARGET ACHIEVER
              </span>
            </div>
          </div>
        </div>

        {/* System Telemetry & Quick Action Icons */}
        <div className="flex items-center gap-2">
          {/* Online & Synced Badges */}
          <div className="hidden sm:flex flex-col text-right mr-1">
            <div className="flex items-center justify-end gap-1.5 text-[9px] font-tech text-emerald-400 font-bold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SYS ● ONLINE</span>
            </div>
            <div className="flex items-center justify-end gap-1.5 text-[9px] font-tech text-cyan-400 font-bold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>DATA ● SYNCED</span>
            </div>
          </div>

          {/* Color Palette Theme Switcher Button */}
          <div className="relative">
            <button
              onClick={() => {
                soundService.click();
                setShowThemePicker(!showThemePicker);
              }}
              className="w-9 h-9 rounded-lg bg-slate-900/60 border border-slate-700/60 hover:border-violet-400/50 hover:bg-violet-950/40 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
              title="Switch Color Theme"
              aria-label="Theme Palette"
            >
              <Palette className="w-4 h-4 text-cyan-400" />
            </button>

            {/* Dropdown Palette */}
            {showThemePicker && (
              <div className="absolute right-0 top-11 z-50 w-44 titanium-glass rounded-xl p-2 border border-slate-700 shadow-2xl space-y-1 font-tech text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[9px] text-slate-500 font-bold px-2 py-1 uppercase tracking-wider">
                  SELECT PALETTE
                </div>
                {themeOptions.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      soundService.click();
                      onChangeTheme(t.id);
                      setShowThemePicker(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                      currentTheme === t.id ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-[10px]">{t.name}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${t.dotClass}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Copy Button */}
          <button
            onClick={() => {
              soundService.click();
              onOpenCopyModal();
            }}
            className="w-9 h-9 rounded-lg bg-slate-900/60 border border-slate-700/60 hover:border-cyan-400/50 hover:bg-cyan-950/40 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="Copy RHXVM Signal Card"
            aria-label="Copy Signal"
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* Sound Toggle Button */}
          <button
            onClick={() => {
              soundService.click();
              onToggleSound();
            }}
            className="w-9 h-9 rounded-lg bg-slate-900/60 border border-slate-700/60 hover:border-violet-400/50 hover:bg-violet-950/40 text-slate-300 hover:text-violet-300 flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title={soundEnabled ? 'Mute Audio Synth' : 'Enable Audio Synth'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Sync Trigger Button */}
          <button
            onClick={() => {
              soundService.click();
              onRefresh();
            }}
            disabled={isSyncing}
            className={`w-9 h-9 rounded-lg bg-slate-900/60 border border-slate-700/60 hover:border-cyan-400/50 hover:bg-cyan-950/40 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition-all cursor-pointer shadow-sm ${
              isSyncing ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            title="Force Synchronize Feed"
            aria-label="Synchronize Data"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Connection Status Indicator */}
          <div className="w-8 h-8 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-center">
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-rose-500" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
