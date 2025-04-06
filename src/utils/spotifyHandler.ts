import SpotifyWebApi from 'spotify-web-api-node';
import environment from '../config/environment';
import logger from './logger';
import { Song, SpotifySong } from '../types/Song';
import youtubeHandler from './youtubeHandler';

const spotifyApi = new SpotifyWebApi({
  clientId: environment.spotify.clientId,
  clientSecret: environment.spotify.clientSecret,
});

let initialized = false;

async function initialize() {
  if (initialized) {
    return;
  }

  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);
    initialized = true;
  } catch (err) {
    logger.error('Failed to retrieve Spotify access token', err);
  }
}

function isUrl(url: string): boolean {
  return url.includes('spotify.com');
}

async function fetchTrack(url: string): Promise<SpotifySong> {
  // Expected format: https://open.spotify.com/track/{id}
  const regex = /track\/([a-zA-Z0-9]+)/;
  const match = url.match(regex);
  if (!match) {
    throw new Error("Invalid Spotify track URL");
  }

  const trackId = match[1];

  await initialize();

  const data = await spotifyApi.getTrack(trackId);
  const track = data.body;

  return {
    title: track.name,
    artist: track.artists.map(a => a.name).join(', '),
  };
}

async function fetchPlaylist(url: string): Promise<SpotifySong[]> {
  // Expected format: https://open.spotify.com/playlist/{id}
  const regex = /playlist\/([a-zA-Z0-9]+)/;
  const match = url.match(regex);
  if (!match) {
    throw new Error("Invalid Spotify playlist URL");
  }
  const playlistId = match[1];

  await initialize();

  const data = await spotifyApi.getPlaylist(playlistId);
  const tracks = data.body.tracks.items;

  return tracks.map((item: any) => ({
    title: item.track.name,
    artist: item.track.artists.map((a: any) => a.name).join(', '),
  }));
}

async function fetch(query: string): Promise<SpotifySong[]> {
  if (query.includes('/track/')) {
    return [await fetchTrack(query)];
  }
  return fetchPlaylist(query);
}

async function searchYouTube({ title, artist }: SpotifySong): Promise<Song> {
  const query = `${title} ${artist}`;
  return await youtubeHandler.fetchSearch(query);
}

export default {
  isUrl,
  fetchTrack,
  fetchPlaylist,
  fetch,
  searchYouTube,
}
