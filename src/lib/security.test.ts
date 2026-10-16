import { describe, it, expect } from 'vitest';
import { isApprovedEmbedUrl, sanitizeExternalUrl, getCleanDomain } from './security';

describe('Security and URL Sanitizer', () => {
  it('approves legitimate YouTube nocookie embed URLs', () => {
    expect(isApprovedEmbedUrl('https://www.youtube-nocookie.com/embed/live_stream?channel=UC4SUWizzKc1tptprBkWjX2Q')).toBe(true);
    expect(isApprovedEmbedUrl('https://youtube-nocookie.com/embed/abc')).toBe(true);
  });

  it('approves legitimate Dailymotion embed URLs', () => {
    expect(isApprovedEmbedUrl('https://geo.dailymotion.com/player/x123.html')).toBe(true);
  });

  it('rejects unapproved or arbitrary domain embeds', () => {
    expect(isApprovedEmbedUrl('https://malicious-site.com/embed')).toBe(false);
    expect(isApprovedEmbedUrl('javascript:alert(1)')).toBe(false);
    expect(isApprovedEmbedUrl('')).toBe(false);
    expect(isApprovedEmbedUrl(undefined)).toBe(false);
  });

  it('sanitizes external URLs and rejects dangerous protocols', () => {
    expect(sanitizeExternalUrl('https://www.crtv.cm')).toBe('https://www.crtv.cm/');
    expect(sanitizeExternalUrl('javascript:void(0)')).toBe(null);
    expect(sanitizeExternalUrl('data:text/html,malicious')).toBe(null);
  });

  it('extracts clean domain without www prefix', () => {
    expect(getCleanDomain('https://www.canal2international.tv/direct')).toBe('canal2international.tv');
    expect(getCleanDomain('https://crtv.cm')).toBe('crtv.cm');
  });
});
