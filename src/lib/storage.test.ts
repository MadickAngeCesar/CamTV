import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getFavorites, 
  saveFavorites, 
  toggleFavorite, 
  isFavorite, 
  getPreferences, 
  savePreferences, 
  resetAllStorage,
  DEFAULT_PREFERENCES 
} from './storage';

// Mock localStorage in memory for Vitest
const storageMock: Record<string, string> = {};
globalThis.localStorage = {
  getItem: (key: string) => storageMock[key] ?? null,
  setItem: (key: string, value: string) => { storageMock[key] = value; },
  removeItem: (key: string) => { delete storageMock[key]; },
  clear: () => {
    Object.keys(storageMock).forEach(key => delete storageMock[key]);
  },
  key: (index: number) => Object.keys(storageMock)[index] ?? null,
  length: 0
};

describe('Storage and User Preferences', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns default favorites if storage is empty', () => {
    const favs = getFavorites();
    expect(favs).toContain('crtv');
    expect(favs).toContain('canal-2-international');
  });

  it('toggles favorites correctly', () => {
    saveFavorites(['crtv']);
    expect(isFavorite('crtv')).toBe(true);
    expect(isFavorite('canal-2-international')).toBe(false);

    // Toggle on
    const added = toggleFavorite('canal-2-international');
    expect(added).toBe(true);
    expect(isFavorite('canal-2-international')).toBe(true);

    // Toggle off
    const removed = toggleFavorite('crtv');
    expect(removed).toBe(false);
    expect(isFavorite('crtv')).toBe(false);
  });

  it('safely handles corrupted JSON in localStorage', () => {
    localStorage.setItem('camtv_favorites_v1', '{corrupt-json-string');
    const favs = getFavorites();
    expect(Array.isArray(favs)).toBe(true);
    expect(favs.length).toBeGreaterThan(0);
  });

  it('persists and restores user preferences correctly', () => {
    const prefs = getPreferences();
    expect(prefs.dataSaver).toBe(false);

    savePreferences({
      ...DEFAULT_PREFERENCES,
      dataSaver: true,
      defaultLanguage: 'fr'
    });

    const updated = getPreferences();
    expect(updated.dataSaver).toBe(true);
    expect(updated.defaultLanguage).toBe('fr');
  });

  it('resets all storage cleanly', () => {
    saveFavorites(['crtv', 'france-24-en']);
    savePreferences({ ...DEFAULT_PREFERENCES, dataSaver: true });
    resetAllStorage();

    expect(localStorage.getItem('camtv_favorites_v1')).toBeNull();
    expect(localStorage.getItem('camtv_user_preferences_v1')).toBeNull();
  });
});
