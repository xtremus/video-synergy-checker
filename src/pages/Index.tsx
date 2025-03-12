
import VideoComparison from '@/components/VideoComparison';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/30">
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/70 sticky top-0 z-10">
        <div className="container py-4 px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Video Format Comparison
              </h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                Analyze latency and performance differences between MP4 and M3U8 video formats
              </p>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <span className="hidden md:inline text-muted-foreground">Compare:</span>
              <div className="flex items-center">
                <span className="px-2 py-1 bg-primary/10 text-primary font-medium rounded-l-md">MP4</span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground font-medium rounded-r-md">M3U8/HLS</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4">
        <div className="animate-slide-up grid grid-cols-1 gap-6">
          <div className="glass-panel overflow-hidden min-h-[600px] flex flex-col">
            <VideoComparison />
          </div>
          
          <div className="glass-panel p-6 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">About This Comparison</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-base font-medium mb-2">MP4 Format</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  MP4 is a container format that stores audio, video, and subtitles in a single file. It's widely compatible and offers good quality at reasonable file sizes.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="rounded-full bg-primary/10 text-primary p-1 mt-0.5">✓</span>
                    <span>Faster initial load for smaller files</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="rounded-full bg-primary/10 text-primary p-1 mt-0.5">✓</span>
                    <span>Better compatibility across devices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="rounded-full bg-destructive/10 text-destructive p-1 mt-0.5">✗</span>
                    <span>No adaptive bitrate streaming</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-base font-medium mb-2">M3U8/HLS Format</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  HLS (HTTP Live Streaming) uses M3U8 playlist files that reference smaller video segments. It supports adaptive bitrate streaming for varying network conditions.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="rounded-full bg-primary/10 text-primary p-1 mt-0.5">✓</span>
                    <span>Adaptive streaming based on network conditions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="rounded-full bg-primary/10 text-primary p-1 mt-0.5">✓</span>
                    <span>Better for longer videos and live streams</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="rounded-full bg-destructive/10 text-destructive p-1 mt-0.5">✗</span>
                    <span>Higher initial loading time</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-border/60">
              <h3 className="text-base font-medium mb-2">How to Use This Tool</h3>
              <p className="text-sm text-muted-foreground">
                Play both videos simultaneously and observe the differences in load time, buffering, and overall playback smoothness. The performance metrics panel displays detailed statistics to help you compare the formats objectively.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-border/40 py-4 mt-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            Video Synergy Checker — Compare MP4 and M3U8 video formats for performance analysis
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
