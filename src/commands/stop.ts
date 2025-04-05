import { Message } from "discord.js";
import { Command } from "../types/Command";
import { getMusicPlayer } from "../core/musicManager";
import { GuildNotFoundError, NoActiveMusicPlayerError } from "../utils/errors";

export const command: Command = {
  name: 'stop',
  aliases: [],
  description: 'Stops the music and clears the queue.',
  async execute(message: Message, args: string[]) {
    const guildId = message.guild?.id;
    if (!guildId) {
      throw new GuildNotFoundError();
    }

    const player = getMusicPlayer(guildId);
    player.stop();
    await message.reply('Stopping...');
  }
};