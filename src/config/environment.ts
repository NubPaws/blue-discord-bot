import dotenv from 'dotenv';

dotenv.config();

export default {
  discord: {
    token: process.env.DISCORD_TOKEN || '',
    prefix: process.env.PREFIX || 'blue',
  },
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID || '',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
  },
  youtubeApiKey: process.env.YOUTUBE_API_KEY || '',
};
