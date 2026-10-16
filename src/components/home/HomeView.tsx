import React, { useState } from 'react';
import { Channel } from '../../types/channel';
import { ChannelCard } from '../channels/ChannelCard';
import { 
  Tv, 
  Play, 
  Compass, 
  Radio, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  ExternalLink,
  Calendar,
  Sparkles,
  Globe2
} from 'lucide-react';

interface HomeViewProps {
  channels: Channel[];
  favorites: string[];
  recentlyWatchedChannels: Channel[];
  onSelectChannel: (channel: Channel) => void;
  onToggleFavorite: (channelId: string) => void;
  onNavigateToTab: (tab: any) => void;
  onSearchQuery?: (q: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  channels,
  favorites,
  recentlyWatchedChannels,
  onSelectChannel,
  onToggleFavorite,
  onNavigateToTab,
}) => {
  // Available featured channels for hero switcher
  const featuredList = channels.filter(c => 
    ['crtv', 'balafon-tv', 'trace-africa', 'al-jazeera-en', 'canal-2-international', 'france-24-fr'].includes(c.id)
  );
  const [activeHeroId, setActiveHeroId] = useState<string>('crtv');
  const heroChannel = channels.find(c => c.id === activeHeroId) || channels[0];

  // Cameroonian Channels
  const cameroonChannels = channels.filter(c => c.countryCode === 'CM');

  // Music, Youth & Urban Entertainment Channels
  const musicEntertainmentChannels = channels.filter(
    c => c.category === 'entertainment' || ['trace-africa', 'trace-urban', 'balafon-tv', 'afrobeat-tv', 'trace-gospel'].includes(c.id)
  );

  // International & Pan-African News
  const internationalNews = channels.filter(c => c.countryCode !== 'CM' && c.category === 'news');

  // Channels with verified direct HLS playback
  const directPlaybackChannels = channels.filter(
    c => c.playbackType === 'direct_hls' && c.sourceStatus === 'verified'
  );

  return (
    <div className="space-y-12">
      {/* Cinematic Hero Showcase */}
      <section className="relative rounded-3xl bg-gradient-to-br from-[#0c1322] via-[#090e1a] to-[#060a12] border border-slate-800/80 p-6 sm:p-8 md:p-12 overflow-hidden shadow-2xl">
        {/* Subtle dynamic ambient glow matching current hero channel */}
        <div 
          className="absolute -top-32 -right-32 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: heroChannel.brandColor }}
        />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Brand Statement & Primary Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Zero-Pill kicker text */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Cameroon &amp; Global Broadcast Discovery</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] text-balance">
              Your window to Cameroon <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300">&amp; beyond.</span>
            </h1>

            <p className="text-sm md:text-base text-slate-300 max-w-xl leading-relaxed">
              Explore national Cameroonian public broadcasts, premier commercial networks, and 24/7 global news channels with transparent source validation, zero account mandates, and data-saver optimizations.
            </p>

            {/* Quick Hero Broadcaster Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800/80 rounded-2xl w-fit overflow-x-auto max-w-full">
              {featuredList.slice(0, 6).map((ch) => {
                const isActive = ch.id === heroChannel.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveHeroId(ch.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span 
                      className="w-2 h-2 rounded-full shrink-0" 
                      style={{ backgroundColor: isActive ? '#022c22' : ch.brandColor }}
                    />
                    <span>{ch.shortCode}</span>
                  </button>
                );
              })}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onSelectChannel(heroChannel)}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all shadow-xl shadow-emerald-500/25 active:scale-95"
              >
                <Play className="w-4 h-4 fill-slate-950 stroke-[2.5]" />
                <span>Watch {heroChannel.name}</span>
              </button>

              <button
                onClick={() => onNavigateToTab('channels')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700/80 transition-colors"
              >
                <Compass className="w-4 h-4 text-slate-300" />
                <span>Browse All Channels</span>
              </button>
            </div>

            {/* Quiet unboxed metadata line */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-2">
              <span>{channels.length} Curated Broadcasters</span>
              <span aria-hidden="true">·</span>
              <span>Bilingual Feeds (FR/EN)</span>
              <span aria-hidden="true">·</span>
              <span>WAT Local Time EPG</span>
              <span aria-hidden="true">·</span>
              <span>Data-Saver Mode</span>
            </div>
          </div>

          {/* Right Column: Active Hero Channel Spotlight Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#0b101c]/95 border border-slate-800/90 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl relative overflow-hidden group">
              <div 
                className="absolute top-0 inset-x-0 h-1.5"
                style={{ backgroundColor: heroChannel.brandColor }}
              />

              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                  Spotlight Channel
                </span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {heroChannel.playbackType === 'direct_hls' 
                      ? 'Direct HLS Stream' 
                      : heroChannel.audit?.isUnverified 
                      ? 'Unverified Source' 
                      : 'Official WebTV Portal'}
                  </span>
                </span>
              </div>

              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl border border-white/20 shrink-0 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: heroChannel.brandColor }}
                >
                  {heroChannel.shortCode}
                </div>

                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-white tracking-tight truncate">
                    {heroChannel.name}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5 truncate">
                    {heroChannel.headquarters}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 font-mono truncate">
                    {heroChannel.languages.join(' · ')}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300/90 leading-relaxed line-clamp-3">
                {heroChannel.description}
              </p>

              {/* Station Terrestrial frequencies if available */}
              {heroChannel.frequencyNotes && (
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/70 text-[11px] text-slate-400">
                  <span className="text-slate-300 font-semibold">Terrestrial:</span> {heroChannel.frequencyNotes}
                </div>
              )}

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  onClick={() => onSelectChannel(heroChannel)}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Tune In Now</span>
                </button>

                <a
                  href={heroChannel.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
                  title="Official Website"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Watched Rail (if available) */}
      {recentlyWatchedChannels.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Recently Watched</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {recentlyWatchedChannels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => onSelectChannel(ch)}
                className="group p-3.5 rounded-2xl bg-[#0e1422] hover:bg-[#131b2e] border border-slate-800 hover:border-slate-700 text-left transition-all duration-150 flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-xs mb-2.5 shadow-sm"
                  style={{ backgroundColor: ch.brandColor }}
                >
                  {ch.shortCode}
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-emerald-400 truncate">
                    {ch.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {ch.country}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Cameroonian Television Section */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5 tracking-tight">
              <span className="w-3 h-3 rounded-md bg-emerald-500 shadow-sm" />
              <span>Cameroonian Television Networks</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              National public broadcaster &amp; leading independent commercial stations from Yaoundé and Douala.
            </p>
          </div>

          <button
            onClick={() => onNavigateToTab('channels')}
            className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            <span>View All ({cameroonChannels.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {cameroonChannels.slice(0, 8).map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              isFavorite={favorites.includes(channel.id)}
              onToggleFavorite={onToggleFavorite}
              onSelectChannel={onSelectChannel}
            />
          ))}
        </div>
      </section>

      {/* Popular Music, Youth & Urban Culture */}
      {musicEntertainmentChannels.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5 tracking-tight">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Popular Music, Youth &amp; Urban Entertainment</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Makossa, Afrobeats, Amapiano, Hip-Hop, gospel &amp; Douala youth lifestyle channels.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
            {musicEntertainmentChannels.slice(0, 5).map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                isFavorite={favorites.includes(channel.id)}
                onToggleFavorite={onToggleFavorite}
                onSelectChannel={onSelectChannel}
              />
            ))}
          </div>
        </section>
      )}

      {/* Verified Direct In-App Streams */}
      {directPlaybackChannels.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5 tracking-tight">
                <Radio className="w-5 h-5 text-emerald-400" />
                <span>Verified Direct In-App HLS Streams</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Channels with native HTML5 live video streams playing directly in your browser.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {directPlaybackChannels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                isFavorite={favorites.includes(channel.id)}
                onToggleFavorite={onToggleFavorite}
                onSelectChannel={onSelectChannel}
              />
            ))}
          </div>
        </section>
      )}

      {/* International & Pan-African News */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5 tracking-tight">
              <Globe2 className="w-5 h-5 text-sky-400" />
              <span>International &amp; Pan-African News</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Curated 24/7 global news channels in French and English covering Africa, Europe, and worldwide developments.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {internationalNews.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              isFavorite={favorites.includes(channel.id)}
              onToggleFavorite={onToggleFavorite}
              onSelectChannel={onSelectChannel}
            />
          ))}
        </div>
      </section>

      {/* Transparency Guarantee & Ethical Manifesto Banner */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-[#0c1220] border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Broadcasting Rights &amp; Transparent Origin Guarantee</span>
          </div>
          <h3 className="text-lg font-extrabold text-white tracking-tight">
            Clean, legal broadcasting with explicit source attribution.
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            CamTV operates as a discovery portal and viewing client. We never scrape protected streams, DRM, or fake playback feeds. Channels without open feeds link directly to verified broadcaster websites.
          </p>
        </div>

        <button
          onClick={() => onNavigateToTab('about')}
          className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors shrink-0 border border-slate-700 shadow-md"
        >
          Read Broadcasting Charter
        </button>
      </section>
    </div>
  );
};
