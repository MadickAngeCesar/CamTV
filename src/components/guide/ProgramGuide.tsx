import React, { useState } from 'react';
import { Channel, ScheduleItem } from '../../types/channel';
import { Clock, Calendar, ExternalLink, AlertCircle, Play, Sparkles } from 'lucide-react';

interface ProgramGuideProps {
  channels: Channel[];
  selectedChannelId?: string;
  onSelectChannel: (channel: Channel) => void;
  onWatchChannel: (channel: Channel) => void;
}

export const ProgramGuide: React.FC<ProgramGuideProps> = ({
  channels,
  selectedChannelId,
  onSelectChannel,
  onWatchChannel,
}) => {
  const [activeChannelId, setActiveChannelId] = useState<string>(
    selectedChannelId || channels[0]?.id || ''
  );

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];

  const getNowWAT = () => {
    const now = new Date();
    const utcHours = now.getUTCHours();
    const utcMins = now.getUTCMinutes();
    const watHours = (utcHours + 1) % 24;
    return watHours * 60 + utcMins;
  };

  const parseTimeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const currentWATMinutes = getNowWAT();

  const isCurrentProgram = (item: ScheduleItem) => {
    const start = parseTimeToMinutes(item.startTime);
    const end = parseTimeToMinutes(item.endTime);
    if (end > start) {
      return currentWATMinutes >= start && currentWATMinutes < end;
    }
    return currentWATMinutes >= start || currentWATMinutes < end;
  };

  const getProgramProgress = (item: ScheduleItem) => {
    const start = parseTimeToMinutes(item.startTime);
    const end = parseTimeToMinutes(item.endTime);
    let duration = end - start;
    if (duration <= 0) duration += 24 * 60;
    let elapsed = currentWATMinutes - start;
    if (elapsed < 0) elapsed += 24 * 60;
    const pct = Math.min(100, Math.max(0, Math.round((elapsed / duration) * 100)));
    return pct;
  };

  const formatWATClock = () => {
    const now = new Date();
    const watHours = String((now.getUTCHours() + 1) % 24).padStart(2, '0');
    const watMins = String(now.getUTCMinutes()).padStart(2, '0');
    return `${watHours}:${watMins} WAT (UTC+1 · Yaoundé)`;
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <span>Electronic Programme Guide (EPG)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Verified daily broadcast schedules and on-air listings calibrated to West Africa Time (WAT).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl w-fit shadow-sm">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span>Local Time: {formatWATClock()}</span>
        </div>
      </div>

      {/* Channel Selector Horizontal Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {channels.map((ch) => {
          const isSelected = ch.id === activeChannel.id;
          const hasSchedule = !!ch.schedule && ch.schedule.length > 0;
          return (
            <button
              key={ch.id}
              onClick={() => {
                setActiveChannelId(ch.id);
                onSelectChannel(ch);
              }}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                isSelected
                  ? 'bg-slate-800 text-white border-emerald-500/80 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-[#0e1422] text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div 
                className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black text-white shrink-0"
                style={{ backgroundColor: ch.brandColor }}
              >
                {ch.shortCode.slice(0, 3)}
              </div>
              <span>{ch.name}</span>
              {!hasSchedule && (
                <span className="text-[10px] text-slate-400 font-normal">· WebTV</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Channel Schedule View */}
      {activeChannel && (
        <div className="bg-[#0e1422] border border-slate-800/90 rounded-3xl p-5 sm:p-7 space-y-6 shadow-xl">
          {/* Channel Header inside EPG */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
            <div className="flex items-center gap-3.5">
              <div 
                className="w-13 h-13 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-lg border border-white/20 shrink-0"
                style={{ backgroundColor: activeChannel.brandColor }}
              >
                {activeChannel.shortCode}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">{activeChannel.name} Broadcast Schedule</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span>{activeChannel.country}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeChannel.languages.join('/')}</span>
                  <span aria-hidden="true">·</span>
                  <span>Headquarters: {activeChannel.headquarters}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onWatchChannel(activeChannel)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-colors shadow-md active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Watch {activeChannel.shortCode} Now</span>
              </button>
              <a
                href={activeChannel.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
                title="Broadcaster Official Website"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Schedule Listings or Empty State */}
          {activeChannel.schedule && activeChannel.schedule.length > 0 ? (
            <div className="space-y-2.5">
              {activeChannel.schedule.map((item) => {
                const isNow = isCurrentProgram(item);
                const progress = isNow ? getProgramProgress(item) : 0;

                return (
                  <div 
                    key={item.id}
                    className={`p-4 rounded-2xl transition-all border ${
                      isNow 
                        ? 'bg-emerald-500/10 border-emerald-500/40 shadow-md ring-1 ring-emerald-500/20' 
                        : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start sm:items-center gap-4 min-w-0">
                        {/* Time Column */}
                        <div className="min-w-[95px] font-mono text-xs font-bold text-slate-300 tabular-nums">
                          {item.startTime} – {item.endTime}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white tracking-tight truncate">
                              {item.title}
                            </h4>
                            {isNow && (
                              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-wider text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                On Air Now
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                        <span className="text-xs text-slate-400 font-semibold">{item.category}</span>
                        {isNow && (
                          <button
                            onClick={() => onWatchChannel(activeChannel)}
                            className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                          >
                            Watch
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar for Current Show */}
                    {isNow && (
                      <div className="mt-3 pt-2.5 border-t border-emerald-500/20 flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-400 rounded-full transition-all duration-500" 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-emerald-300 tabular-nums">
                          {progress}% elapsed
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 text-center bg-slate-950/60 rounded-2xl border border-slate-800/70 space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                <AlertCircle className="w-6 h-6 text-amber-400" />
              </div>
              <h4 className="text-base font-bold text-white">
                No Automated Programme Schedule Published
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                {activeChannel.name} does not publish an open electronic programme guide (EPG) feed. Daily broadcast announcements and special programming are published directly on their official portal.
              </p>
              <a
                href={activeChannel.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
              >
                <span>Visit {activeChannel.shortCode} Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
