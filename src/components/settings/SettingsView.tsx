import React, { useState } from 'react';
import { UserPreferences, Channel } from '../../types/channel';
import { 
  Sliders, 
  Wifi, 
  Globe, 
  VolumeX, 
  RotateCcw, 
  ShieldCheck, 
  Check, 
  HelpCircle,
  Plus,
  Trash2,
  Tv
} from 'lucide-react';

interface SettingsViewProps {
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: UserPreferences) => void;
  onResetAllData: () => void;
  channels: Channel[];
  customStreams: Record<string, string>;
  onSetCustomStream: (channelId: string, url: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  preferences,
  onUpdatePreferences,
  onResetAllData,
  channels,
  customStreams,
  onSetCustomStream,
}) => {
  const [selectedChannelForOverride, setSelectedChannelForOverride] = useState<string>(channels[0]?.id || '');
  const [overrideUrlInput, setOverrideUrlInput] = useState<string>('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleDataSaverToggle = () => {
    const updated: UserPreferences = {
      ...preferences,
      dataSaver: !preferences.dataSaver,
    };
    onUpdatePreferences(updated);
    triggerSaved();
  };

  const handleAutoMuteToggle = () => {
    const updated: UserPreferences = {
      ...preferences,
      autoMute: !preferences.autoMute,
    };
    onUpdatePreferences(updated);
    triggerSaved();
  };

  const handleLanguageChange = (lang: 'all' | 'fr' | 'en') => {
    const updated: UserPreferences = {
      ...preferences,
      defaultLanguage: lang,
    };
    onUpdatePreferences(updated);
    triggerSaved();
  };

  const handleAddOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChannelForOverride || !overrideUrlInput.trim()) return;
    onSetCustomStream(selectedChannelForOverride, overrideUrlInput.trim());
    setOverrideUrlInput('');
    triggerSaved();
  };

  const handleRemoveOverride = (channelId: string) => {
    onSetCustomStream(channelId, '');
    triggerSaved();
  };

  const triggerSaved = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-emerald-400" />
          <span>Application Settings &amp; Preferences</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure bandwidth consumption, audio policies, and custom stream parameters. All preferences are stored locally in your browser.
        </p>
      </div>

      {savedNotification && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-400 font-medium">
          <Check className="w-4 h-4" />
          <span>Preferences updated successfully</span>
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-4">
        {/* Bandwidth & Data Saver */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span>Low-Bandwidth Data Saver Mode</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
              Optimized for mobile users in Cameroon and low-connectivity regions (MTN Cameroon, Orange Cameroun, Camtel). Reduces video buffer targets, disables background media preload, and prioritizes lightweight stream formats.
            </p>
          </div>
          <button
            onClick={handleDataSaverToggle}
            role="switch"
            aria-checked={preferences.dataSaver}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
              preferences.dataSaver ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                preferences.dataSaver ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Audio Autoplay Policy */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <VolumeX className="w-4 h-4 text-emerald-400" />
              <span>Mute Stream on Launch</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
              Starts television streams in muted mode by default. This ensures compliance with modern browser autoplay restrictions and avoids unexpected loud audio output.
            </p>
          </div>
          <button
            onClick={handleAutoMuteToggle}
            role="switch"
            aria-checked={preferences.autoMute}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
              preferences.autoMute ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                preferences.autoMute ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Language Preference */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Default Language Preference</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Filter catalogue prioritisation for Cameroon’s official bilingual ecosystem.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => handleLanguageChange('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                preferences.defaultLanguage === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              All Languages (Bilingual)
            </button>
            <button
              onClick={() => handleLanguageChange('fr')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                preferences.defaultLanguage === 'fr'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Français Prioritaire
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                preferences.defaultLanguage === 'en'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              English Priority
            </button>
          </div>
        </div>

        {/* Developer / Tester Custom Stream Override */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Tv className="w-4 h-4 text-emerald-400" />
              <span>Broadcaster Testing &amp; Custom Stream Override</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Dev / QA Tool</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Broadcasters and QA engineers can test live HLS manifests (`.m3u8`) or verified embed feeds directly against any catalogue channel entry. Overrides are stored only in your local browser sandbox.
          </p>

          <form onSubmit={handleAddOverride} className="flex flex-col sm:flex-row gap-2">
            <select
              value={selectedChannelForOverride}
              onChange={(e) => setSelectedChannelForOverride(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 outline-none"
            >
              {channels.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.name} ({ch.shortCode})
                </option>
              ))}
            </select>

            <input
              type="url"
              value={overrideUrlInput}
              onChange={(e) => setOverrideUrlInput(e.target.value)}
              placeholder="https://example.com/live.m3u8"
              className="flex-1 bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 placeholder-slate-500 outline-none focus:border-emerald-500"
            />

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Apply Test Feed</span>
            </button>
          </form>

          {/* List of active custom overrides */}
          {Object.keys(customStreams).length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300">Active Overrides:</span>
              <div className="space-y-1.5">
                {Object.entries(customStreams).map(([chId, url]) => {
                  const ch = channels.find(c => c.id === chId);
                  return (
                    <div key={chId} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 text-xs">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="font-semibold text-emerald-400">{ch?.name || chId}:</span>
                        <span className="font-mono text-slate-400 truncate text-[11px]">{url}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveOverride(chId)}
                        className="text-slate-400 hover:text-rose-400 p-1 shrink-0"
                        title="Remove override"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Local Storage Privacy & Reset */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Privacy &amp; Local Storage</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
                CamTV does not require accounts, does not collect personal identifiers, and does not use invasive third-party tracking scripts. Favourites and preferences reside exclusively in your browser’s localStorage.
              </p>
            </div>
            
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Data</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    onResetAllData();
                    setShowResetConfirm(false);
                    triggerSaved();
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
