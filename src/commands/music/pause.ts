import { Message } from 'discord.js';
import { Command } from '@/types/Command';
import { getMusicPlayer } from '@/core/music/musicManager';
import { GuildNotFoundError } from '@/utils/errors';
import { CommandResponse } from '@/types/Response';
import { CommandHelpBuilder } from '@/utils/commandHelpBuilder';

export class PauseCommand extends Command {
  constructor() {
    super('pause', 'Pauses the currently playing song.');
  }

  public async execute(message: Message): Promise<CommandResponse> {
    const guildId = message.guild?.id;
    if (!guildId) {
      throw new GuildNotFoundError();
    }

    const player = getMusicPlayer(guildId);
    player.pause();
    return CommandResponse.message('Paused the current song.');
  }

  public help(): string {
    return new CommandHelpBuilder()
      .command(this.name, this.description)
      .usage(`${this.name}`)
      .toString();
  }
}
