import { Message } from "discord.js";
import { Command } from "../types/Command";

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

    const song = {
      title: '',
      url: query,
    };
  },
};
