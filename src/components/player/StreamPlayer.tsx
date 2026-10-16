import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { Channel } from '../../types/channel';
import { isApprovedEmbedUrl } from '../../lib/security';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  RotateCw, 
  ExternalLink, 
  AlertTriangle, 
  AlertCircle,
  ShieldCheck, 
  Radio, 
  Info,
  Tv,
  HelpCircle,
  Keyboard,
  Globe,
  FileCheck2,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface StreamPlayerProps {
  channel: Channel;
  customStreamUrl?: string;
  dataSaver?: boolean;
  onOpenPortal?: () => void;
  onNextChannel?: () => void;
  onPrevChannel?: () => void;
}

type PlayerState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';
type PlaybackMode = 'direct' | 'embed' | 'portal';

export const StreamPlayer: React.FC<StreamPlayerProps> = ({
  channel,
  customStreamUrl,
  dataSaver = false,
  onOpenPortal,
  onNextChannel,
  onPrevChannel
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Available sources for this channel
  const hasDirectHls = Boolean(customStreamUrl || (channel.authorisedStreamUrl && channel.playbackType === 'direct_hls'));
  const hasEmbed = Boolean(!customStreamUrl && channel.audit?.hasAuthorisedEmbed && channel.authorisedEmbedUrl && isApprovedEmbedUrl(channel.authorisedEmbedUrl));
  const activeStreamUrl = customStreamUrl || channel.authorisedStreamUrl;

  const getInitialMode = useCallback((): PlaybackMode => {
    if (customStreamUrl) return 'direct';
    if (channel.playbackType === 'direct_hls' && channel.authorisedStreamUrl) return 'direct';
    if (hasEmbed) return 'embed';
    return 'portal';
  }, [channel.playbackType, channel.authorisedStreamUrl, customStreamUrl, hasEmbed]);

  const [activeMode, setActiveMode] = useState<PlaybackMode>(getInitialMode);
  const [playerState, setPlayerState] = useState<PlayerState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [streamQuality, setStreamQuality] = useState<string>('Auto');
  const [showAuditDetails, setShowAuditDetails] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Reset active mode when channel changes
  useEffect(() => {
    setActiveMode(getInitialMode());
    setShowAuditDetails(false);
  }, [channel.id, customStreamUrl, getInitialMode]);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const destroyHls = useCallback(() => {
    clearTimer();
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, [clearTimer]);

  const initDirectStream = useCallback(() => {
    const video = videoRef.current;
    if (!video || !activeStreamUrl) return;

    destroyHls();
    setPlayerState('loading');
    setErrorMessage(null);

    // Timeout guard: Avoid endless spinning (12 seconds)
    timeoutRef.current = window.setTimeout(() => {
      if (video.paused && video.readyState < 3) {
        setPlayerState('error');
        setErrorMessage(
          'Stream connection timed out. The broadcast feed may be temporarily off-air, geo-restricted, or blocked by CORS security.'
        );
      }
    }, 12000);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: !dataSaver,
        backBufferLength: dataSaver ? 30 : 60,
        maxBufferLength: dataSaver ? 15 : 30,
        maxMaxBufferLength: 60,
      });

      hlsRef.current = hls;
      hls.loadSource(activeStreamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        clearTimer();
        setPlayerState('playing');
        if (data.levels && data.levels.length > 0) {
          const highest = data.levels[data.levels.length - 1];
          setStreamQuality(`${highest.height || '720'}p`);
        }
        video.play().catch(() => {
          setPlayerState('paused');
        });
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          clearTimer();
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setErrorMessage('Network connection to stream feed failed. Please check internet connection or switch to official broadcaster portal.');
              setPlayerState('error');
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              destroyHls();
              setErrorMessage('Playback error: Stream cannot be decoded or has restricted permissions.');
              setPlayerState('error');
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = activeStreamUrl;
      video.addEventListener('loadedmetadata', () => {
        clearTimer();
        setPlayerState('playing');
        video.play().catch(() => setPlayerState('paused'));
      }, { once: true });

      video.addEventListener('error', () => {
        clearTimer();
        setPlayerState('error');
        setErrorMessage('Native video playback encountered an error or format is unsupported.');
      }, { once: true });
    } else {
      clearTimer();
      setPlayerState('error');
      setErrorMessage('HLS stream format is not supported by your current browser.');
    }
  }, [activeStreamUrl, dataSaver, destroyHls, clearTimer]);

  useEffect(() => {
    setPlayerState('idle');
    setErrorMessage(null);
    setRetryCount(0);

    if (activeMode === 'direct' && activeStreamUrl) {
      initDirectStream();
    } else {
      destroyHls();
    }

    return () => {
      destroyHls();
    };
  }, [channel.id, activeMode, activeStreamUrl, initDirectStream, destroyHls]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    if (activeMode === 'direct' && activeStreamUrl) {
      initDirectStream();
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPlayerState('playing')).catch(() => {});
    } else {
      video.pause();
      setPlayerState('paused');
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (newVol: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = newVol;
    setVolume(newVol);
    if (newVol > 0 && video.muted) {
      video.muted = false;
      setIsMuted(false);
    }
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'ArrowRight' && onNextChannel) {
        e.preventDefault();
        onNextChannel();
      } else if (e.key === 'ArrowLeft' && onPrevChannel) {
        e.preventDefault();
        onPrevChannel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNextChannel, onPrevChannel]);

  const audit = channel.audit;

  return (
    <div className="space-y-3">
      {/* Mode Switcher & Audit Overview Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-1.5 p-1 bg-[#0c1220] border border-slate-800 rounded-xl shadow-sm">
          {hasDirectHls && (
            <button
              onClick={() => setActiveMode('direct')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeMode === 'direct'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Direct Stream (HLS)</span>
            </button>
          )}

          {hasEmbed && (
            <button
              onClick={() => setActiveMode('embed')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeMode === 'embed'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Embed Player</span>
            </button>
          )}

          <button
            onClick={() => setActiveMode('portal')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeMode === 'portal'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Portal</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => setShowAuditDetails(!showAuditDetails)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              showAuditDetails 
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400 font-semibold'
                : 'bg-[#0c1220] border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
            title="Inspect 5-point source classification"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>5-Point Source Audit</span>
          </button>

          <button
            onClick={() => setShowShortcutsHelp(!showShortcutsHelp)}
            className="hidden sm:inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
            title="Keyboard Shortcuts"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Shortcuts</span>
          </button>

          <a
            href={channel.officialWatchPage}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
          >
            <span>{channel.shortCode} WebTV</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Keyboard shortcuts banner */}
      {showShortcutsHelp && (
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center gap-4">
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px]">Space</kbd> Play / Pause</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px]">M</kbd> Mute / Unmute</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px]">F</kbd> Fullscreen</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px]">← / →</kbd> Switch Channel</span>
          </div>
          <button 
            onClick={() => setShowShortcutsHelp(false)}
            className="text-slate-400 hover:text-white"
          >
            Close
          </button>
        </div>
      )}

      {/* 5-Point Source Classification Audit Box (Toggleable) */}
      {showAuditDetails && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090e1a] border border-emerald-500/30 text-xs text-slate-300 space-y-3.5 animate-in fade-in duration-200 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
              <FileCheck2 className="w-4 h-4" />
              <span>CamTV Source Verification Audit — {channel.name}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Audited: {audit?.lastAuditedDate || '2026-10-16'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* 1. Official Website */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  1. Official Website
                </span>
                <span className="text-white font-medium block truncate" title={channel.officialWebsite}>
                  {channel.officialWebsite}
                </span>
              </div>
              <a 
                href={channel.officialWebsite} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-2 text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Visit Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 2. Official Viewing Page */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  2. Official Viewing Page
                </span>
                <span className="text-white font-medium block truncate" title={channel.officialWatchPage}>
                  {channel.officialWatchPage}
                </span>
              </div>
              <a 
                href={channel.officialWatchPage} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-2 text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Open Watch Page</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 3. Authorised Embedded Player */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  3. Authorised Embed
                </span>
                <span className={`font-semibold ${audit?.hasAuthorisedEmbed ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {audit?.hasAuthorisedEmbed ? 'Available & Authorised' : 'Not Authorised'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                {audit?.embedRestrictionReason || 'Viewing hosted directly on official portal.'}
              </p>
            </div>

            {/* 4. Authorised Direct Stream */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  4. Direct Stream (HLS)
                </span>
                <span className={`font-semibold ${audit?.hasAuthorisedDirectStream ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {audit?.hasAuthorisedDirectStream ? 'Active HLS Feed' : 'Not Public / Restricted'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                {audit?.directStreamNotes || (hasDirectHls ? 'Direct HLS available' : 'Tokenized on broadcaster CDN')}
              </p>
            </div>

            {/* 5. Unverified Source Flag */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  5. Source Verification
                </span>
                <span className={`font-semibold ${channel.sourceStatus === 'unverified' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {channel.sourceStatus === 'unverified' ? 'Unverified Source' : 'Verified Broadcaster'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                Rights: {audit?.rightsHolder || 'Confirmed broadcaster'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Video Screen Container with Cinema Depth */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80 group select-none ring-1 ring-white/5"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => !isFullscreen && setShowControls(true)}
      >
        {/* Subtle Brand Ambient Glow behind player in dark mode */}
        <div 
          className="absolute -inset-10 opacity-20 pointer-events-none blur-3xl transition-colors duration-500"
          style={{ backgroundColor: channel.brandColor }}
        />

        {/* 1. Official Broadcaster Standby Slate */}
        {activeMode === 'portal' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#0b101c]/95 via-slate-950 to-black z-10 overflow-y-auto">
            {/* Station Brand Tile */}
            <div 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 text-white font-black text-xl sm:text-2xl shadow-2xl border border-white/20 transform group-hover:scale-105 transition-transform shrink-0"
              style={{ backgroundColor: channel.brandColor }}
            >
              {channel.shortCode}
            </div>

            {channel.sourceStatus === 'unverified' ? (
              <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Unverified Broadcast Source · Terrestrial / Satellite</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Official Broadcaster Portal</span>
              </div>
            )}

            <h3 className="text-xl sm:text-3xl font-extrabold text-white mb-2 max-w-lg tracking-tight">
              {channel.name}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mb-6 leading-relaxed">
              {channel.sourceNotes}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={channel.officialWatchPage}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-extrabold text-sm transition-all shadow-lg active:scale-95 ${
                  channel.sourceStatus === 'unverified'
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/20'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
                }`}
              >
                <span>
                  {channel.sourceStatus === 'unverified'
                    ? `Open ${channel.shortCode} Official Online Page`
                    : `Open Official ${channel.shortCode} Live Broadcast`}
                </span>
                <ExternalLink className="w-4 h-4 stroke-[2.5]" />
              </a>

              <a
                href={channel.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700/80 transition-colors"
              >
                <Globe className="w-4 h-4 text-slate-300" />
                <span>Station Website</span>
              </a>

              {hasDirectHls && (
                <button
                  onClick={() => setActiveMode('direct')}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
                >
                  <Radio className="w-4 h-4 text-emerald-400" />
                  <span>Switch to Direct HLS</span>
                </button>
              )}

              <button
                onClick={() => setShowAuditDetails(!showAuditDetails)}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors"
              >
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>Audit Report</span>
              </button>
            </div>

            {/* Quick Broadcaster Data Snippet */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-slate-400 max-w-xl">
              <span><strong>Headquarters:</strong> {channel.headquarters}</span>
              {channel.frequencyNotes && <span><strong>Frequencies:</strong> {channel.frequencyNotes}</span>}
              <span><strong>Broadcasting Rights:</strong> {audit?.rightsHolder}</span>
            </div>
          </div>
        )}

        {/* 2. Authorised Embed Iframe (Strict origin verification) */}
        {activeMode === 'embed' && hasEmbed && channel.authorisedEmbedUrl && (
          <div className="w-full h-full relative">
            <iframe
              src={channel.authorisedEmbedUrl}
              title={`${channel.name} Official Live Stream`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs text-slate-200 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold">{channel.name} Embed</span>
            </div>
          </div>
        )}

        {/* 3. Direct Video Stream via Hls.js in HTML5 */}
        {activeMode === 'direct' && (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-contain bg-black cursor-pointer"
              playsInline
              muted={isMuted}
              onClick={togglePlay}
            />

            {/* Loading Spinner Overlay */}
            {playerState === 'loading' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-20">
                <div className="relative w-14 h-14 mb-4">
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping" />
                  <div className="w-14 h-14 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
                </div>
                <p className="text-sm font-bold text-white tracking-tight">Tuning in to {channel.name}...</p>
                <p className="text-xs text-slate-400 mt-1">Connecting to live HLS transmission feed</p>
              </div>
            )}

            {/* Error & Fallback Banner */}
            {playerState === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/95 z-20">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-lg">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white mb-1">Direct Stream Unavailable</h4>
                <p className="text-xs text-slate-300 max-w-sm mb-4 leading-relaxed">
                  {errorMessage || 'This broadcast cannot be played directly due to network, DRM, or geographical limits.'}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Retry Feed</span>
                  </button>

                  <a
                    href={channel.officialWatchPage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors shadow-sm"
                  >
                    <span>Open Official Broadcaster Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => setActiveMode('portal')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors"
                  >
                    <span>View Station Info</span>
                  </button>
                </div>
              </div>
            )}

            {/* Direct Player On-Screen Controls */}
            {playerState !== 'loading' && playerState !== 'error' && (
              <div 
                className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-200 z-10 ${
                  showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                      aria-label={playerState === 'playing' ? 'Pause' : 'Play'}
                    >
                      {playerState === 'playing' ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current" />
                      )}
                    </button>

                    <div className="flex items-center gap-2 group/vol">
                      <button
                        onClick={toggleMute}
                        className="p-2 rounded-xl hover:bg-white/10 text-white transition-colors"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-5 h-5 text-rose-400" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </button>

                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-16 sm:w-20 accent-emerald-400 h-1 bg-white/30 rounded-lg cursor-pointer"
                        aria-label="Volume"
                      />
                    </div>

                    <div className="flex items-center gap-2 pl-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      <span className="text-xs font-bold text-white tracking-wider uppercase">LIVE</span>
                      <span className="hidden sm:inline-block text-[11px] text-slate-300 font-mono">
                        {streamQuality}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveMode('portal')}
                      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                    >
                      <span>Broadcaster Portal</span>
                    </button>

                    <button
                      onClick={toggleFullscreen}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                      aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                    >
                      {isFullscreen ? (
                        <Minimize className="w-5 h-5" />
                      ) : (
                        <Maximize className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
