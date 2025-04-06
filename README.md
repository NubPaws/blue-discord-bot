# Blue Discord Bot

This is a modular Discord bot built using Node.js and TypeScript that supports music playback from YouTube and Spotify, command aliases, and playlists. The project is designed to be easily extendable with new commands and modules.

## Setup

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Update the token and prefix in `src/config/config.ts`.
4. Build the project using `npm run build`.
5. Start the bot with `npm start` or use `npm run dev` for development.

## Commands

- `!play` or `!p` - Play a song by URL or name.
- `!stop` - Stop the music and clear the queue.
- `!skip` - Skip the current song.
- `!disconnect` or `!dc` - Disconnect the bot from the voice channel.
- `!queue` or `!q` - Display the current queue.

User needs to install ffmpeg and yt-dlp
Maybe make a docker container for it.
