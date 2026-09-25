import React from 'react';
import { SystemSettings, ColorTheme } from '../types';
import { soundService } from '../services/soundService';
import { User, Shield, Sliders, Volume2, Smartphone, HardDrive, RefreshCw, KeyRound, Palette } from 'lucide-react';

interface TerminalSettingsViewProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
  onResetSession: () => void;
}

export const TerminalSettingsView: React.FC<TerminalSettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetSession
}) => {
  const themeOptions: { id: ColorTheme; name: string; dotClass: string }[] = [
    { id: 'spectral', name: 'SPECTRAL CORE', dotClass: 'bg-gradient-to-r from-violet-500 to-cyan-400' },
    { id: 'emerald', name: 'CYBER EMERALD', dotClass: 'bg-emerald-400' },
    { id: 'crimson', name: 'MAGMA CRIMSON', dotClass: 'bg-rose-500' },
    { id: 'amber', name: 'TITANIUM GOLD', dotClass: 'bg-amber-400' },
    { id: 'arctic', name: 'ARCTIC SAPPHIRE', dotClass: 'bg-sky-400' }
  ];

  return (
    <div className="space-y-3">
      {/* Profile & Operator Access Card */}
      <div className="titanium-glass rounded-2xl p-4 sm:p-5 border border-violet-500/25 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-600 via-cyan-400 to-violet-600" />

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-900 to-cyan-950 border border-violet-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(168,85,247,0.25)]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="font-tech text-[10px] text-slate-400">OPERATOR ACCESS</div>
            <h2 className="font-orbitron text-sm sm:text-base font-black text-white tracking-wider">
              RHXVM PRIME TERMINAL
            </h2>
          </div>
        </div>

        {/* Profile Attributes Grid */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800 font-tech text-xs">
          <div>
            <span className="text-slate-500 text-[10px] block">SECURITY CLEARANCE</span>
            <span className="font-bold text-cyan-300">TIER-1 AUTHORIZED</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">ACCESS STATUS</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              OPERATIONAL
            </span>
          </div>
          <div className="pt-2 border-t border-slate-800">
            <span className="text-slate-500 text-[10px] block">SESSION TYPE</span>
            <span className="font-bold text-white">PERSISTENT LOCAL</span>
          </div>
          <div className="pt-2 border-t border-slate-800">
            <span className="text-slate-500 text-[10px] block">LEASE EXPIRY</span>
            <span className="font-bold text-violet-300">30-DAY ROLLING</span>
          </div>
        </div>
      </div>

      {/* System Settings & Customization Card */}
      <div className="titanium-glass rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="font-orbitron text-xs sm:text-sm font-bold text-white tracking-wider">
            SYSTEM ENGINE SETTINGS
          </h3>
        </div>

        {/* Color Theme Selector Grid */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-tech text-xs text-slate-300 font-bold flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              SPECTRAL COLOR PALETTE
            </span>
            <span className="font-tech text-[10px] text-cyan-400 uppercase font-bold">
              {settings.colorTheme}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {themeOptions.map(t => {
              const isSelected = settings.colorTheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    soundService.click();
                    onUpdateSettings({ colorTheme: t.id });
                  }}
                  className={`p-2 rounded-lg text-left font-tech text-xs flex items-center justify-between border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-bold">{t.name}</span>
                  <span className={`w-3 h-3 rounded-full ${t.dotClass}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Toggles List */}
        <div className="space-y-3 font-tech text-xs">
          {/* Audio Synthesis Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-slate-200 font-bold block">Synthesizer Audio</span>
                <span className="text-slate-500 text-[10px]">Real-time resonant Web Audio effects</span>
              </div>
            </div>
            <button
              onClick={() => {
                soundService.click();
                onUpdateSettings({ soundEnabled: !settings.soundEnabled });
              }}
              className={`w-12 h-6 rounded-full transition-all cursor-pointer p-0.5 ${
                settings.soundEnabled ? 'bg-cyan-500 justify-end' : 'bg-slate-800 justify-start'
              } flex items-center`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* Haptic Feedback Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-violet-400" />
              <div>
                <span className="text-slate-200 font-bold block">Haptic Feedback</span>
                <span className="text-slate-500 text-[10px]">Tactile vibration on results (Android/Mobile)</span>
              </div>
            </div>
            <button
              onClick={() => {
                soundService.click();
                if (navigator.vibrate) navigator.vibrate(30);
                onUpdateSettings({ hapticEnabled: !settings.hapticEnabled });
              }}
              className={`w-12 h-6 rounded-full transition-all cursor-pointer p-0.5 ${
                settings.hapticEnabled ? 'bg-violet-500 justify-end' : 'bg-slate-800 justify-start'
              } flex items-center`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* Compact View Mode */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-slate-200 font-bold block">Compact View Mode</span>
                <span className="text-slate-500 text-[10px]">High-density tactical UI sizing</span>
              </div>
            </div>
            <button
              onClick={() => {
                soundService.click();
                onUpdateSettings({ compactMode: !settings.compactMode });
              }}
              className={`w-12 h-6 rounded-full transition-all cursor-pointer p-0.5 ${
                settings.compactMode ? 'bg-cyan-500 justify-end' : 'bg-slate-800 justify-start'
              } flex items-center`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* History Capacity Selector */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                History Buffer Capacity
              </span>
              <span className="text-cyan-400 font-orbitron font-bold">
                {settings.historySize} Records
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[100, 250, 500, 1000].map(sz => (
                <button
                  key={sz}
                  onClick={() => {
                    soundService.click();
                    onUpdateSettings({ historySize: sz });
                  }}
                  className={`py-1 rounded text-center font-tech text-[11px] font-bold cursor-pointer transition-all ${
                    settings.historySize === sz
                      ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reset Session Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              soundService.click();
              onResetSession();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-orbitron text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>RESET TERMINAL CACHE</span>
          </button>
        </div>
      </div>

      {/* Security Statement */}
      <div className="titanium-glass rounded-xl p-3 border border-slate-800 text-center font-tech text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
        <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
        <span>ZERO SENSITIVE SECRETS OR ADMIN CREDENTIALS STORED CLIENT-SIDE</span>
      </div>
    </div>
  );
};
