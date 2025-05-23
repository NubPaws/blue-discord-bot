import dotenv from 'dotenv';

dotenv.config();

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
type StringBool = 'true' | 'false';

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
  logger: {
    logLevel: (process.env.LOG_LEVEL || 'info') as LogLevel,
    logPretty: (process.env.LOG_PRETTY || 'true') as StringBool,
    logFile: process.env.LOG_FILE,
  },
};
