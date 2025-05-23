import { Command } from '@/types/Command';
import { CommandResponse } from '@/types/Response';
import { CommandHelpBuilder } from '@/utils/commandHelpBuilder';
import { GuildNotFoundError } from '@/errors';
import { Message, PermissionsBitField, TextChannel } from 'discord.js';

export class ClearChatCommand extends Command {
  constructor() {
    super(
      'clear_chat',
      'Deletes the specified number of messages from the channel.',
    );
  }

  public async execute(
    message: Message,
    args: string[],
  ): Promise<CommandResponse> {
    if (!message.guild?.id) {
      throw new GuildNotFoundError();
    }

    if (
      !message.member?.permissions.has(PermissionsBitField.Flags.ManageMessages)
    ) {
      return CommandResponse.message(
        'You do not have permission to delete messages.',
      );
    }

    const amount = parseInt(args[0], 10);
    if (isNaN(amount) || amount <= 0) {
      return CommandResponse.message(
        'Please specify a valid number of messages to delete.',
      );
    }

    const deleteCount = Math.min(amount, 100);
    if (message.channel instanceof TextChannel) {
      await message.channel.bulkDelete(deleteCount, true);
      return CommandResponse.message(`Deleted ${deleteCount} messages.`);
    } else {
      return CommandResponse.message(
        'This command can only be used in text channels.',
      );
    }
  }

  public help(): string {
    return new CommandHelpBuilder()
      .command(this.name, this.description)
      .usage(`${this.name} <number-of-messages>`)
      .toString();
  }
}
