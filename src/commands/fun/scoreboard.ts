import scoreboardHandler from '@/core/fun/scoreboardHandler';
import { Command } from '@/types/Command';
import { GuildNotFoundError, InvalidCommandArgumentsError } from '@/utils/errors';
import { Message } from 'discord.js';
import { AlignmentEnum, AsciiTable3 } from 'ascii-table3';
import { ScoreboardDoesNotExistsError } from '@/utils/fun/errors';
import { codeBlock } from '@/utils/formatter';

function getUserIdFromMention(mention: string) {
  const userIdMatch = mention.match(/^<@!?(\d+)>$/);
  if (!userIdMatch) {
    return undefined;
  }

  return userIdMatch[1];
}

function handleCreate(guildId: string, scoreboardName: string) {
  scoreboardHandler.create(guildId, scoreboardName);
}

function handleDelete(guildId: string, scoreboardName: string) {
  scoreboardHandler.delete(guildId, scoreboardName);
}

function handleSet(guildId: string, scoreboardName: string, args: string[]) {
  const mention = args[2];
  const valueArg = args[3];

  if (!mention || !valueArg) {
    throw new InvalidCommandArgumentsError();
  }

  const value = parseInt(valueArg);
  if (isNaN(value)) {
    throw new InvalidCommandArgumentsError();
  }

  const userId = getUserIdFromMention(mention);
  if (!userId) {
    throw new InvalidCommandArgumentsError();
  }

  scoreboardHandler.setScore(guildId, scoreboardName, userId, value);
}

async function handleRemove(guildId: string, scoreboardName: string, args: string[]) {
  const mention = args[2];
  if (!mention) {
    throw new InvalidCommandArgumentsError();
  }

  const userId = getUserIdFromMention(mention);
  if (!userId) {
    throw new InvalidCommandArgumentsError();
  }

  scoreboardHandler.removeScore(guildId, scoreboardName, userId);
}

function handleShow(guildId: string, scoreboardName: string): string {
  const data = scoreboardHandler.get(guildId, scoreboardName);
  if (Object.keys(data).length === 0) {
    throw new ScoreboardDoesNotExistsError();
  }

  const table = new AsciiTable3(scoreboardName)
    .setHeading('User', 'Score')
    .setAlign(2, AlignmentEnum.CENTER)
    .addRowMatrix(Object.entries(data).map(([user, score]) => [user, score]));

  return codeBlock(table.toString());
}

const command: Command = {
  name: 'scoreboard',
  aliases: ['score'],
  description: 'Manages scoreboards (creates, sets, removes).',
  execute: async (message: Message, args: string[]) => {
    const guildId = message.guild?.id;
    if (!guildId) {
      throw new GuildNotFoundError();
    }

    if (args.length === 0) {
      throw new InvalidCommandArgumentsError(
        'Usage !scoreboard <create|set|remove|show> <scoreboard-name> [args]',
      );
    }

    const subCommand = args[0].toLowerCase();
    const scoreboardName = args[1];

    if (!scoreboardName) {
      throw new InvalidCommandArgumentsError('Please provide a scoreboard name.');
    }

    switch (subCommand) {
      case 'create':
        handleCreate(guildId, scoreboardName);
        await message.reply(`Scoreboard ${scoreboardName} created successfully.`);
        break;
      case 'delete':
        handleDelete(guildId, scoreboardName);
        await message.reply(`Scoreboard ${scoreboardName} deleted successfully.`);
        break;
      case 'set':
        handleSet(guildId, scoreboardName, args.slice(2));
        await message.reply(`Scoreboard score set.`);
        break;
      case 'remove':
        handleRemove(guildId, scoreboardName, args.slice(2));
        await message.reply(`Scoreboard score removed.`);
        break;
      case 'show':
        await message.reply(handleShow(guildId, scoreboardName));
        break;
    }
  },
};

export default command;
