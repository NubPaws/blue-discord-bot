import scoreboardHandler from '@/core/fun/scoreboardHandler';
import { Command } from '@/types/Command';
import { GuildNotFoundError, InvalidCommandArgumentsError } from '@/utils/errors';
import { Message } from 'discord.js';
import { AlignmentEnum, AsciiTable3 } from 'ascii-table3';
import { ScoreboardDoesNotExistsError } from '@/utils/fun/errors';
import { codeBlock, mentionUser } from '@/utils/formatter';
import client from '@/client';

function handleCreate(guildId: string, scoreboardName: string) {
  scoreboardHandler.create(guildId, scoreboardName);
}

function handleDelete(guildId: string, scoreboardName: string) {
  scoreboardHandler.delete(guildId, scoreboardName);
}

function handleSet(guildId: string, scoreboardName: string, userId: string, value: number) {
  scoreboardHandler.setScore(guildId, scoreboardName, userId, value);
}

function handleRemove(guildId: string, scoreboardName: string, userId: string) {
  scoreboardHandler.removeScore(guildId, scoreboardName, userId);
}

async function handleShow(guildId: string, scoreboardName: string): Promise<string> {
  const data = scoreboardHandler.get(guildId, scoreboardName);
  if (Object.keys(data).length === 0) {
    throw new ScoreboardDoesNotExistsError();
  }

  const toDisplay = new Array<Array<string | number>>();
  await Promise.all(
    Object.entries(data).map(async ([user, score]) =>
      toDisplay.push([(await client.userFromId(user)).username, score]),
    ),
  );

  const table = new AsciiTable3(scoreboardName)
    .setHeading('User', 'Score')
    .setAlign(2, AlignmentEnum.CENTER)
    .addRowMatrix(toDisplay);

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
      case 'set': {
        const user = message.mentions.users.first();
        const value = parseInt(args[3]);
        if (!user || isNaN(value)) {
          throw new InvalidCommandArgumentsError();
        }
        handleSet(guildId, scoreboardName, user.id, value);
        await message.reply(`Scoreboard score set for ${user.tag}.`);
        break;
      }
      case 'remove': {
        const user = message.mentions.users.first();
        if (!user) {
          throw new InvalidCommandArgumentsError();
        }
        handleRemove(guildId, scoreboardName, user.id);
        await message.reply(`Scoreboard score removed for ${user.tag}.`);
        break;
      }
      case 'show':
        await message.reply(await handleShow(guildId, scoreboardName));
        break;
    }
  },
};

export default command;
