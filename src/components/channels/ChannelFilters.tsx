import React from 'react';
import { Search, X, Filter, Radio, ShieldCheck, AlertCircle } from 'lucide-react';
import { CountryCode, ChannelCategory } from '../../types/channel';

export interface FilterState {
  searchQuery: string;
  country: string; // 'all' | 'CM' | 'FR' | 'AF' | 'INT'
  category: string; // 'all' | ChannelCategory
  language: string; // 'all' | 'French' | 'English'
  sourceType: string; // 'all' | 'stream' | 'portal' | 'unverified'
}

interface ChannelFiltersProps {
  filters: FilterState;
  onChangeFilters: (newFilters: FilterState) => void;
  totalChannelsCount: number;
  filteredChannelsCount: number;
}

export const ChannelFilters: React.FC<ChannelFiltersProps> = ({
  filters,
  onChangeFilters,
  totalChannelsCount,
  filteredChannelsCount,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFilters({ ...filters, searchQuery: e.target.value });
  };

  const clearSearch = () => {
    onChangeFilters({ ...filters, searchQuery: '' });
  };

  const setCountry = (country: string) => {
    onChangeFilters({ ...filters, country });
  };

  const setCategory = (category: string) => {
    onChangeFilters({ ...filters, category });
  };

  const setLanguage = (language: string) => {
    onChangeFilters({ ...filters, language });
  };

  const setSourceType = (sourceType: string) => {
    onChangeFilters({ ...filters, sourceType });
  };

  const resetAllFilters = () => {
    onChangeFilters({
      searchQuery: '',
      country: 'all',
      category: 'all',
      language: 'all',
      sourceType: 'all',
    });
  };

  const hasActiveFilters = 
    filters.searchQuery !== '' || 
    filters.country !== 'all' || 
    filters.category !== 'all' || 
    filters.language !== 'all' || 
    filters.sourceType !== 'all';

  return (
    <div className="space-y-4">
      {/* Search Input Bar with Keyboard Cue */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="Search channels by station name, country, city, language, category..."
            className="w-full bg-[#0e1422] border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 rounded-2xl pl-11 pr-10 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
          />
          {filters.searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-400 shrink-0 px-1">
          <span>
            Showing <strong className="text-white font-mono tabular-nums">{filteredChannelsCount}</strong> of <span className="font-mono tabular-nums">{totalChannelsCount}</span> channels
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-emerald-400 hover:underline font-bold"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Filter Segmented Controls */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        {/* Country Filter */}
        <div className="flex items-center gap-1 p-1 bg-[#0e1422] rounded-xl border border-slate-800 text-xs shadow-sm overflow-x-auto max-w-full">
          <button
            onClick={() => setCountry('all')}
            className={`px-3 py-1.5 rounded-lg transition-all font-semibold whitespace-nowrap ${
              filters.country === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Countries
          </button>
          <button
            onClick={() => setCountry('CM')}
            className={`px-3 py-1.5 rounded-lg transition-all font-semibold whitespace-nowrap ${
              filters.country === 'CM'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🇨🇲 Cameroon
          </button>
          <button
            onClick={() => setCountry('AF')}
            className={`px-3 py-1.5 rounded-lg transition-all font-semibold whitespace-nowrap ${
              filters.country === 'AF'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🌍 Pan-Africa
          </button>
          <button
            onClick={() => setCountry('INT')}
            className={`px-3 py-1.5 rounded-lg transition-all font-semibold whitespace-nowrap ${
              filters.country === 'INT'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🌐 Global
          </button>
          <button
            onClick={() => setCountry('FR')}
            className={`px-3 py-1.5 rounded-lg transition-all font-semibold whitespace-nowrap ${
              filters.country === 'FR'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🇫🇷 France
          </button>
        </div>

        {/* Source Playback Tier Filter */}
        <div className="flex items-center gap-1 p-1 bg-[#0e1422] rounded-xl border border-slate-800 text-xs shadow-sm overflow-x-auto max-w-full">
          <button
            onClick={() => setSourceType('all')}
            className={`px-3 py-1.5 rounded-lg transition-all font-semibold whitespace-nowrap ${
              filters.sourceType === 'all'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Sources
          </button>
          <button
            onClick={() => setSourceType('stream')}
            className={`px-3 py-1.5 rounded-lg transition-all font-semibold flex items-center gap-1.5 whitespace-nowrap ${
              filters.sourceType === 'stream'
                ? 'bg-slate-800 text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>Direct HLS</span>
          </button>
          <button
            onClick={() => setSourceType('portal')}
            className={`px-3 py-1.5 rounded-lg transition-all font-semibold flex items-center gap-1.5 whitespace-nowrap ${
              filters.sourceType === 'portal'
                ? 'bg-slate-800 text-sky-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Official WebTV</span>
          </button>
          <button
            onClick={() => setSourceType('unverified')}
            className={`px-3 py-1.5 rounded-lg transition-all font-semibold flex items-center gap-1.5 whitespace-nowrap ${
              filters.sourceType === 'unverified'
                ? 'bg-slate-800 text-amber-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Unverified</span>
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1 p-1 bg-[#0e1422] rounded-xl border border-slate-800 text-xs shadow-sm overflow-x-auto max-w-full">
          <button
            onClick={() => setCategory('all')}
            className={`px-3 py-1.5 rounded-lg transition-all font-semibold whitespace-nowrap ${
              filters.category === 'all'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setCategory('news')}
            className={`px-3 py-1.5 rounded-lg transition-all font-semibold whitespace-nowrap ${
              filters.category === 'news'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            News
          </button>
          <button
            onClick={() => setCategory('entertainment')}
            className={`px-3 py-1.5 rounded-lg transition-all font-semibold whitespace-nowrap ${
              filters.category === 'entertainment'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Entertainment &amp; Music
          </button>
          <button
            onClick={() => setCategory('culture')}
            className={`px-3 py-1.5 rounded-lg transition-all font-semibold whitespace-nowrap ${
              filters.category === 'culture'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Culture &amp; Science
          </button>
          <button
            onClick={() => setCategory('general')}
            className={`px-3 py-1.5 rounded-lg transition-all font-semibold whitespace-nowrap ${
              filters.category === 'general'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            General
          </button>
        </div>

        {/* Language Filter */}
        <div className="flex items-center gap-1 p-1 bg-[#0e1422] rounded-xl border border-slate-800 text-xs ml-auto shadow-sm">
          <button
            onClick={() => setLanguage('all')}
            className={`px-2.5 py-1.5 rounded-lg transition-all font-semibold ${
              filters.language === 'all'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Lang
          </button>
          <button
            onClick={() => setLanguage('French')}
            className={`px-2.5 py-1.5 rounded-lg transition-all font-semibold ${
              filters.language === 'French'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Français
          </button>
          <button
            onClick={() => setLanguage('English')}
            className={`px-2.5 py-1.5 rounded-lg transition-all font-semibold ${
              filters.language === 'English'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
        </div>
      </div>
    </div>
  );
};
