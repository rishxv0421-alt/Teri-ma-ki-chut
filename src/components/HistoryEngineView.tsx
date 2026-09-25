import React, { useState, useMemo } from 'react';
import { HistoryRecord } from '../types';
import { soundService } from '../services/soundService';
import { Search, Download, Trash2, Filter, Check, Clock } from 'lucide-react';

interface HistoryEngineViewProps {
  history: HistoryRecord[];
  onClearHistory: () => void;
}

export const HistoryEngineView: React.FC<HistoryEngineViewProps> = ({
  history,
  onClearHistory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'VERIFIED' | 'BIG' | 'SMALL' | 'ODD' | 'EVEN' | 'MATCH' | 'MISS'>('ALL');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter and search computation
  const filteredRecords = useMemo(() => {
    return history.filter(r => {
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchIssue = r.issue.toLowerCase().includes(q);
        const matchNum = String(r.number).includes(q);
        const matchType = r.type.toLowerCase().includes(q);
        if (!matchIssue && !matchNum && !matchType) return false;
      }

      // Category filter
      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'VERIFIED') return r.verified;
      if (activeFilter === 'BIG') return r.type === 'BIG';
      if (activeFilter === 'SMALL') return r.type === 'SMALL';
      if (activeFilter === 'ODD') return r.parity === 'ODD';
      if (activeFilter === 'EVEN') return r.parity === 'EVEN';
      if (activeFilter === 'MATCH') return r.status === 'MATCH' || r.status === 'JACKPOT';
      if (activeFilter === 'MISS') return r.status === 'MISS';
      return true;
    });
  }, [history, searchQuery, activeFilter]);

  // Export functions
  const handleExportCSV = () => {
    soundService.click();
    if (!history.length) return;

    const headers = ['Issue', 'Result', 'Type', 'Parity', 'Color', 'Time', 'Verified', 'Status'];
    const rows = history.map(r => [
      r.issue,
      r.number,
      r.type,
      r.parity,
      r.color,
      r.time,
      r.verified ? 'YES' : 'NO',
      r.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RHXVM_HISTORY_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    soundService.click();
    if (!history.length) return;

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `RHXVM_HISTORY_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-3">
      {/* Search and Action Bar */}
      <div className="titanium-glass rounded-xl p-3 border border-slate-800 space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search issue or number..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 focus:border-cyan-400/60 text-xs font-tech text-slate-200 outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Export Dropdown / Buttons */}
          <button
            onClick={handleExportCSV}
            className="px-2.5 py-2 rounded-lg bg-slate-900/80 border border-slate-700/80 hover:border-cyan-400 text-slate-300 font-orbitron text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
            title="Export CSV"
          >
            <Download className="w-3 h-3 text-cyan-400" />
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="px-2.5 py-2 rounded-lg bg-slate-900/80 border border-slate-700/80 hover:border-cyan-400 text-slate-300 font-orbitron text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
            title="Export JSON"
          >
            <Download className="w-3 h-3 text-violet-400" />
            <span>JSON</span>
          </button>
          <button
            onClick={() => {
              soundService.click();
              setShowClearConfirm(true);
            }}
            className="p-2 rounded-lg bg-rose-950/40 border border-rose-800/40 hover:border-rose-500 text-rose-400 flex items-center justify-center transition-all cursor-pointer"
            title="Clear History Buffer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap pb-1">
          <Filter className="w-3 h-3 text-slate-500 shrink-0 mr-1" />
          {(['ALL', 'VERIFIED', 'BIG', 'SMALL', 'ODD', 'EVEN', 'MATCH', 'MISS'] as const).map(f => {
            const isActive = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => {
                  soundService.click();
                  setActiveFilter(f);
                }}
                className={`px-2.5 py-1 rounded-md text-[10px] font-orbitron font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* History Header & Buffer Count */}
      <div className="flex items-center justify-between text-xs font-tech text-slate-400 px-1">
        <span>RECORD BUFFER: {filteredRecords.length} / {history.length}</span>
        <span>1000-CAP BUFFER</span>
      </div>

      {/* Table Records List */}
      <div className="titanium-glass rounded-xl border border-slate-800 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-7 gap-1 px-3 py-2 bg-slate-950/80 border-b border-slate-800/80 font-tech text-[10px] text-slate-400 font-bold uppercase">
          <div className="col-span-2">ISSUE</div>
          <div className="text-center">RES</div>
          <div className="text-center">TYPE</div>
          <div className="text-center">PAR</div>
          <div className="text-center">COLOR</div>
          <div className="text-right">VERIFY</div>
        </div>

        {/* Table Body (Max Height with Smooth Scrolling) */}
        <div className="max-h-[440px] overflow-y-auto divide-y divide-slate-800/40">
          {filteredRecords.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-tech text-xs">
              NO RECORDS MATCH CRITERIA
            </div>
          ) : (
            filteredRecords.map((rec, index) => {
              const isFirst = index === 0 && !searchQuery && activeFilter === 'ALL';
              return (
                <div
                  key={rec.issue}
                  className={`grid grid-cols-7 gap-1 px-3 py-2.5 items-center font-tech text-xs transition-colors hover:bg-slate-900/40 ${
                    isFirst ? 'bg-violet-950/20' : ''
                  }`}
                >
                  {/* Issue */}
                  <div className="col-span-2 font-orbitron font-bold text-white flex items-center gap-1.5 truncate">
                    {isFirst && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                    )}
                    <span className="truncate">{rec.issue}</span>
                  </div>

                  {/* Result Number */}
                  <div className="text-center">
                    <span className="inline-block w-6 h-6 rounded bg-slate-800 text-white font-orbitron font-bold leading-6">
                      {rec.number}
                    </span>
                  </div>

                  {/* Type */}
                  <div className="text-center">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        rec.type === 'BIG'
                          ? 'bg-rose-950/80 text-rose-300'
                          : 'bg-cyan-950/80 text-cyan-300'
                      }`}
                    >
                      {rec.type}
                    </span>
                  </div>

                  {/* Parity */}
                  <div className="text-center text-slate-300 text-[11px]">
                    {rec.parity}
                  </div>

                  {/* Color */}
                  <div className="text-center">
                    <span
                      className={`text-[10px] font-bold ${
                        rec.color === 'GREEN'
                          ? 'text-emerald-400'
                          : rec.color === 'RED'
                          ? 'text-rose-400'
                          : 'text-violet-400'
                      }`}
                    >
                      {rec.color}
                    </span>
                  </div>

                  {/* Verification & Accuracy Status */}
                  <div className="text-right">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        rec.status === 'JACKPOT'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          : rec.status === 'MATCH'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : rec.status === 'MISS'
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {rec.status === 'JACKPOT' ? '★ JACKPOT' : rec.status === 'MATCH' ? '✓ MATCH' : rec.status === 'MISS' ? '✕ MISS' : 'VERIFIED'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="titanium-glass rounded-2xl p-5 border border-rose-500/40 max-w-xs w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-950 border border-rose-500/50 mx-auto flex items-center justify-center text-rose-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-orbitron font-bold text-sm text-white">RESET HISTORY BUFFER?</h3>
              <p className="font-tech text-xs text-slate-400 mt-1">
                This will purge local session records. Unique Target Achiever milestones will be preserved.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-orbitron text-xs cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  onClearHistory();
                  setShowClearConfirm(false);
                }}
                className="py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-orbitron text-xs font-bold cursor-pointer"
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
