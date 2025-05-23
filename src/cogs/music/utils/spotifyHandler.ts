import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import environment from '@/config/environment';
import logger from '@/utils/logger';
import { Song, SpotifySong } from '@/cogs/music/types/Song';
import youtubeHandler from './youtubeHandler';

const spotify = SpotifyApi.withClientCredentials(
  environment.spotify.clientId,
  environment.spotify.clientSecret,
);

const SPOTIFY_URL_RE =
  /^https?:\/\/open\.spotify\.com\/(?<type>track|playlist)\/(?<id>[a-zA-Z0-9]+)/;

export function isUrl(url: string): boolean {
  return SPOTIFY_URL_RE.test(url);
}

function extractId(url: string, kind: 'track' | 'playlist'): string {
  const match = url.match(SPOTIFY_URL_RE);
  if (!match || match.groups?.type !== kind) {
    throw new Error(`Invalid Spotify ${kind} URL: "${url}"`);
  }
  return match.groups.id;
}

export async function fetchTrack(url: string): Promise<SpotifySong> {
  try {
    const trackId = extractId(url, 'track');
    const track = await spotify.tracks.get(trackId);

    return {
      title: track.name,
      artist: track.artists.map((a) => a.name).join(', '),
    };
  } catch (error) {
    logger.error({ error }, 'Failed to fetch Spotify track');
    throw error;
  }
}

export async function fetchPlaylist(url: string): Promise<SpotifySong[]> {
  try {
    const playlistId = extractId(url, 'playlist');
    const playlist = await spotify.playlists.getPlaylist(playlistId);

    return playlist.tracks.items
      .filter((i): i is (typeof playlist.tracks.items)[number] => !!i.track)
      .map((item) => ({
        title: item.track.name,
        artist: item.track.artists.map((a) => a.name).join(', '),
      }));
  } catch (err) {
    logger.error('Failed to fetch Spotify playlist', err);
    throw err;
  }
}

export async function fetch(query: string): Promise<SpotifySong[]> {
  return query.includes('/track/')
    ? [await fetchTrack(query)]
    : fetchPlaylist(query);
}

export async function searchYouTube({
  title,
  artist,
}: SpotifySong): Promise<Song> {
  return youtubeHandler.fetchSearch(`${title} ${artist}`);
}

export default {
  isUrl,
  fetchTrack,
  fetchPlaylist,
  fetch,
  searchYouTube,
};
