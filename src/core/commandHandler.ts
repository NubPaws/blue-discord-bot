import { Channel, Message } from 'discord.js';
import { Command } from '@/types/Command';
import logger from '@/utils/logger';
import environment from '@/config/environment';
import music from '@/commands/music';
import management from '@/commands/management';
import fun from '@/commands/fun';

const commandsArray: Command[] = [...music, ...management, ...fun];

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

async function sendMessage(channel: Channel, contents: string) {
  if (channel.isSendable()) {
    await channel.send(contents);
  }
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
    const response = await command.execute(message, args);
    if (!response) {
      return;
    }

    if (response.reply) {
      message.reply(response.contents);
    } else {
      sendMessage(message.channel, response.contents);
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error executing command ${command.name}:`, error.message);
      sendMessage(message.channel, `Error: ${error.message}`);
    } else {
      logger.error(`Error executing command ${command.name}:`, error);
    }
  }
}
