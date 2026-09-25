import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-6 pt-4 pb-16 sm:pb-6 text-center border-t border-slate-800/80 space-y-1.5">
      <div className="font-orbitron text-xs sm:text-sm font-bold tracking-widest text-slate-300">
        𝗦𝗖𝗔𝗡 • 𝗔𝗡𝗔𝗟𝗬𝗭𝗘 • 𝗩𝗔𝗟𝗜𝗗𝗔𝗧𝗘
      </div>
      <div className="font-tech text-xs tracking-wider text-cyan-400/90 flex items-center justify-center gap-1.5 font-bold">
        <span>⚡ RHXVM</span>
        <span className="text-slate-600">·</span>
        <span className="text-slate-400">HYPER CORE V2</span>
        <span className="text-slate-600">·</span>
        <span className="text-violet-400">TARGET ACHIEVER</span>
      </div>
    </footer>
  );
};
