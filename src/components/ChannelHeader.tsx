import { ChannelInfo } from "@/services/youtube";

interface ChannelHeaderProps {
  channel: ChannelInfo;
  totalLikes: number;
  totalComments: number;
}

const formatNumber = (num: string | number): string => {
  const n = typeof num === 'string' ? parseInt(num) : num;
  if (n >= 1000000) {
    return `${(n / 1000000).toFixed(1)}M`;
  }
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1)}K`;
  }
  return n.toString();
};

export const ChannelHeader = ({ channel, totalLikes, totalComments }: ChannelHeaderProps) => {
  return (
    <div className="flex flex-col items-center text-center space-y-6 animate-fade-in">
      {/* Profile Picture */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full blur-xl animate-glow-pulse" />
        <img
          src={channel.thumbnails.high.url}
          alt={channel.title}
          className="relative w-32 h-32 rounded-full border-4 border-primary/30 shadow-lg group-hover:scale-110 transition-transform duration-500 animate-float"
        />
      </div>

      {/* Channel Name */}
      <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-scale-in">
        {channel.title}
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 w-full max-w-4xl">
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:bg-card/70 transition-all duration-300 hover:scale-105 group">
          <div className="text-2xl md:text-3xl font-bold text-primary mb-1 group-hover:animate-pulse">
            {formatNumber(channel.stats.subscriberCount)}
          </div>
          <div className="text-sm text-muted-foreground">Subscribers</div>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:bg-card/70 transition-all duration-300 hover:scale-105 group">
          <div className="text-2xl md:text-3xl font-bold text-primary mb-1 group-hover:animate-pulse">
            {formatNumber(channel.stats.viewCount)}
          </div>
          <div className="text-sm text-muted-foreground">Total Views</div>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:bg-card/70 transition-all duration-300 hover:scale-105 group">
          <div className="text-2xl md:text-3xl font-bold text-primary mb-1 group-hover:animate-pulse">
            {formatNumber(totalLikes)}
          </div>
          <div className="text-sm text-muted-foreground">Total Likes</div>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:bg-card/70 transition-all duration-300 hover:scale-105 group">
          <div className="text-2xl md:text-3xl font-bold text-primary mb-1 group-hover:animate-pulse">
            {formatNumber(totalComments)}
          </div>
          <div className="text-sm text-muted-foreground">Total Comments</div>
        </div>
      </div>
    </div>
  );
};