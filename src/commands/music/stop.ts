import { Message } from 'discord.js';
import { Command } from '@/types/Command';
import { getMusicPlayer } from '@/core/music/musicManager';
import { GuildNotFoundError } from '@/utils/errors';
import { CommandResponse } from '@/types/Response';
import { CommandHelpBuilder } from '@/utils/commandHelpBuilder';

export class StopCommand extends Command {
  constructor() {
    super('stop', 'Stops the music and clears the queue.');
  }

  public async execute(message: Message, args: string[]): Promise<CommandResponse> {
    const guildId = message.guild?.id;
    if (!guildId) {
      throw new GuildNotFoundError();
    }

    const player = getMusicPlayer(guildId);
    player.stop();
    return CommandResponse.message('Stopping...');
  }

  public help(): string {
    return new CommandHelpBuilder()
      .command(this.name, this.description)
      .usage(`${this.name}`)
      .toString();
  }
}
