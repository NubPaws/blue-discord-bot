import { Channel, Message } from 'discord.js';
import { Command } from '@/types/Command';
import logger from '@/utils/logger';
import music from '@/cogs/music';
import management from '@/cogs/management';
import fun from '@/cogs/fun';
import { CommandResponse } from '@/types/Response';
import { subtitle } from '@/utils/messageFormatter';

const commandsArray: Command[] = [...music, ...management, ...fun];

const commands = new Map<string, Command>();

export function loadCommands() {
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
  if (!contents) {
    return;
  }
  if (channel.isSendable()) {
    await channel.send(contents);
  }
}

function handleResponse(response: CommandResponse, message: Message) {
  switch (response.type) {
    case 'message':
      sendMessage(message.channel, response.content);
      break;
    case 'reply':
      message.reply(response.content);
      break;
    case 'react':
      message.react(response.content);
      break;
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

  if (commandName === 'help') {
    sendMessage(
      message.channel,
      commandsArray
        .map((cmd) => subtitle(cmd.name) + '\n' + cmd.help())
        .join('\n\n'),
    );
    return;
  }

  const command = commands.get(commandName);
  if (!command) {
    // await message.reply(`Unknown command \`${commandName}\`.`);
    return;
  }

  try {
    const response = await command.execute(message, args);

    handleResponse(response, message);
  } catch (error: any) {
    if (error) {
      logger.error(`Error executing command ${command.name}:`, error.message);

      sendMessage(message.channel, `Error: ${error}`);
    }
  }
}
