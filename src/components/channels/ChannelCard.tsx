import React from 'react';
import { Channel } from '../../types/channel';
import { Heart, Play, ExternalLink, ShieldCheck, AlertCircle, Radio, Clock, Globe, FileCheck2 } from 'lucide-react';

interface ChannelCardProps {
  channel: Channel;
  isFavorite: boolean;
  onToggleFavorite: (channelId: string) => void;
  onSelectChannel: (channel: Channel) => void;
  variant?: 'standard' | 'compact' | 'featured';
}

export const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  isFavorite,
  onToggleFavorite,
  onSelectChannel,
  variant = 'standard'
}) => {
  const isDirectHls = channel.playbackType === 'direct_hls';
  const isUnverified = channel.playbackType === 'unverified' || channel.sourceStatus === 'unverified' || channel.audit?.isUnverified;
  const isPortal = channel.playbackType === 'official_viewing_page' || channel.playbackType === 'external_portal';

  // Find current on-air show if schedule available
  const getOnAirProgram = () => {
    if (!channel.schedule || channel.schedule.length === 0) return null;
    const now = new Date();
    const watHours = (now.getUTCHours() + 1) % 24;
    const currentWATMinutes = watHours * 60 + now.getUTCMinutes();

    for (const item of channel.schedule) {
      const [sh, sm] = item.startTime.split(':').map(Number);
      const [eh, em] = item.endTime.split(':').map(Number);
      const start = (sh || 0) * 60 + (sm || 0);
      const end = (eh || 0) * 60 + (em || 0);
      if (end > start) {
        if (currentWATMinutes >= start && currentWATMinutes < end) return item;
      } else {
        if (currentWATMinutes >= start || currentWATMinutes < end) return item;
      }
    }
    return channel.schedule[0];
  };

  const onAirShow = getOnAirProgram();

  return (
    <div 
      onClick={() => onSelectChannel(channel)}
      className="group relative flex flex-col justify-between bg-[#0e1422]/90 hover:bg-[#121a2c] border border-slate-800/90 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5 overflow-hidden"
    >
      {/* Subtle brand color atmospheric light at top edge */}
      <div 
        className="absolute top-0 inset-x-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: channel.brandColor }}
      />

      <div>
        {/* Header with Channel Emblem & Controls */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            {/* Broadcaster Logo Badge */}
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm tracking-wider shadow-md border border-white/15 shrink-0 group-hover:scale-105 transition-transform"
              style={{ backgroundColor: channel.brandColor }}
            >
              {channel.shortCode}
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                {channel.name}
              </h3>
              {/* Zero-Pill unboxed clean text metadata */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 truncate">
                <span>{channel.country}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="capitalize">{channel.category}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{channel.languages.join('/')}</span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(channel.id);
            }}
            aria-label={isFavorite ? `Remove ${channel.name} from favourites` : `Save ${channel.name} to favourites`}
            className="p-2 -mr-1.5 -mt-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
          >
            <Heart 
              className={`w-4 h-4 transition-transform active:scale-125 ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'stroke-current'
              }`} 
            />
          </button>
        </div>

        {/* Channel tagline or description */}
        <p className="text-xs text-slate-300/85 line-clamp-2 leading-relaxed mb-3.5">
          {channel.tagline || channel.description}
        </p>

        {/* Live on-air program preview (if available) */}
        {onAirShow ? (
          <div className="mb-3.5 px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 font-mono text-[11px] tabular-nums mr-1.5">
                {onAirShow.startTime} WAT
              </span>
              <span className="text-white font-medium truncate">
                {onAirShow.title}
              </span>
            </div>
          </div>
        ) : (
          <div className="mb-3.5 px-3 py-2 rounded-xl bg-slate-950/40 border border-slate-800/40 flex items-center gap-2 text-[11px] text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Continuous 24/7 Transmission</span>
          </div>
        )}
      </div>

      <div>
        {/* Explicit 5-Tier Source Status Line */}
        <div className="flex items-center gap-1.5 text-[11px] mb-3">
          {isUnverified ? (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-amber-400/90 font-medium truncate">
                5. Unverified Source (Terrestrial / Satellite)
              </span>
            </>
          ) : isDirectHls ? (
            <>
              <Radio className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-emerald-400 font-medium truncate">
                4. Authorised Direct Stream (In-App HLS)
              </span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="text-slate-300 font-medium truncate">
                2. Official Viewing Page (Broadcaster WebTV)
              </span>
            </>
          )}
        </div>

        {/* Action Button Row */}
        <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectChannel(channel);
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-white font-semibold text-xs transition-colors active:scale-98 shadow-sm"
          >
            {isDirectHls ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Watch Stream</span>
              </>
            ) : isUnverified ? (
              <>
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Station Info &amp; Link</span>
              </>
            ) : (
              <>
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open WebTV Portal</span>
              </>
            )}
          </button>

          <a
            href={channel.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title={`Visit ${channel.name} official website`}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
