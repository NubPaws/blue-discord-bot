import { Message } from 'discord.js';
import { Command } from '@/types/Command';
import { GuildNotFoundError } from '@/utils/errors';
import { getMusicPlayer } from '@/core/music/musicManager';
import { CommandResponse } from '@/types/Response';
import { CommandHelpBuilder } from '@/utils/commandHelpBuilder';

export class SkipCommand extends Command {
  constructor() {
    super('skip', 'Skips the current song in the queue.');
  }

  public async execute(message: Message): Promise<CommandResponse> {
    const guildId = message.guild?.id;
    if (!guildId) {
      throw new GuildNotFoundError();
    }

    const player = getMusicPlayer(guildId);
    player.skip();
    return CommandResponse.message('Skipped the current song.');
  }

  public help(): string {
    return new CommandHelpBuilder()
      .command(this.name, this.description)
      .usage(`${this.name}`)
      .toString();
  }
}
