import { google, youtube_v3 } from 'googleapis';
import environment from '@/config/environment';
import { Song } from '@/types/music/Song';
import { isValidUrl } from './urlValidators';

function isUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

function getClient(): youtube_v3.Youtube {
  return google.youtube({
    version: 'v3',
    auth: environment.youtubeApiKey,
  });
}

async function fetchPlaylist(url: string): Promise<Song[]> {
  if (!isValidUrl(url)) {
    throw new Error('Invalid YouTube playlist URL');
  }

  const urlObj = new URL(url);
  const playlistId = urlObj.searchParams.get('list');
  if (!playlistId) {
    throw new Error('Invalid YouTube playlist URL');
  }

  const youtube = getClient();
  const res = await youtube.playlistItems.list({
    playlistId,
    part: ['snippet'],
    maxResults: 50,
  });

  if (!res.data.items) {
    throw new Error('No playlist items found.');
  }

  return res.data.items.map((item) => ({
    title: item.snippet?.title || 'Unknown Title',
    url: `https://www.youtube.com/watch?v=${item.snippet?.resourceId?.videoId}`,
  }));
}

async function fetchVideo(url: string): Promise<Song> {
  if (!isValidUrl(url)) {
    throw new Error('Invalid YouTube playlist URL');
  }

  const urlObj = new URL(url);
  const videoId =
    urlObj.hostname === 'youtu.be' ? urlObj.pathname.slice(1) : urlObj.searchParams.get('v');

  if (!videoId) {
    throw new Error('Coud not extract video ID from URL');
  }

  const youtube = getClient();
  const res = await youtube.videos.list({
    id: [videoId],
    part: ['snippet'],
  });

  if (!res.data.items || res.data.items.length === 0) {
    throw new Error('Video not found');
  }

  const video = res.data.items[0];

  return {
    title: video.snippet?.title || 'Unknown title',
    url: url,
  };
}

async function fetch(query: string): Promise<Song[]> {
  if (query.includes('list=')) {
    return fetchPlaylist(query);
  }
  return [await fetchVideo(query)];
}

async function fetchSearch(query: string): Promise<Song> {
  const youtube = getClient();
  const res = await youtube.search.list({
    q: query,
    part: ['snippet'],
    type: ['video'],
    maxResults: 1,
  });

  if (!res.data.items || res.data.items.length === 0) {
    throw new Error('No video found for the search query.');
  }

  const video = res.data.items[0];
  const videoId = video.id?.videoId;
  return {
    title: video.snippet?.title || 'Unknown title',
    url: `https://www.youtube.com/watch?v=${videoId}`,
  };
}

export default {
  isUrl,
  getClient,
  fetchPlaylist,
  fetchVideo,
  fetch,
  fetchSearch,
};
