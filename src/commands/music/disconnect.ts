import { Message } from 'discord.js';
import { Command } from '@/types/Command';
import { GuildNotFoundError } from '@/utils/errors';
import { getMusicPlayer, removeMusicPlayer } from '@/core/music/musicManager';

const command: Command = {
  name: 'disconnect',
  aliases: ['dc'],
  description: 'Disconnects the bot from the voice channel and clears any active queues.',
  async execute(message: Message, args: string[]) {
    const guildId = message.guild?.id;
    if (!guildId) {
      throw new GuildNotFoundError();
    }

    const player = getMusicPlayer(guildId);
    player.disconnect();
    removeMusicPlayer(guildId);
    await message.reply('Disconnected.');
  },
};

export default command;
