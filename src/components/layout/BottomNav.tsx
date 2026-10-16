import React from 'react';
import { NavTab } from './Header';
import { Home, Compass, Tv, Heart, Calendar } from 'lucide-react';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  favoritesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  favoritesCount,
}) => {
  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070b13]/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1 shadow-2xl"
    >
      <div className="grid grid-cols-5 items-center h-13 max-w-md mx-auto">
        <button
          onClick={() => onSelectTab('home')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
            currentTab === 'home' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Home</span>
        </button>

        <button
          onClick={() => onSelectTab('channels')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
            currentTab === 'channels' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Channels"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Channels</span>
        </button>

        <button
          onClick={() => onSelectTab('watch')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors relative ${
            currentTab === 'watch' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Watch Player"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            currentTab === 'watch' 
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30' 
              : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
          }`}>
            <Tv className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Watch</span>
        </button>

        <button
          onClick={() => onSelectTab('guide')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
            currentTab === 'guide' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="TV Guide"
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">EPG Guide</span>
        </button>

        <button
          onClick={() => onSelectTab('favourites')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors relative ${
            currentTab === 'favourites' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Favourites"
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${currentTab === 'favourites' ? 'fill-rose-500 text-rose-500' : ''}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-emerald-500 text-slate-950 font-black text-[9px] rounded-full flex items-center justify-center font-mono">
                {favoritesCount > 9 ? '9+' : favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Saved</span>
        </button>
      </div>
    </nav>
  );
};
