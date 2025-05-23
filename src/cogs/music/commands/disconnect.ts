import { Message } from 'discord.js';
import { Command } from '@/types/Command';
import { GuildNotFoundError } from '@/errors';
import { getMusicPlayer, removeMusicPlayer } from '@/cogs/music/musicManager';
import { CommandResponse } from '@/types/Response';
import { CommandHelpBuilder } from '@/utils/commandHelpBuilder';

export class DisconnectCommand extends Command {
  constructor() {
    super(
      'disconnect',
      'Disconnects the bot from the voice channel and clears any active queues.',
      ['dc'],
    );
  }

  public async execute(message: Message): Promise<CommandResponse> {
    const guildId = message.guild?.id;
    if (!guildId) {
      throw new GuildNotFoundError();
    }

    const player = getMusicPlayer(guildId);
    player.disconnect();
    removeMusicPlayer(guildId);
    return CommandResponse.message('Disconnected.');
  }

  public help(): string {
    return new CommandHelpBuilder()
      .command(this.name, this.description)
      .usage(`${this.name}`)
      .toString();
  }
}
