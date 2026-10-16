# CamTV — Cameroonian & International Live TV

> "Your window to Cameroon and beyond."

CamTV is a lightweight, television-oriented web application designed to help audiences in Cameroon and the diaspora discover channels, access verified live broadcasts, and browse television programme listings.

---

## 1. Product Vision & Rights Model

CamTV is built on strict content integrity and ethical broadcasting guidelines:
- **Verified Sources**: Distinguishes between direct HLS streams, authorized YouTube Live embeds, and official broadcaster web portals.
- **No Fabricated Streams**: Never generates fake video loops, mock API endpoints, or counterfeit streams.
- **Respect for Rights**: Broadcasters that protect their feeds (such as CRTV or Vision 4 reserving video to their proprietary portals and apps) are presented with transparent explanations and direct links to their official portals.
- **Low-Bandwidth Support**: Includes an explicit **Data Saver Mode** tailored for users on mobile network connections in Cameroon (MTN Cameroon, Orange Cameroun, Camtel).

---

## 2. Channel Catalogue

### Cameroonian Networks
- **CRTV** (Cameroon Radio Television, Yaoundé) — National state broadcaster (Bilingual FR/EN). Verified WebTV portal & MyCRTV app routing.
- **Canal 2 International** (Douala) — Premier private commercial network (FR/EN). Authorized YouTube live broadcast integration & web portal.
- **Équinoxe Télévision** (Douala) — Leading independent investigative news & debate channel (FR/EN/Pidgin). Official portal & broadcast stream editions.
- **Vision 4 Télévision** (Yaoundé) — Private news & debate broadcaster (FR). Official web portal.
- **CRTV News** (Yaoundé) — 24/7 continuous news channel from CRTV.
- **STV (Spectrum TV)** (Douala) — Independent commercial station (Unverified stream status pending broadcaster API review).

### International News
- **France 24 English** (Paris, France) — 24/7 worldwide news. Authorized embed & public HLS feed.
- **France 24 Français** (Paris, France) — 24/7 international news in French. Authorized embed & public HLS feed.
- **Africanews** (Pointe-Noire / Lyon) — Bilingual pan-African news network from Euronews group. Authorized live feed.
- **DW News English** (Bonn/Berlin, Germany) — German public international broadcaster.
- **TV5Monde Afrique** (Paris, France) — Continental African cultural & news network.

---

## 3. Technology Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 (dark-first TV streaming aesthetic, zero-pill metadata typography)
- **Streaming Engine**: Hls.js (`^1.7.3`) with native Apple HLS fallback and sanitized sandboxed iframe embeds
- **Icons**: Lucide React
- **Storage**: Browser `localStorage` (bookmarks, recent history, user preferences) with corrupted JSON safeguards
- **Testing**: Vitest (`^5.0.5`)

---

## 4. Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Running Automated Tests
```bash
npm run test
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 5. Project Structure

```
├── src/
│   ├── components/
│   │   ├── about/
│   │   │   └── AboutView.tsx          # Broadcasting charter & rights manifesto
│   │   ├── channels/
│   │   │   ├── ChannelCard.tsx        # Zero-pill card with unboxed metadata
│   │   │   ├── ChannelFilters.tsx     # Search and segmented filters
│   │   │   └── DirectoryView.tsx      # Comprehensive channel catalogue
│   │   ├── favourites/
│   │   │   └── FavouritesView.tsx     # Bookmarked channels with presets
│   │   ├── guide/
│   │   │   └── ProgramGuide.tsx       # EPG with West Africa Time (WAT) clock
│   │   ├── home/
│   │   │   └── HomeView.tsx           # Hero showcase, national & world news
│   │   ├── layout/
│   │   │   ├── BottomNav.tsx          # 44px mobile touch navigation bar
│   │   │   ├── Footer.tsx             # Quiet legal & regional footer
│   │   │   └── Header.tsx             # 3-zone Top Bar Contract header
│   │   ├── player/
│   │   │   └── StreamPlayer.tsx       # Resilient HLS/embed/portal TV player
│   │   └── settings/
│   │       └── SettingsView.tsx       # Data saver, audio, QA test overrides
│   ├── data/
│   │   ├── channels.ts                # Strongly typed channel catalog
│   │   └── channels.test.ts           # Catalogue integrity tests
│   ├── lib/
│   │   ├── security.ts                # URL sanitization & iframe domain whitelist
│   │   ├── security.test.ts           # Origin & security tests
│   │   ├── storage.ts                 # Safe localStorage helpers
│   │   └── storage.test.ts            # Storage & corrupted JSON tests
│   ├── types/
│   │   └── channel.ts                 # Data models & playback types
│   ├── App.tsx                        # Application root container
│   ├── index.css                      # Tailwind base & dark scrollbar styles
│   └── main.tsx                       # React DOM entrypoint
├── index.html                         # Head metadata & Plus Jakarta Sans
├── metadata.json                      # AI Studio application metadata
└── package.json
```

---

## 6. How to Add or Update Channels

Edit `src/data/channels.ts`:

```typescript
{
  id: 'channel-id',
  name: 'Channel Name',
  shortCode: 'CODE',
  tagline: 'Network Motto',
  country: 'Cameroon',
  countryCode: 'CM', // 'CM' | 'FR' | 'AF' | 'DE' | 'INT'
  category: 'news',  // 'news' | 'general' | 'entertainment' | 'culture' | 'sports'
  languages: ['French', 'English'],
  description: 'Detailed description of the network...',
  headquarters: 'City, Country',
  officialWebsite: 'https://...',
  officialWatchPage: 'https://...',
  playbackType: 'external_portal', // 'direct_hls' | 'authorised_embed' | 'external_portal' | 'unverified'
  sourceStatus: 'verified',         // 'verified' | 'unverified' | 'temporarily_unavailable' | 'unavailable'
  lastCheckedAt: '2026-10-15T00:00:00Z',
  sourceNotes: 'Explanation of source rights and origin.',
  brandColor: '#059669',
  brandAccent: '#10b981'
}
```

Broadcasters and developers can also test custom stream feeds in real-time without modifying code via the **Settings -> Developer & QA Custom Stream Override** tool.
