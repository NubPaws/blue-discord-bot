import { Message } from 'discord.js';
import { Command } from '../types/Command';
import logger from '../utils/logger';

import playCommand from '../commands/play';
import * as stopCommand from '../commands/stop';
import * as skipCommand from '../commands/skip';
import * as disconnectCommand from '../commands/disconnect';
import * as queueCommand from '../commands/queue';
import environment from '../config/environment';

const commandsArray: Command[] = [
  playCommand,
  stopCommand.command,
  skipCommand.command,
  disconnectCommand.command,
  queueCommand.command,
];

const commands = new Map<string, Command>();

/**
 *  Load each command then if the command has aliasses load them as well.
 */
export function loadCommands() {
  const prefix = environment.discord.prefix;
  for (const cmd of commandsArray) {
    commands.set(cmd.name, cmd);

    if (cmd.aliases) {
      for (const alias of cmd.aliases) {
        commands.set(alias, cmd);
      }
    }
  }
  logger.info(`Loaded ${commandsArray.length} commands.`);
}

export async function handleCommand(message: Message, prefix: string) {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  // Split by spaces.
  const args = message.content.slice(prefix.length).trim().split(/\s+/);
  const commandName = args.shift()?.toLowerCase();

  if (!commandName) {
    return;
  }

  const command = commands.get(commandName);
  if (!command) {
    await message.reply(`Unknown command \`${commandName}\`.`);
    return;
  }

  try {
    logger.log('handleCommand', `Executing ${command.name} with arguments ${args}`);
    await command.execute(message, args);
  } catch (error) {
    logger.error(`Error executing command ${command.name}:`, error);
    await message.reply('There was an error executing that command.');
  }
}
