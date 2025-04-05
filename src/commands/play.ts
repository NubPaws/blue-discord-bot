import { Message } from "discord.js";
import { Command } from "../types/Command";
import { isValidUrl } from "../utils/urlValidators";
import { Song } from "../types/Song";
import { InvalidCommandArgumentsError } from "../utils/errors";
import youtubeHandler from "../utils/youtubeHandler";
import spotifyHandler from "../utils/spotifyHandler";

export const command: Command = {
  name: 'play',
  aliases: ['p'],
  description: 'Plays a song from YouTube or Spotify by searching for it.',
  async execute(message: Message, args: string[]) {
    if (!args.length) {
      await message.reply('Please provide a song name or URL.');
      return;
    }

    const query = args.join(' ');
    let songs: Song[] = [];

    if (!isValidUrl(query)) {
      throw new InvalidCommandArgumentsError('Invalid URL.');
    }

    if (youtubeHandler.isUrl(query)) {
      songs = await youtubeHandler.fetch(query);
    } else if (spotifyHandler.isUrl(query)) {
      const spotifySongs = await spotifyHandler.fetch(query);
      // TODO: Continue from here
    } else {
      throw new InvalidCommandArgumentsError('Unsupported URL.');
    }
  },
};
