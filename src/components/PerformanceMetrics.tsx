
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface PerformanceMetricsProps {
  mp4Stats: {
    bufferCount: number;
    bufferTime: number;
    loadTime: number;
    playing: boolean;
    playedFraction: number;
    loadedFraction: number;
  };
  m3u8Stats: {
    bufferCount: number;
    bufferTime: number;
    loadTime: number;
    playing: boolean;
    playedFraction: number;
    loadedFraction: number;
  };
  className?: string;
}

const PerformanceMetrics = ({ mp4Stats, m3u8Stats, className }: PerformanceMetricsProps) => {
  const [latencyDiff, setLatencyDiff] = useState<number | null>(null);
  const [winner, setWinner] = useState<'MP4' | 'M3U8' | null>(null);

  useEffect(() => {
    // Calculate latency difference if both load times are available
    if (mp4Stats.loadTime > 0 && m3u8Stats.loadTime > 0) {
      const diff = mp4Stats.loadTime - m3u8Stats.loadTime;
      setLatencyDiff(diff);
      
      if (diff > 50) {
        setWinner('M3U8');
      } else if (diff < -50) {
        setWinner('MP4');
      } else {
        setWinner(null); // Too close to call
      }
    }
  }, [mp4Stats.loadTime, m3u8Stats.loadTime]);

  return (
    <div className={cn("glass-panel p-5 animate-fade-in", className)}>
      <h3 className="text-lg font-semibold mb-3">Performance Metrics</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-1">
          <div className="text-center">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Metric</div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="text-center">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">MP4</div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="text-center">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">M3U8</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {/* Initial Load Time */}
        <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-border">
          <div className="col-span-1">
            <div className="text-sm font-medium">Initial Load</div>
          </div>
          <div className="col-span-1">
            <div className="text-center">
              <span className={cn(
                "text-sm font-mono",
                winner === 'MP4' && "text-green-500 font-semibold"
              )}>
                {mp4Stats.loadTime > 0 ? `${mp4Stats.loadTime.toFixed(0)} ms` : "–"}
              </span>
            </div>
          </div>
          <div className="col-span-1">
            <div className="text-center">
              <span className={cn(
                "text-sm font-mono",
                winner === 'M3U8' && "text-green-500 font-semibold"
              )}>
                {m3u8Stats.loadTime > 0 ? `${m3u8Stats.loadTime.toFixed(0)} ms` : "–"}
              </span>
            </div>
          </div>
        </div>
        
        {/* Buffer Events */}
        <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-border">
          <div className="col-span-1">
            <div className="text-sm font-medium">Buffer Events</div>
          </div>
          <div className="col-span-1">
            <div className="text-center">
              <span className="text-sm font-mono">
                {mp4Stats.bufferCount}
              </span>
            </div>
          </div>
          <div className="col-span-1">
            <div className="text-center">
              <span className="text-sm font-mono">
                {m3u8Stats.bufferCount}
              </span>
            </div>
          </div>
        </div>
        
        {/* Buffer Time */}
        <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-border">
          <div className="col-span-1">
            <div className="text-sm font-medium">Buffer Duration</div>
          </div>
          <div className="col-span-1">
            <div className="text-center">
              <span className="text-sm font-mono">
                {mp4Stats.bufferTime > 0 ? `${mp4Stats.bufferTime.toFixed(1)} s` : "–"}
              </span>
            </div>
          </div>
          <div className="col-span-1">
            <div className="text-center">
              <span className="text-sm font-mono">
                {m3u8Stats.bufferTime > 0 ? `${m3u8Stats.bufferTime.toFixed(1)} s` : "–"}
              </span>
            </div>
          </div>
        </div>
        
        {/* Playback State */}
        <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-border">
          <div className="col-span-1">
            <div className="text-sm font-medium">Status</div>
          </div>
          <div className="col-span-1">
            <div className="text-center">
              <span className={cn(
                "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
                mp4Stats.playing ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              )}>
                {mp4Stats.playing ? "Playing" : "Paused"}
              </span>
            </div>
          </div>
          <div className="col-span-1">
            <div className="text-center">
              <span className={cn(
                "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
                m3u8Stats.playing ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              )}>
                {m3u8Stats.playing ? "Playing" : "Paused"}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Latency difference */}
      {latencyDiff !== null && (
        <div className="mt-5 pt-4 border-t border-border">
          <div className="text-center">
            <h4 className="text-sm font-medium mb-2">Latency Difference</h4>
            {Math.abs(latencyDiff) < 50 ? (
              <p className="text-sm text-muted-foreground">Both formats performed similarly (difference: {Math.abs(latencyDiff).toFixed(0)} ms)</p>
            ) : (
              <p className="text-sm">
                <span className={cn(
                  "font-medium",
                  winner === 'MP4' ? "text-green-600" : "text-blue-600"
                )}>
                  {winner}
                </span>{" "}
                was{" "}
                <span className="font-medium">
                  {Math.abs(latencyDiff).toFixed(0)} ms
                </span>{" "}
                faster to load
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMetrics;
