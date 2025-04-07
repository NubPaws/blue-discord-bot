import { Command } from '@/types/Command';
import { Message, PermissionsBitField, TextChannel } from 'discord.js';

const command: Command = {
  name: 'clear_chat',
  description: 'Deletes the specified number of messages from the channel.',
  execute: async (message: Message, args: string[]) => {
    if (!message.member?.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      await message.reply('You do not have permission to delete messages.');
      return;
    }

    const amount = parseInt(args[0], 10);
    if (isNaN(amount) || amount <= 0) {
      await message.reply('Please specify a valid number of messages to delete.');
      return;
    }

    const deleteCount = Math.min(amount, 100);
    if (message.channel instanceof TextChannel) {
      await message.channel.bulkDelete(deleteCount, true);
    } else {
      await message.reply('This command can only be used in text channels.');
    }
  },
};

export default command;
