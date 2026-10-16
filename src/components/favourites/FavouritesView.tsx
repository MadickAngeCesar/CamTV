import React from 'react';
import { Channel } from '../../types/channel';
import { ChannelCard } from '../channels/ChannelCard';
import { Heart, Plus, Compass } from 'lucide-react';

interface FavouritesViewProps {
  favoriteChannels: Channel[];
  allChannels: Channel[];
  onToggleFavorite: (channelId: string) => void;
  onSelectChannel: (channel: Channel) => void;
  onExploreChannels: () => void;
  onAddPresetFavorites: () => void;
}

export const FavouritesView: React.FC<FavouritesViewProps> = ({
  favoriteChannels,
  allChannels,
  onToggleFavorite,
  onSelectChannel,
  onExploreChannels,
  onAddPresetFavorites,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>Saved Channels</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Quickly tune in to your preferred Cameroonian and international live television networks.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 font-bold tabular-nums">
          {favoriteChannels.length} saved channels
        </div>
      </div>

      {favoriteChannels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {favoriteChannels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              onSelectChannel={onSelectChannel}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#0e1422] border border-slate-800/80 rounded-3xl max-w-lg mx-auto space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mx-auto shadow-inner">
            <Heart className="w-7 h-7 stroke-slate-500" />
          </div>

          <h3 className="text-lg font-bold text-white tracking-tight">No saved channels yet</h3>
          
          <p className="text-xs text-slate-400 leading-relaxed">
            Click the heart icon on any channel card to bookmark it for fast access across browser sessions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={onAddPresetFavorites}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Cameroon Presets (CRTV, Canal 2, Équinoxe)</span>
            </button>

            <button
              onClick={onExploreChannels}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Browse All Channels</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
