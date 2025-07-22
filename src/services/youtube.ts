import axios from 'axios';

const API_KEY = 'AIzaSyD9mgPvrqDIunr9rJUT9exPq2kyVnEvM_c';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface ChannelStats {
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
}

export interface ChannelInfo {
  id: string;
  title: string;
  description: string;
  thumbnails: {
    high: {
      url: string;
    };
  };
  stats: ChannelStats;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    high: {
      url: string;
    };
    medium: {
      url: string;
    };
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

export const getChannelInfo = async (channelId?: string): Promise<ChannelInfo> => {
  try {
    let url = `${BASE_URL}/channels?part=snippet,statistics&key=${API_KEY}`;
    if (channelId) {
      url += `&id=${channelId}`;
    } else {
      url += '&mine=true';
    }

    const response = await axios.get(url);
    const channel = response.data.items[0];

    return {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      thumbnails: channel.snippet.thumbnails,
      stats: {
        subscriberCount: channel.statistics.subscriberCount,
        viewCount: channel.statistics.viewCount,
        videoCount: channel.statistics.videoCount,
      },
    };
  } catch (error) {
    console.error('Error fetching channel info:', error);
    throw error;
  }
};

export const getChannelVideos = async (channelId: string): Promise<Video[]> => {
  try {
    // First, get the uploads playlist ID
    const channelResponse = await axios.get(
      `${BASE_URL}/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`
    );
    
    const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

    // Get videos from the uploads playlist
    const playlistResponse = await axios.get(
      `${BASE_URL}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${API_KEY}`
    );

    const videoIds = playlistResponse.data.items.map((item: any) => item.snippet.resourceId.videoId);

    // Get video statistics
    const videosResponse = await axios.get(
      `${BASE_URL}/videos?part=snippet,statistics&id=${videoIds.join(',')}&key=${API_KEY}`
    );

    return videosResponse.data.items.map((video: any) => ({
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      publishedAt: video.snippet.publishedAt,
      thumbnails: video.snippet.thumbnails,
      statistics: {
        viewCount: video.statistics.viewCount || '0',
        likeCount: video.statistics.likeCount || '0',
        commentCount: video.statistics.commentCount || '0',
      },
    }));
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    throw error;
  }
};

export const searchChannelByUsername = async (username: string): Promise<string> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/channels?part=id&forUsername=${username}&key=${API_KEY}`
    );
    
    if (response.data.items.length === 0) {
      throw new Error('Channel not found');
    }
    
    return response.data.items[0].id;
  } catch (error) {
    console.error('Error searching channel:', error);
    throw error;
  }
};