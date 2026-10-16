import { describe, it, expect } from 'vitest';
import { INITIAL_CHANNELS } from './channels';

describe('Channel Catalogue Integrity & 5-Tier Audit', () => {
  it('contains the mandatory Cameroonian channels', () => {
    const ids = INITIAL_CHANNELS.map(c => c.id);
    expect(ids).toContain('crtv');
    expect(ids).toContain('crtv-news');
    expect(ids).toContain('canal-2-international');
    expect(ids).toContain('equinoxe-tv');
    expect(ids).toContain('vision-4');
    expect(ids).toContain('balafon-tv');
    expect(ids).toContain('cam10-tv');
  });

  it('contains the mandatory International & African channels', () => {
    const ids = INITIAL_CHANNELS.map(c => c.id);
    expect(ids).toContain('france-24-en');
    expect(ids).toContain('france-24-fr');
    expect(ids).toContain('africanews');
    expect(ids).toContain('channels-tv');
    expect(ids).toContain('al-jazeera-en');
    expect(ids).toContain('trace-africa');
    expect(ids).toContain('trace-urban');
    expect(ids).toContain('nasa-tv');
  });

  it('every channel has unique IDs, valid categories and 5-tier audit specifications', () => {
    const ids = new Set<string>();
    for (const channel of INITIAL_CHANNELS) {
      expect(ids.has(channel.id)).toBe(false);
      ids.add(channel.id);

      expect(channel.name.trim().length).toBeGreaterThan(0);
      expect(channel.officialWebsite.startsWith('http')).toBe(true);
      expect(channel.officialWatchPage.startsWith('http')).toBe(true);
      expect(['CM', 'FR', 'AF', 'DE', 'INT']).toContain(channel.countryCode);
      expect(['news', 'general', 'entertainment', 'culture', 'sports']).toContain(channel.category);
      expect(['verified', 'unverified', 'temporarily_unavailable', 'unavailable']).toContain(channel.sourceStatus);
      expect(['direct_hls', 'authorised_embed', 'external_portal', 'official_viewing_page', 'unverified']).toContain(channel.playbackType);
      expect(channel.sourceNotes.trim().length).toBeGreaterThan(10);

      // Verify the 5-point audit model is present and populated
      expect(channel.audit).toBeDefined();
      expect(channel.audit.officialWebsite.startsWith('http')).toBe(true);
      expect(channel.audit.officialViewingPage.startsWith('http')).toBe(true);
      expect(typeof channel.audit.hasAuthorisedEmbed).toBe('boolean');
      expect(typeof channel.audit.hasAuthorisedDirectStream).toBe('boolean');
      expect(typeof channel.audit.isUnverified).toBe('boolean');
      expect(channel.audit.rightsHolder.trim().length).toBeGreaterThan(3);
      expect(channel.audit.lastAuditedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect([
        'official_website',
        'official_viewing_page',
        'authorised_embedded_player',
        'authorised_direct_stream',
        'unverified_source'
      ]).toContain(channel.audit.classification);
    }
  });

  it('verifies that direct HLS streams are only configured for channels with verified feeds', () => {
    const directChannels = INITIAL_CHANNELS.filter(c => c.playbackType === 'direct_hls');
    expect(directChannels.length).toBeGreaterThanOrEqual(8);
    for (const ch of directChannels) {
      expect(ch.authorisedStreamUrl).toBeDefined();
      expect(ch.authorisedStreamUrl?.endsWith('.m3u8')).toBe(true);
      expect(ch.audit.hasAuthorisedDirectStream).toBe(true);
      expect(ch.sourceStatus).toBe('verified');
    }
  });

  it('verifies that unverified channels are honestly labelled as unverified without fake streams', () => {
    const unverifiedChannels = INITIAL_CHANNELS.filter(c => c.sourceStatus === 'unverified');
    expect(unverifiedChannels.length).toBeGreaterThanOrEqual(2);
    for (const unv of unverifiedChannels) {
      expect(unv.playbackType).toBe('unverified');
      expect(unv.audit.isUnverified).toBe(true);
      expect(unv.audit.hasAuthorisedDirectStream).toBe(false);
      expect(unv.audit.hasAuthorisedEmbed).toBe(false);
      expect(unv.authorisedStreamUrl).toBeUndefined();
    }
  });

  it('verifies that Cameroonian channels reserve viewing to official portals without broken embeds', () => {
    const crtv = INITIAL_CHANNELS.find(c => c.id === 'crtv');
    expect(crtv).toBeDefined();
    expect(crtv?.audit.classification).toBe('official_viewing_page');
    expect(crtv?.audit.hasAuthorisedEmbed).toBe(false);
    expect(crtv?.audit.hasAuthorisedDirectStream).toBe(false);

    const canal2 = INITIAL_CHANNELS.find(c => c.id === 'canal-2-international');
    expect(canal2).toBeDefined();
    expect(canal2?.audit.classification).toBe('official_viewing_page');
    expect(canal2?.audit.hasAuthorisedEmbed).toBe(false);
    expect(canal2?.authorisedEmbedUrl).toBeUndefined();
  });
});
