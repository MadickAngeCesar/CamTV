/**
 * Security and URL sanitization for CamTV
 * Strictly restricts embedded players to explicitly approved domains
 * and validates external broadcaster links.
 */

const APPROVED_IFRAME_DOMAINS = [
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'youtube.com',
  'www.youtube.com',
  'dailymotion.com',
  'www.dailymotion.com',
  'geo.dailymotion.com',
  'player.vimeo.com',
  'vimeo.com',
  'player.twitch.tv'
];

export function isApprovedEmbedUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    const hostname = parsed.hostname.toLowerCase();
    return APPROVED_IFRAME_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    );
  } catch {
    return false;
  }
}

export function sanitizeExternalUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function getCleanDomain(url: string | undefined): string {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}
