import React, { useState } from 'react';
import { PredictionState } from '../types';
import { soundService } from '../services/soundService';
import { Copy, Check, X } from 'lucide-react';

interface CopyModalProps {
  prediction: PredictionState;
  activeIssue: string;
  targetLevelName: string;
  validationRate: number;
  isOpen: boolean;
  onClose: () => void;
}

export const CopyModal: React.FC<CopyModalProps> = ({
  prediction,
  activeIssue,
  targetLevelName,
  validationRate,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build the exact formatted card requested in Section 10
  const copyCardText = `☾ 𝗥𝗛𝗫𝗩𝗠 𖤐
𝗛𝗬𝗣𝗘𝗥 𝗖𝗢𝗥𝗘

𝗜𝗦𝗦𝗨𝗘: ${activeIssue}
𝗥𝗘𝗦𝗨𝗟𝗧: ${prediction.type} (${prediction.number})
𝗧𝗥𝗘𝗡𝗗: ${prediction.trend}
𝗣𝗔𝗧𝗧𝗘𝗥𝗡: ${prediction.pattern}
𝗩𝗢𝗟𝗔𝗧𝗜𝗟𝗜𝗧𝗬: ${prediction.volatility}
𝗧𝗔𝗥𝗚𝗘𝗧: ${targetLevelName}
𝗩𝗔𝗟𝗜𝗗𝗔𝗧𝗜𝗢𝗡: ${validationRate}%

⚡ RHXVM`;

  const handleCopy = async () => {
    soundService.copy();
    let success = false;

    // Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(copyCardText);
        success = true;
      } catch {
        success = false;
      }
    }

    // Fallback textarea
    if (!success) {
      try {
        const ta = document.createElement('textarea');
        ta.value = copyCardText;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        success = true;
      } catch {
        success = false;
      }
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="titanium-glass rounded-2xl p-5 border border-cyan-400/40 max-w-sm w-full relative shadow-[0_0_35px_rgba(6,182,212,0.25)]">
        {/* Close Button */}
        <button
          onClick={() => {
            soundService.click();
            onClose();
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-3">
          <h3 className="font-orbitron font-bold text-sm text-white tracking-widest">
            ☾ RHXVM SIGNAL CARD 𖤐
          </h3>
          <p className="font-tech text-xs text-slate-400 mt-0.5">
            ONE-TAP COCKPIT TRANSMISSION
          </p>
        </div>

        {/* Formatted Text Preview Area */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-tech text-xs sm:text-sm text-cyan-300 leading-relaxed whitespace-pre font-mono my-3 overflow-x-auto shadow-inner">
          {copyCardText}
        </div>

        {/* Copy Button */}
        <div className="space-y-2 mt-4">
          <button
            onClick={handleCopy}
            className={`w-full py-2.5 rounded-xl font-orbitron text-xs font-black tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-[0_4px_18px_rgba(6,182,212,0.3)]'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY TO CLIPBOARD'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
