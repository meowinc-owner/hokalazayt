import { Video } from "@/services/youtube";
import { Eye, ThumbsUp, MessageCircle, Calendar } from "lucide-react";

interface VideoCardProps {
  video: Video;
}

const formatNumber = (num: string): string => {
  const n = parseInt(num);
  if (n >= 1000000) {
    return `${(n / 1000000).toFixed(1)}M`;
  }
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1)}K`;
  }
  return n.toString();
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const VideoCard = ({ video }: VideoCardProps) => {
  const handleClick = () => {
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
  };

  return (
    <div 
      onClick={handleClick}
      className="group cursor-pointer bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden hover:bg-card/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10 animate-fade-in"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnails.high.url}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center animate-scale-in">
            <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {video.title}
        </h3>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 group-hover:text-primary/80 transition-colors">
              <Eye className="w-4 h-4" />
              <span>{formatNumber(video.statistics.viewCount)}</span>
            </div>
            
            <div className="flex items-center space-x-1 group-hover:text-primary/80 transition-colors">
              <ThumbsUp className="w-4 h-4" />
              <span>{formatNumber(video.statistics.likeCount)}</span>
            </div>
            
            <div className="flex items-center space-x-1 group-hover:text-primary/80 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>{formatNumber(video.statistics.commentCount)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(video.publishedAt)}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-muted-foreground/80 transition-colors">
          {video.description}
        </p>
      </div>
    </div>
  );
};