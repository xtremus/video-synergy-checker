
import { useState, useEffect, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import VideoPlayer from './VideoPlayer';
import PerformanceMetrics from './PerformanceMetrics';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import sample videos
import sampleMp4 from '../assets/videos/sample.mp4';
// Use the correct import path with extension
import sampleM3u8 from '../assets/videos/big_buck_bunny_1080p/output.m38';

const VideoComparison = () => {
  // Playback state
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [syncTime, setSyncTime] = useState(0);
  
  // Performance metrics
  const [mp4Stats, setMp4Stats] = useState({
    bufferCount: 0,
    bufferTime: 0,
    loadTime: 0,
    playing: false,
    playedFraction: 0,
    loadedFraction: 0
  });
  
  const [m3u8Stats, setM3u8Stats] = useState({
    bufferCount: 0,
    bufferTime: 0,
    loadTime: 0,
    playing: false,
    playedFraction: 0,
    loadedFraction: 0
  });
  
  // Timing references
  const mp4LoadStartTime = useRef<number | null>(null);
  const m3u8LoadStartTime = useRef<number | null>(null);
  const mp4BufferStartTime = useRef<number | null>(null);
  const m3u8BufferStartTime = useRef<number | null>(null);
  
  // UI state
  const [showControls, setShowControls] = useState(true);
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle controls visibility
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
      
      controlsTimerRef.current = setTimeout(() => {
        if (playing) {
          setShowControls(false);
        }
      }, 3000);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    };
  }, [playing]);
  
  // MP4 handlers
  const handleMp4Ready = () => {
    if (mp4LoadStartTime.current !== null) {
      const loadTime = performance.now() - mp4LoadStartTime.current;
      setMp4Stats(prev => ({ ...prev, loadTime }));
      toast({
        title: "MP4 Video Ready",
        description: `Loaded in ${loadTime.toFixed(0)} ms`,
        duration: 3000,
      });
    }
  };
  
  const handleMp4Buffer = () => {
    setMp4Stats(prev => ({ ...prev, bufferCount: prev.bufferCount + 1 }));
    mp4BufferStartTime.current = performance.now();
  };
  
  const handleMp4BufferEnd = () => {
    if (mp4BufferStartTime.current !== null) {
      const bufferDuration = (performance.now() - mp4BufferStartTime.current) / 1000;
      setMp4Stats(prev => ({ 
        ...prev, 
        bufferTime: prev.bufferTime + bufferDuration 
      }));
      mp4BufferStartTime.current = null;
    }
  };
  
  const handleMp4Progress = (state: any) => {
    setMp4Stats(prev => ({ 
      ...prev, 
      playedFraction: state.played,
      loadedFraction: state.loaded
    }));
  };
  
  // M3U8 handlers
  const handleM3u8Ready = () => {
    if (m3u8LoadStartTime.current !== null) {
      const loadTime = performance.now() - m3u8LoadStartTime.current;
      setM3u8Stats(prev => ({ ...prev, loadTime }));
      toast({
        title: "M3U8 Stream Ready",
        description: `Loaded in ${loadTime.toFixed(0)} ms`,
        duration: 3000,
      });
    }
  };
  
  const handleM3u8Buffer = () => {
    setM3u8Stats(prev => ({ ...prev, bufferCount: prev.bufferCount + 1 }));
    m3u8BufferStartTime.current = performance.now();
  };
  
  const handleM3u8BufferEnd = () => {
    if (m3u8BufferStartTime.current !== null) {
      const bufferDuration = (performance.now() - m3u8BufferStartTime.current) / 1000;
      setM3u8Stats(prev => ({ 
        ...prev, 
        bufferTime: prev.bufferTime + bufferDuration 
      }));
      m3u8BufferStartTime.current = null;
    }
  };
  
  const handleM3u8Progress = (state: any) => {
    setM3u8Stats(prev => ({ 
      ...prev, 
      playedFraction: state.played,
      loadedFraction: state.loaded
    }));
  };
  
  // Common handlers
  const handlePlay = () => {
    setPlaying(true);
    setMp4Stats(prev => ({ ...prev, playing: true }));
    setM3u8Stats(prev => ({ ...prev, playing: true }));
  };
  
  const handlePause = () => {
    setPlaying(false);
    setMp4Stats(prev => ({ ...prev, playing: false }));
    setM3u8Stats(prev => ({ ...prev, playing: false }));
  };
  
  const handleRestart = () => {
    setSyncTime(0);
    setPlaying(false);
    
    // Reset metrics
    setMp4Stats({
      bufferCount: 0,
      bufferTime: 0,
      loadTime: mp4Stats.loadTime, // Keep the initial load time
      playing: false,
      playedFraction: 0,
      loadedFraction: 0
    });
    
    setM3u8Stats({
      bufferCount: 0,
      bufferTime: 0,
      loadTime: m3u8Stats.loadTime, // Keep the initial load time
      playing: false,
      playedFraction: 0,
      loadedFraction: 0
    });
    
    // Short delay before starting again
    setTimeout(() => {
      setPlaying(true);
    }, 500);
  };
  
  const togglePlay = () => {
    setPlaying(!playing);
  };
  
  const toggleMute = () => {
    setMuted(!muted);
  };
  
  // Set load start times on component mount
  useEffect(() => {
    mp4LoadStartTime.current = performance.now();
    m3u8LoadStartTime.current = performance.now();
    
    return () => {
      mp4LoadStartTime.current = null;
      m3u8LoadStartTime.current = null;
    };
  }, []);
  
  return (
    <div className="w-full h-full flex flex-col">
      {/* Video comparison area */}
      <div className="relative flex-grow flex flex-col lg:flex-row gap-4 p-4">
        {/* MP4 Video */}
        <div className="w-full lg:w-1/2 h-full min-h-[200px] relative rounded-lg overflow-hidden bg-black/5">
          <div className="absolute inset-0">
            <VideoPlayer
              url={sampleMp4}
              format="MP4"
              onReady={handleMp4Ready}
              onBuffer={handleMp4Buffer}
              onBufferEnd={handleMp4BufferEnd}
              onPlay={handlePlay}
              onPause={handlePause}
              onProgress={handleMp4Progress}
              playing={playing}
              volume={volume}
              muted={muted}
              playbackRate={playbackRate}
              syncTime={syncTime}
            />
          </div>
          {/* Progress bar for MP4 */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <div 
              className="h-full bg-primary/80" 
              style={{ width: `${mp4Stats.playedFraction * 100}%` }}
            />
            <div 
              className="h-full bg-primary/30 -translate-y-full" 
              style={{ width: `${mp4Stats.loadedFraction * 100}%` }}
            />
          </div>
        </div>
        
        {/* M3U8 Video */}
        <div className="w-full lg:w-1/2 h-full min-h-[200px] relative rounded-lg overflow-hidden bg-black/5">
          <div className="absolute inset-0">
            <VideoPlayer
              url={sampleM3u8}
              format="M3U8"
              onReady={handleM3u8Ready}
              onBuffer={handleM3u8Buffer}
              onBufferEnd={handleM3u8BufferEnd}
              onPlay={handlePlay}
              onPause={handlePause}
              onProgress={handleM3u8Progress}
              playing={playing}
              volume={volume}
              muted={muted}
              playbackRate={playbackRate}
              syncTime={syncTime}
              onSyncTimeChange={setSyncTime}
            />
          </div>
          {/* Progress bar for M3U8 */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <div 
              className="h-full bg-primary/80" 
              style={{ width: `${m3u8Stats.playedFraction * 100}%` }}
            />
            <div 
              className="h-full bg-primary/30 -translate-y-full" 
              style={{ width: `${m3u8Stats.loadedFraction * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Controls and metrics */}
      <div className={cn(
        "flex flex-col transition-opacity duration-300",
        showControls ? "opacity-100" : "opacity-0"
      )}>
        {/* Playback controls */}
        <div className="flex items-center justify-between p-4 gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={togglePlay}>
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </Button>
            <Button variant="outline" size="icon" onClick={handleRestart}>
              <RotateCcw size={18} />
            </Button>
            <Button variant="outline" size="icon" onClick={toggleMute}>
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </Button>
            {!muted && (
              <div className="w-24 md:w-32">
                <Slider
                  value={[volume * 100]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setVolume(value[0] / 100)}
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden md:inline">Playback Speed:</span>
            <select
              value={playbackRate}
              onChange={(e) => setPlaybackRate(Number(e.target.value))}
              className="bg-transparent border rounded px-2 py-1 text-sm"
            >
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
          </div>
        </div>
        
        <Separator />
        
        {/* Performance metrics */}
        <div className="p-4">
          <PerformanceMetrics
            mp4Stats={mp4Stats}
            m3u8Stats={m3u8Stats}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoComparison;
