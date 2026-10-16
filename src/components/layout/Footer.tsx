import React from 'react';
import { Tv, ShieldCheck, Heart } from 'lucide-react';
import { NavTab } from './Header';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#070b12] text-slate-400 text-xs pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-extrabold text-base">
              <span className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-slate-950 font-black text-xs">
                <Tv className="w-3.5 h-3.5 text-slate-950" />
              </span>
              <span>Cam<span className="text-emerald-400">TV</span></span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Your window to Cameroon and beyond. Lightweight television discovery and viewing for audiences in Cameroon and the worldwide diaspora.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-2">
            <div className="text-white font-bold text-xs">Platform</div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onSelectTab('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('channels')} className="hover:text-white transition-colors">
                  Channel Directory
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('watch')} className="hover:text-white transition-colors">
                  Live Player
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('guide')} className="hover:text-white transition-colors">
                  Programme Guide (EPG)
                </button>
              </li>
            </ul>
          </div>

          {/* Ethics & Legal */}
          <div className="space-y-2">
            <div className="text-white font-bold text-xs">Integrity &amp; Privacy</div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onSelectTab('about')} className="hover:text-white transition-colors">
                  Broadcasting Rights Charter
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('settings')} className="hover:text-white transition-colors">
                  Data Saver &amp; Preferences
                </button>
              </li>
              <li>
                <span className="text-slate-400">Zero Commercial Interstitials</span>
              </li>
              <li>
                <span className="text-slate-400">No User Account Needed</span>
              </li>
            </ul>
          </div>

          {/* Regional Broadcaster Attribution */}
          <div className="space-y-2">
            <div className="text-white font-bold text-xs">Cameroon Broadcasters</div>
            <p className="text-slate-400 text-xs leading-relaxed">
              CRTV, Canal 2 International, Équinoxe Télévision, Vision 4, STV. All trademarks, channel identities, and audiovisual rights belong to their respective broadcasters.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} CamTV. Designed for accessible, low-bandwidth television discovery.
          </div>
          <div className="flex items-center gap-4">
            <span>Douala · Yaoundé · Global Diaspora</span>
            <span aria-hidden="true">·</span>
            <span>West Africa Time (WAT / UTC+1)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
