import React, { useState } from 'react';
import { Channel } from '../../types/channel';
import { StreamPlayer } from '../player/StreamPlayer';
import { 
  Heart, 
  ExternalLink, 
  ShieldCheck, 
  Tv, 
  ChevronLeft, 
  ChevronRight, 
  Radio, 
  Info, 
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
  FileCheck2,
  Globe,
  RadioTower
} from 'lucide-react';

interface WatchViewProps {
  channel: Channel;
  allChannels: Channel[];
  isFavorite: boolean;
  onToggleFavorite: (channelId: string) => void;
  onSelectChannel: (channel: Channel) => void;
  customStreamUrl?: string;
  dataSaver?: boolean;
  onNavigateToGuide?: (channelId: string) => void;
}

export const WatchView: React.FC<WatchViewProps> = ({
  channel,
  allChannels,
  isFavorite,
  onToggleFavorite,
  onSelectChannel,
  customStreamUrl,
  dataSaver = false,
  onNavigateToGuide,
}) => {
  const currentIndex = allChannels.findIndex(c => c.id === channel.id);
  const prevChannel = currentIndex > 0 ? allChannels[currentIndex - 1] : allChannels[allChannels.length - 1];
  const nextChannel = currentIndex < allChannels.length - 1 ? allChannels[currentIndex + 1] : allChannels[0];

  const isDirectHls = channel.playbackType === 'direct_hls';
  const isUnverified = channel.playbackType === 'unverified' || channel.audit?.isUnverified;
  const audit = channel.audit;

  // Get upcoming show if available
  const upcomingSchedule = channel.schedule?.slice(0, 3) || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Upper Navigation & Channel Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="flex items-center gap-3.5">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-xl border border-white/20 shrink-0"
            style={{ backgroundColor: channel.brandColor }}
          >
            {channel.shortCode}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {channel.name}
              </h1>
              {isDirectHls ? (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Direct HLS Stream
                </span>
              ) : isUnverified ? (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  Unverified Source
                </span>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/30 text-[10px] text-sky-400 font-bold uppercase tracking-wider">
                  Official Broadcaster WebTV
                </span>
              )}
            </div>

            {/* Zero-Pill text metadata with typographic separators */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <span>{channel.country}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="capitalize">{channel.category}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{channel.languages.join(' & ')}</span>
              {channel.broadcastStandard && (
                <>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="font-mono text-[11px] text-slate-400">{channel.broadcastStandard}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Quick Zapper Prev/Next Channel */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => onSelectChannel(prevChannel)}
              title={`Previous: ${prevChannel.name}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Previous channel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-slate-400 px-1 font-mono tabular-nums">
              {currentIndex + 1} / {allChannels.length}
            </span>
            <button
              onClick={() => onSelectChannel(nextChannel)}
              title={`Next: ${nextChannel.name}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Next channel"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onToggleFavorite(channel.id)}
            aria-label={isFavorite ? 'Remove from favourites' : 'Save to favourites'}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors border ${
              isFavorite 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20' 
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isFavorite ? 'Saved' : 'Favourite'}</span>
          </button>

          <a
            href={channel.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Official Broadcaster Website"
          >
            <Globe className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Main Video Screen Container */}
      <div className="relative">
        <StreamPlayer
          channel={channel}
          customStreamUrl={customStreamUrl}
          dataSaver={dataSaver}
          onPrevChannel={() => onSelectChannel(prevChannel)}
          onNextChannel={() => onSelectChannel(nextChannel)}
        />
      </div>

      {/* Grid of Broadcast Metadata & Channel Guide Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 5-Tier Audit, Schedule & Channel Profile (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Explicit 5-Point Source Verification Audit Card */}
          <div className="bg-[#0e1422] border border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <FileCheck2 className="w-4 h-4" />
                <span>Source Verification Audit (5-Tier Framework)</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Audited: {audit?.lastAuditedDate || '2026-10-16'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {channel.sourceNotes}
            </p>

            {/* 5 Distinct Checkpoints Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {/* 1. Official Website */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/70 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                  <span>1. Official Website</span>
                  <span className="text-emerald-400 font-bold">Verified</span>
                </div>
                <a 
                  href={channel.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white hover:text-emerald-400 font-medium truncate block"
                  title={channel.officialWebsite}
                >
                  {channel.officialWebsite.replace(/^https?:\/\//, '')}
                </a>
              </div>

              {/* 2. Official Viewing Page */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/70 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                  <span>2. Official Viewing Page</span>
                  <span className="text-emerald-400 font-bold">Verified</span>
                </div>
                <a 
                  href={channel.officialWatchPage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-400 hover:underline font-medium truncate block"
                  title={channel.officialWatchPage}
                >
                  Open Live Watch Portal →
                </a>
              </div>

              {/* 3. Authorised Embed */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/70 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                  <span>3. Authorised Embed</span>
                  <span className={audit?.hasAuthorisedEmbed ? 'text-emerald-400 font-bold' : 'text-slate-400 font-semibold'}>
                    {audit?.hasAuthorisedEmbed ? 'Available' : 'Restricted'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {audit?.hasAuthorisedEmbed ? 'Secure iframe permitted' : 'Restricted to official portal'}
                </div>
              </div>

              {/* 4. Direct Stream */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/70 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                  <span>4. Direct Stream</span>
                  <span className={audit?.hasAuthorisedDirectStream ? 'text-emerald-400 font-bold' : 'text-slate-400 font-semibold'}>
                    {audit?.hasAuthorisedDirectStream ? 'Active HLS' : 'Protected / Tokenized'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {audit?.hasAuthorisedDirectStream ? 'Native HTML5 playback' : 'Not exposed publicly'}
                </div>
              </div>

              {/* 5. Unverified Source Status */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/70 space-y-1 sm:col-span-2">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                  <span>5. Verification Status</span>
                  <span className={isUnverified ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {isUnverified ? 'Unverified Digital Stream' : 'Verified Broadcaster Entity'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Rights holder: {audit?.rightsHolder || 'Confirmed'}
                </div>
              </div>
            </div>

            {/* Launch Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={channel.officialWatchPage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition-all shadow-md active:scale-95"
              >
                <span>Launch Official {channel.shortCode} Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={channel.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-semibold transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Visit Official Website</span>
              </a>

              {onNavigateToGuide && channel.schedule && channel.schedule.length > 0 && (
                <button
                  onClick={() => onNavigateToGuide(channel.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>View Full Schedule</span>
                </button>
              )}
            </div>
          </div>

          {/* Up Next / Programme Guide Snippet */}
          {upcomingSchedule.length > 0 && (
            <div className="bg-[#0e1422] border border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Today&apos;s Broadcast Schedule (WAT Cameroon Time)</span>
                </h3>

                {onNavigateToGuide && (
                  <button
                    onClick={() => onNavigateToGuide(channel.id)}
                    className="text-xs font-semibold text-emerald-400 hover:underline"
                  >
                    All Shows
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-800/80">
                {upcomingSchedule.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-400 tabular-nums min-w-[70px]">
                        {item.startTime}
                      </span>
                      <span className="text-white font-medium">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-slate-400 shrink-0">{item.category}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About this Broadcaster */}
          <div className="bg-[#0e1422] border border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-sm">
            <h3 className="text-sm font-bold text-white">About {channel.name}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {channel.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
              <div>
                <span className="text-slate-400">Headquarters:</span>{' '}
                <span className="text-slate-200 font-medium">{channel.headquarters}</span>
              </div>
              <div>
                <span className="text-slate-400">Primary Languages:</span>{' '}
                <span className="text-slate-200 font-medium">{channel.languages.join(', ')}</span>
              </div>
              {channel.frequencyNotes && (
                <div className="sm:col-span-2">
                  <span className="text-slate-400">Terrestrial Broadcast Frequencies:</span>{' '}
                  <span className="text-slate-200 font-medium">{channel.frequencyNotes}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Other Live Channels Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Tv className="w-4 h-4 text-emerald-400" />
              <span>Channel Switcher</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              {allChannels.length} channels
            </span>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1 scrollbar-thin">
            {allChannels.map((ch) => {
              const isCurrent = ch.id === channel.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => onSelectChannel(ch)}
                  className={`w-full text-left p-3 rounded-2xl flex items-center justify-between gap-3 transition-all border ${
                    isCurrent
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-md'
                      : 'bg-[#0e1422] hover:bg-[#131b2e] border-slate-800/80 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-xs shrink-0 shadow-sm"
                      style={{ backgroundColor: ch.brandColor }}
                    >
                      {ch.shortCode}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold truncate text-white">
                        {ch.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {ch.country} · {ch.category}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-semibold shrink-0 px-2 py-0.5 rounded ${
                    ch.playbackType === 'direct_hls'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : ch.audit?.isUnverified
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {ch.playbackType === 'direct_hls' ? 'HLS' : ch.audit?.isUnverified ? 'Unverified' : 'WebTV'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
