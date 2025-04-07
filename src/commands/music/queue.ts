import { Message } from 'discord.js';
import { Command } from '@/types/Command';
import { GuildNotFoundError } from '@/utils/errors';
import { getMusicPlayer } from '@/core/music/musicManager';

const command: Command = {
  name: 'queue',
  aliases: ['q'],
  description: 'Displays the current music queue.',
  async execute(message: Message, args: string[]) {
    const guildId = message.guild?.id;
    if (!guildId) {
      throw new GuildNotFoundError();
    }

    const player = getMusicPlayer(guildId);
    const queue = player.getQueue();
    if (queue.length === 0) {
      await message.reply('The queue is empty.');
      return;
    }
    const queueMessage = queue.map((song, index) => `${index + 1}. ${song.title}`).join('\n');
    await message.reply(`Current queue:\n${queueMessage}`);
  },
};

export default command;
