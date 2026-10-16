export type CountryCode = 'CM' | 'FR' | 'AF' | 'DE' | 'INT';

export type ChannelCategory = 'news' | 'general' | 'entertainment' | 'culture' | 'sports';

export type LanguageCode = 'fr' | 'en' | 'bilingual' | 'pidgin';

export type PlaybackType = 'direct_hls' | 'authorised_embed' | 'external_portal' | 'official_viewing_page' | 'unverified';

export type SourceStatus = 'verified' | 'unverified' | 'temporarily_unavailable' | 'unavailable';

/**
 * 5-tier source classification mandated by the CamTV audit guidelines:
 * 1. Official website
 * 2. Official viewing page
 * 3. Authorised embedded player
 * 4. Authorised direct stream
 * 5. Unverified source
 */
export type ChannelSourceTier = 
  | 'official_website'           // 1. Official broadcaster website
  | 'official_viewing_page'      // 2. Official broadcaster viewing page (web portal / webTV)
  | 'authorised_embedded_player' // 3. Authorised embedded player (iframe with permission)
  | 'authorised_direct_stream'   // 4. Authorised direct stream (HLS m3u8 playable in-app)
  | 'unverified_source';         // 5. Source unverified / not confirmed / terrestrial only

export interface ChannelAuditReport {
  classification: ChannelSourceTier;
  officialWebsite: string;
  officialViewingPage: string;
  hasAuthorisedEmbed: boolean;
  authorisedEmbedUrl?: string;
  hasAuthorisedDirectStream: boolean;
  authorisedDirectStreamUrl?: string;
  isUnverified: boolean;
  auditNotes: string;
  lastAuditedDate: string; // ISO date format YYYY-MM-DD
  rightsHolder: string;
  embedRestrictionReason?: string;
  directStreamNotes?: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  startTime: string; // e.g. "20:00" in West Africa Time (WAT, UTC+1)
  endTime: string;   // e.g. "20:45"
  category: string;
  description?: string;
  isLive?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  shortCode: string;
  tagline: string;
  country: string;
  countryCode: CountryCode;
  category: ChannelCategory;
  languages: string[];
  description: string;
  headquarters: string;
  broadcastStandard?: string; // e.g. "DVB-T2 / Satellite / Web"
  officialWebsite: string;
  officialWatchPage: string;
  authorisedEmbedUrl?: string;
  authorisedStreamUrl?: string;
  playbackType: PlaybackType;
  sourceStatus: SourceStatus;
  lastCheckedAt: string; // ISO 8601 string
  sourceNotes: string;
  brandColor: string; // CSS hex color
  brandAccent: string;
  frequencyNotes?: string;
  schedule?: ScheduleItem[];
  isFeatured?: boolean;
  priorityOrder?: number;
  audit: ChannelAuditReport; // 5-tier audit specification
}

export interface UserPreferences {
  defaultLanguage: 'all' | 'fr' | 'en';
  dataSaver: boolean;
  preferredPlayback: 'auto' | 'direct_preferred' | 'portal_preferred';
  autoMute: boolean;
  timeZone: 'WAT' | 'UTC' | 'CAT';
}
