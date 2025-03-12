
import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  url: string;
  format: 'MP4' | 'M3U8';
  onReady: () => void;
  onBuffer: () => void;
  onBufferEnd: () => void;
  onPlay: () => void;
  onPause: () => void;
  onProgress: (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void;
  playing: boolean;
  volume: number;
  muted: boolean;
  playbackRate: number;
  onPlaybackRateChange?: (rate: number) => void;
  syncTime?: number;
  onSyncTimeChange?: (time: number) => void;
}

const VideoPlayer = ({
  url,
  format,
  onReady,
  onBuffer,
  onBufferEnd,
  onPlay,
  onPause,
  onProgress,
  playing,
  volume,
  muted,
  playbackRate,
  onPlaybackRateChange,
  syncTime,
  onSyncTimeChange
}: VideoPlayerProps) => {
  const [loaded, setLoaded] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<ReactPlayer | null>(null);
  const [playerReady, setPlayerReady] = useState(false);

  // Handle syncing of time if provided
  useEffect(() => {
    if (syncTime !== undefined && playerRef.current && playerReady) {
      const currentTime = playerRef.current.getCurrentTime();
      // Only seek if the difference is greater than 0.5 seconds
      if (Math.abs(currentTime - syncTime) > 0.5) {
        playerRef.current.seekTo(syncTime, 'seconds');
      }
    }
  }, [syncTime, playerReady]);

  const handleReady = () => {
    setLoaded(true);
    setPlayerReady(true);
    onReady();
  };

  const handleBuffer = () => {
    setBuffering(true);
    onBuffer();
  };

  const handleBufferEnd = () => {
    setBuffering(false);
    onBufferEnd();
  };

  const handleError = (error: any) => {
    console.error(`Error in ${format} player:`, error);
    setError(`Failed to load ${format} video. Please try again.`);
  };

  const handleProgress = (state: any) => {
    onProgress(state);
    
    // Update sync time if needed
    if (onSyncTimeChange && playerRef.current) {
      onSyncTimeChange(playerRef.current.getCurrentTime());
    }
  };

  return (
    <div className="relative w-full h-full rounded-md overflow-hidden">
      {/* Format badge */}
      <div className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md">
        {format}
      </div>
      
      {/* Loading overlay */}
      {!loaded && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-white text-sm font-medium">Loading {format} player...</p>
          </div>
        </div>
      )}
      
      {/* Buffering indicator */}
      {buffering && loaded && (
        <div className="absolute bottom-3 right-3 z-10 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1.5">
          <div className="h-2 w-2 bg-white rounded-full animate-pulse-opacity"></div>
          Buffering...
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-10">
          <div className="text-white text-center p-4">
            <p className="text-red-400 font-medium mb-2">Error</p>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}
      
      {/* Actual player */}
      <div className={cn(
        "w-full h-full transition-opacity duration-300",
        loaded ? "opacity-100" : "opacity-0"
      )}>
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          playing={playing}
          volume={volume}
          muted={muted}
          playbackRate={playbackRate}
          onReady={handleReady}
          onBuffer={handleBuffer}
          onBufferEnd={handleBufferEnd}
          onPlay={onPlay}
          onPause={onPause}
          onProgress={handleProgress}
          onError={handleError}
          config={{
            file: {
              forceVideo: true,
              attributes: {
                controlsList: 'nodownload',
                disablePictureInPicture: true,
              }
            }
          }}
          style={{
            backgroundColor: '#000',
            borderRadius: '0.375rem',
          }}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
