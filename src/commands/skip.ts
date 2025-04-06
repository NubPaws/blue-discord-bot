import { Message } from 'discord.js';
import { Command } from '../types/Command';
import { GuildNotFoundError } from '../utils/errors';
import { getMusicPlayer } from '../core/musicManager';

export const command: Command = {
  name: 'skip',
  aliases: [],
  description: 'Skips the current song in the queue.',
  async execute(message: Message, args: string[]) {
    const guildId = message.guild?.id;
    if (!guildId) {
      throw new GuildNotFoundError();
    }

    const player = getMusicPlayer(guildId);

    player.skip();
    await message.reply('Skipped the current song.');
  },
};
