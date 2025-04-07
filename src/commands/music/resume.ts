import { Message } from 'discord.js';
import { Command } from '@/types/Command';
import { getMusicPlayer } from '@/core/music/musicManager';
import { GuildNotFoundError } from '@/utils/errors';
import { CommandResponse } from '@/types/Response';
import { CommandHelpBuilder } from '@/utils/commandHelpBuilder';

export class ResumeCommand extends Command {
  constructor() {
    super('resume', 'Resumes the currently paused song.');
  }

  public async execute(
    message: Message,
    args: string[],
  ): Promise<CommandResponse> {
    const guildId = message.guild?.id;
    if (!guildId) {
      throw new GuildNotFoundError();
    }

    const player = getMusicPlayer(guildId);
    player.resume();
    return CommandResponse.message('Resumed the current song.');
  }

  public help(): string {
    return new CommandHelpBuilder()
      .command(this.name, this.description)
      .usage(`${this.name}`)
      .toString();
  }
}
