import React from 'react';
import { ShieldCheck, Tv, Scale, Radio, ExternalLink, AlertTriangle, FileCode, FileCheck2, Globe, RadioTower, CheckCircle2 } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <span>CamTV Source Integrity &amp; Broadcasting Charter</span>
        </h2>
        <p className="text-sm text-slate-300 mt-1">
          Our commitment to legal, transparent, and respectful television distribution for Cameroon and international audiences.
        </p>
      </div>

      {/* 5-Tier Classification Framework Callout */}
      <div className="p-6 rounded-3xl bg-[#090e1a] border border-emerald-500/30 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs">
          <FileCheck2 className="w-4 h-4" />
          <span>The 5-Tier Source Verification Standard</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          CamTV classifies every television channel strictly according to a five-tier verification hierarchy to ensure viewer clarity, rights compliance, and zero misleading playback errors:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Tier 1</span>
            <div className="text-xs font-bold text-white">Official Website</div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Direct link to broadcaster's institutional portal and corporate site.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Tier 2</span>
            <div className="text-xs font-bold text-white">Official Viewing Page</div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Official broadcaster WebTV portal (e.g. CRTV Live, Canal 2, Vision 4).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Tier 3</span>
            <div className="text-xs font-bold text-white">Authorised Embed</div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Embedded only when explicitly permitted by broadcaster policy.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Tier 4</span>
            <div className="text-xs font-bold text-emerald-400">Direct Stream (HLS)</div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Native in-app HTML5 HLS video playback (France 24, DW News).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Tier 5</span>
            <div className="text-xs font-bold text-amber-400">Unverified Source</div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Terrestrial or unverified channels labeled honestly with no fake streams.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Key Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Scale className="w-4 h-4" />
            <span>Strict Rights Respect</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            CamTV strictly refuses to scrape protected streams, evade paywalls, bypass geographical restrictions, or circumvent digital rights management (DRM). We do not redistribute unauthenticated commercial feeds.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Radio className="w-4 h-4" />
            <span>Transparent Source Metadata</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every channel card and player view explicitly discloses the playback origin: whether it is an authorised direct HLS feed, an official broadcaster web portal, or an unverified terrestrial station.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Tv className="w-4 h-4" />
            <span>Direct Broadcaster Portals</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            When a broadcaster such as CRTV, Equinoxe TV, or Vision 4 reserves video distribution to their proprietary web portal or native mobile applications, CamTV clearly routes viewers directly to the official broadcaster platform without broken embed errors.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <FileCode className="w-4 h-4" />
            <span>Honest Operational States</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            We never fabricate stream links, mock video playback with dummy video loops, or generate fake programme schedules. What you see reflects verified operational information.
          </p>
        </div>
      </div>

      {/* Broadcaster Onboarding and Partnerships */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white">Information for Broadcasters &amp; Content Partners</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Are you an authorized representative of a Cameroonian or international television network? CamTV welcomes official partnerships to provide authenticated HLS manifest endpoints, approved player integrations, or direct links to your official streaming apps.
        </p>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs text-slate-400">
          <div className="font-semibold text-slate-200">How CamTV handles your channel:</div>
          <ul className="list-disc list-inside space-y-1">
            <li>We link directly to your official website and primary web broadcast page.</li>
            <li>We do not place video advertisements or overlays over your broadcast.</li>
            <li>We provide a low-bandwidth Data Saver mode for viewers on mobile connections in Cameroon.</li>
            <li>Your branding, copyright notices, and institutional identifiers are preserved intact.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
