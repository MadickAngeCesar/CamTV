import React, { useState, useMemo } from 'react';
import { Channel } from '../../types/channel';
import { ChannelCard } from './ChannelCard';
import { ChannelFilters, FilterState } from './ChannelFilters';
import { ArrowUpDown, LayoutGrid, ListFilter } from 'lucide-react';

interface DirectoryViewProps {
  channels: Channel[];
  favorites: string[];
  onToggleFavorite: (channelId: string) => void;
  onSelectChannel: (channel: Channel) => void;
}

type SortOption = 'featured' | 'alphabetical' | 'country';

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  channels,
  favorites,
  onToggleFavorite,
  onSelectChannel,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    country: 'all',
    category: 'all',
    language: 'all',
    sourceType: 'all',
  });

  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const filteredChannels = useMemo(() => {
    let result = channels.filter((ch) => {
      // 1. Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = ch.name.toLowerCase().includes(q) || ch.shortCode.toLowerCase().includes(q);
        const matchesCountry = ch.country.toLowerCase().includes(q);
        const matchesDesc = ch.description.toLowerCase().includes(q);
        const matchesCategory = ch.category.toLowerCase().includes(q);
        const matchesLanguage = ch.languages.some(lang => lang.toLowerCase().includes(q));
        if (!matchesName && !matchesCountry && !matchesDesc && !matchesCategory && !matchesLanguage) {
          return false;
        }
      }

      // 2. Country
      if (filters.country !== 'all') {
        if (filters.country === 'CM' && ch.countryCode !== 'CM') return false;
        if (filters.country === 'FR' && ch.countryCode !== 'FR') return false;
        if (filters.country === 'AF' && ch.countryCode !== 'AF') return false;
      }

      // 3. Category
      if (filters.category !== 'all' && ch.category !== filters.category) {
        return false;
      }

      // 4. Language
      if (filters.language !== 'all') {
        if (!ch.languages.includes(filters.language)) {
          return false;
        }
      }

      // 5. Source Type (5-tier classification)
      if (filters.sourceType !== 'all') {
        if (filters.sourceType === 'stream' && ch.playbackType !== 'direct_hls') {
          return false;
        }
        if (filters.sourceType === 'portal' && ch.playbackType !== 'external_portal' && ch.playbackType !== 'official_viewing_page') {
          return false;
        }
        if (filters.sourceType === 'unverified' && ch.playbackType !== 'unverified' && !ch.audit?.isUnverified) {
          return false;
        }
      }

      return true;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'featured') {
        return (a.priorityOrder || 99) - (b.priorityOrder || 99);
      }
      if (sortBy === 'alphabetical') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'country') {
        return a.country.localeCompare(b.country);
      }
      return 0;
    });

    return result;
  }, [channels, filters, sortBy]);

  return (
    <div className="space-y-6">
      {/* Title & Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <LayoutGrid className="w-5 h-5 text-emerald-400" />
            <span>Channel Directory</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse and filter Cameroonian national networks and authorized international broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-[#0e1422] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-semibold outline-none focus:border-emerald-500 shadow-sm"
          >
            <option value="featured">Featured Priority</option>
            <option value="alphabetical">Alphabetical (A–Z)</option>
            <option value="country">Country</option>
          </select>
        </div>
      </div>

      {/* Filter Component */}
      <ChannelFilters
        filters={filters}
        onChangeFilters={setFilters}
        totalChannelsCount={channels.length}
        filteredChannelsCount={filteredChannels.length}
      />

      {/* Grid of Channel Cards or Empty State */}
      {filteredChannels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pt-2">
          {filteredChannels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              isFavorite={favorites.includes(channel.id)}
              onToggleFavorite={onToggleFavorite}
              onSelectChannel={onSelectChannel}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#0e1422] border border-slate-800/80 rounded-3xl space-y-3.5 shadow-sm">
          <h3 className="text-base font-bold text-white">No channels found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            No television channels matched your current search filters. Try adjusting your search term or selecting &quot;All Countries&quot;.
          </p>
          <button
            onClick={() => setFilters({
              searchQuery: '',
              country: 'all',
              category: 'all',
              language: 'all',
              sourceType: 'all',
            })}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
