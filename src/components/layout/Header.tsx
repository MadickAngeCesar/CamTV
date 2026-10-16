import React from 'react';
import { Tv, Sliders } from 'lucide-react';

export type NavTab = 'home' | 'channels' | 'watch' | 'favourites' | 'guide' | 'settings' | 'about';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  favoritesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#070b13]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('home')}
          className="text-lg font-black tracking-tight text-white flex items-center gap-2.5 hover:opacity-95 transition-opacity whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg p-1 -ml-1"
          aria-label="CamTV Home"
        >
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 via-emerald-600 to-amber-500 flex items-center justify-center text-slate-950 font-black text-xs shadow-md shadow-emerald-950/40">
            <Tv className="w-4 h-4 text-slate-950 stroke-[2.8]" />
          </span>
          <span className="text-white text-lg tracking-tight">Cam<span className="text-emerald-400">TV</span></span>
        </button>

        {/* Zone 2: 5 clean concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-300">
          <button
            onClick={() => onSelectTab('home')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1.5 relative hover:text-white ${
              currentTab === 'home' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <span>Home</span>
            {currentTab === 'home' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('channels')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1.5 relative hover:text-white ${
              currentTab === 'channels' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <span>Channels</span>
            {currentTab === 'channels' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('watch')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1.5 relative hover:text-white ${
              currentTab === 'watch' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <span>Watch</span>
            {currentTab === 'watch' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('favourites')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1.5 relative hover:text-white flex items-center gap-1.5 ${
              currentTab === 'favourites' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <span>Favourites</span>
            {favoritesCount > 0 && (
              <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                ({favoritesCount})
              </span>
            )}
            {currentTab === 'favourites' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('guide')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1.5 relative hover:text-white ${
              currentTab === 'guide' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <span>TV Guide</span>
            {currentTab === 'guide' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onSelectTab('settings')}
            className="min-h-[38px] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors flex items-center gap-1.5 shrink-0"
            aria-label="Application Settings"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          <button
            onClick={() => onSelectTab('watch')}
            className="min-h-[38px] px-3.5 sm:px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all whitespace-nowrap shrink-0 shadow-md shadow-emerald-500/25 active:scale-95"
          >
            Watch Live
          </button>
        </div>
      </div>
    </header>
  );
};
