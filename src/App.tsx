/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Channel, UserPreferences } from './types/channel';
import { INITIAL_CHANNELS } from './data/channels';
import { 
  getFavorites, 
  saveFavorites, 
  toggleFavorite, 
  getRecentlyWatched, 
  recordRecentlyWatched, 
  getPreferences, 
  savePreferences, 
  resetAllStorage,
  getCustomStreamOverrides,
  setCustomStreamOverride
} from './lib/storage';

import { Header, NavTab } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { Footer } from './components/layout/Footer';

import { HomeView } from './components/home/HomeView';
import { DirectoryView } from './components/channels/DirectoryView';
import { WatchView } from './components/watch/WatchView';
import { FavouritesView } from './components/favourites/FavouritesView';
import { ProgramGuide } from './components/guide/ProgramGuide';
import { SettingsView } from './components/settings/SettingsView';
import { AboutView } from './components/about/AboutView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [channels] = useState<Channel[]>(INITIAL_CHANNELS);
  const [selectedChannel, setSelectedChannel] = useState<Channel>(INITIAL_CHANNELS[0]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentChannelIds, setRecentChannelIds] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>(getPreferences());
  const [customStreams, setCustomStreams] = useState<Record<string, string>>({});
  const [guideChannelId, setGuideChannelId] = useState<string>(INITIAL_CHANNELS[0].id);

  // Initialize storage
  useEffect(() => {
    setFavorites(getFavorites());
    setRecentChannelIds(getRecentlyWatched().map(item => item.channelId));
    setCustomStreams(getCustomStreamOverrides());
  }, []);

  const handleSelectChannel = (channel: Channel) => {
    setSelectedChannel(channel);
    setCurrentTab('watch');
    recordRecentlyWatched(channel.id);
    setRecentChannelIds(getRecentlyWatched().map(item => item.channelId));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = (channelId: string) => {
    toggleFavorite(channelId);
    setFavorites(getFavorites());
  };

  const handleAddPresetFavorites = () => {
    const presets = ['crtv', 'canal-2-international', 'equinoxe-tv', 'france-24-en'];
    saveFavorites(presets);
    setFavorites(presets);
  };

  const handleResetAllData = () => {
    resetAllStorage();
    setFavorites(getFavorites());
    setRecentChannelIds([]);
    setCustomStreams({});
    setPreferences(getPreferences());
  };

  const handleSetCustomStream = (channelId: string, url: string) => {
    setCustomStreamOverride(channelId, url);
    setCustomStreams(getCustomStreamOverrides());
  };

  const handleNavigateToGuide = (channelId: string) => {
    setGuideChannelId(channelId);
    setCurrentTab('guide');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const favoriteChannels = channels.filter(c => favorites.includes(c.id));
  const recentlyWatchedChannels = recentChannelIds
    .map(id => channels.find(c => c.id === id))
    .filter((c): c is Channel => Boolean(c));

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Bar Header adhering strictly to Top Bar Contract */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        favoritesCount={favorites.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {currentTab === 'home' && (
          <HomeView
            channels={channels}
            favorites={favorites}
            recentlyWatchedChannels={recentlyWatchedChannels}
            onSelectChannel={handleSelectChannel}
            onToggleFavorite={handleToggleFavorite}
            onNavigateToTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'channels' && (
          <DirectoryView
            channels={channels}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectChannel={handleSelectChannel}
          />
        )}

        {currentTab === 'watch' && (
          <WatchView
            channel={selectedChannel}
            allChannels={channels}
            isFavorite={favorites.includes(selectedChannel.id)}
            onToggleFavorite={handleToggleFavorite}
            onSelectChannel={handleSelectChannel}
            customStreamUrl={customStreams[selectedChannel.id]}
            dataSaver={preferences.dataSaver}
            onNavigateToGuide={handleNavigateToGuide}
          />
        )}

        {currentTab === 'favourites' && (
          <FavouritesView
            favoriteChannels={favoriteChannels}
            allChannels={channels}
            onToggleFavorite={handleToggleFavorite}
            onSelectChannel={handleSelectChannel}
            onExploreChannels={() => setCurrentTab('channels')}
            onAddPresetFavorites={handleAddPresetFavorites}
          />
        )}

        {currentTab === 'guide' && (
          <ProgramGuide
            channels={channels}
            selectedChannelId={guideChannelId}
            onSelectChannel={(ch) => setGuideChannelId(ch.id)}
            onWatchChannel={handleSelectChannel}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            preferences={preferences}
            onUpdatePreferences={(newPrefs) => {
              savePreferences(newPrefs);
              setPreferences(newPrefs);
            }}
            onResetAllData={handleResetAllData}
            channels={channels}
            customStreams={customStreams}
            onSetCustomStream={handleSetCustomStream}
          />
        )}

        {currentTab === 'about' && (
          <AboutView />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTab={(tab) => {
        setCurrentTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* Mobile Bottom Navigation Bar (44px hitboxes, 15% height cap safe) */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        favoritesCount={favorites.length}
      />
    </div>
  );
}
