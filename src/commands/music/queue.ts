import { Message } from 'discord.js';
import { Command } from '@/types/Command';
import { GuildNotFoundError } from '@/utils/errors';
import { getMusicPlayer } from '@/core/music/musicManager';
import { CommandResponse } from '@/types/Response';
import { CommandHelpBuilder } from '@/utils/commandHelpBuilder';

export class QueueCommand extends Command {
  constructor() {
    super('queue', 'Displays the current music queue.', ['q']);
  }

  public async execute(message: Message, args: string[]): Promise<CommandResponse> {
    const guildId = message.guild?.id;
    if (!guildId) {
      throw new GuildNotFoundError();
    }

    const player = getMusicPlayer(guildId);
    const queue = player.getQueue();
    if (queue.length === 0) {
      return CommandResponse.message('The queue is empty.');
    }

    const queueMessage = queue.map((song, index) => `${index + 1}. ${song.title}`).join('\n');
    return CommandResponse.message(`Current queue:\n${queueMessage}`);
  }

  public help(): string {
    return new CommandHelpBuilder()
      .command(this.name, this.description)
      .usage(`${this.name}`)
      .toString();
  }
}
