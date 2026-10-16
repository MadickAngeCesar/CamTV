import { UserPreferences } from '../types/channel';

const FAVORITES_KEY = 'camtv_favorites_v1';
const RECENT_KEY = 'camtv_recently_watched_v1';
const PREFS_KEY = 'camtv_user_preferences_v1';
const CUSTOM_STREAMS_KEY = 'camtv_custom_streams_v1';

export const DEFAULT_PREFERENCES: UserPreferences = {
  defaultLanguage: 'all',
  dataSaver: false,
  preferredPlayback: 'auto',
  autoMute: true,
  timeZone: 'WAT' // West Africa Time (Cameroon GMT+1)
};

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return ['crtv', 'canal-2-international', 'france-24-en'];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return ['crtv', 'canal-2-international'];
  }
}

export function saveFavorites(favs: string[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  } catch (err) {
    console.error('Failed to save favorites to localStorage', err);
  }
}

export function toggleFavorite(channelId: string): boolean {
  const current = getFavorites();
  const index = current.indexOf(channelId);
  let updated: string[];
  let isNowFavorite = false;
  if (index >= 0) {
    updated = current.filter(id => id !== channelId);
  } else {
    updated = [channelId, ...current];
    isNowFavorite = true;
  }
  saveFavorites(updated);
  return isNowFavorite;
}

export function isFavorite(channelId: string): boolean {
  return getFavorites().includes(channelId);
}

export interface RecentItem {
  channelId: string;
  watchedAt: number;
}

export function getRecentlyWatched(): RecentItem[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordRecentlyWatched(channelId: string): void {
  try {
    const list = getRecentlyWatched().filter(item => item.channelId !== channelId);
    const updated = [{ channelId, watchedAt: Date.now() }, ...list].slice(0, 10);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to record recent channel', err);
  }
}

export function getPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PREFERENCES, ...parsed };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch (err) {
    console.error('Failed to save preferences', err);
  }
}

export interface CustomStreamOverride {
  channelId: string;
  customStreamUrl: string;
  addedAt: string;
  notes?: string;
}

export function getCustomStreamOverrides(): Record<string, string> {
  try {
    const raw = localStorage.getItem(CUSTOM_STREAMS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function setCustomStreamOverride(channelId: string, url: string): void {
  try {
    const current = getCustomStreamOverrides();
    if (!url.trim()) {
      delete current[channelId];
    } else {
      current[channelId] = url.trim();
    }
    localStorage.setItem(CUSTOM_STREAMS_KEY, JSON.stringify(current));
  } catch (err) {
    console.error('Failed to set custom stream', err);
  }
}

export function resetAllStorage(): void {
  try {
    localStorage.removeItem(FAVORITES_KEY);
    localStorage.removeItem(RECENT_KEY);
    localStorage.removeItem(PREFS_KEY);
    localStorage.removeItem(CUSTOM_STREAMS_KEY);
  } catch (err) {
    console.error('Failed to reset storage', err);
  }
}
