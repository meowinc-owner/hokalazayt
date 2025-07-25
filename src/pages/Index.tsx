import { useState, useEffect } from "react";
import { ChannelHeader } from "@/components/ChannelHeader";
import { SearchBar } from "@/components/SearchBar";
import { VideoCard } from "@/components/VideoCard";
import { getChannelInfo, getChannelVideos, searchChannelByUsername, type ChannelInfo, type Video } from "@/services/youtube";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [channel, setChannel] = useState<ChannelInfo | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadChannelData();
  }, []);

  const loadChannelData = async () => {
    try {
      setLoading(true);
      
      // Try to get the authenticated user's channel first
      // If that fails, we'll use a fallback or prompt for channel ID
      let channelId: string;
      
      try {
        // First try to search for a specific channel or get channel data
        // You can replace this with your channel ID if known
        channelId = 'UCDHSITTwE00VRqNK4eaKw5w'; // Your YouTube channel ID
        
        const [channelData, videosData] = await Promise.all([
          getChannelInfo(channelId),
          getChannelVideos(channelId)
        ]);

        setChannel(channelData);
        setVideos(videosData);
        setFilteredVideos(videosData);

        // Calculate total likes and comments
        const likes = videosData.reduce((sum, video) => sum + parseInt(video.statistics.likeCount), 0);
        const comments = videosData.reduce((sum, video) => sum + parseInt(video.statistics.commentCount), 0);
        
        setTotalLikes(likes);
        setTotalComments(comments);
        
      } catch (error) {
        console.error('Error with channel ID, trying alternative approach:', error);
        throw error;
      }

    } catch (error) {
      console.error('Error loading channel data:', error);
      toast({
        title: "Error loading channel data",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredVideos(videos);
      return;
    }

    const filtered = videos.filter(video =>
      video.title.toLowerCase().includes(query.toLowerCase()) ||
      video.description.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredVideos(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4 animate-fade-in">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Loading channel data...</p>
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-fade-in">
          <h1 className="text-2xl font-bold text-destructive mb-2">Failed to Load Channel</h1>
          <p className="text-muted-foreground mb-4">Unable to fetch channel data. Please try again.</p>
          <button
            onClick={loadChannelData}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-muted/20 animate-pulse-slow -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.15),transparent_70%)] animate-glow-pulse -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--secondary)/0.1),transparent_50%)] animate-float -z-10" />
      <div className="fixed inset-0 bg-grid-pattern opacity-5 mix-blend-overlay animate-grid-flow -z-10" />

      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Channel Header */}
        <ChannelHeader 
          channel={channel} 
          totalLikes={totalLikes} 
          totalComments={totalComments} 
        />

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Videos Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2 animate-fade-in">
              Recent Videos
              <span className="text-primary ml-2">({filteredVideos.length})</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto animate-scale-in" />
          </div>

          {filteredVideos.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <p className="text-xl text-muted-foreground">No videos found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video, index) => (
                <div
                  key={video.id}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    transform: `translateY(${Math.sin(index * 0.5) * 10}px)`
                  }}
                  className="animate-fade-in hover:scale-105 transition-transform duration-300 ease-out hover:z-10 relative"
                >
                  <VideoCard video={video} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
