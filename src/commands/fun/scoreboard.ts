import scoreboardHandler from '@/core/fun/scoreboardHandler';
import { Command } from '@/types/Command';
import { GuildNotFoundError, InvalidCommandArgumentsError } from '@/utils/errors';
import { Message, PermissionsBitField } from 'discord.js';
import { AlignmentEnum, AsciiTable3 } from 'ascii-table3';
import { ScoreboardDoesNotExistsError } from '@/utils/fun/errors';
import { codeBlock } from '@/utils/messageFormatter';
import { CommandHelpBuilder } from '@/utils/commandHelpBuilder';
import { CommandResponse } from '@/types/Response';

function handleCreate(guildId: string, scoreboardName: string) {
  scoreboardHandler.create(guildId, scoreboardName);
}

function handleDelete(guildId: string, scoreboardName: string) {
  scoreboardHandler.delete(guildId, scoreboardName);
}

function handleSet(guildId: string, scoreboardName: string, args: string[]) {
  const user = args[2];
  const value = parseInt(args[3]);
  if (!user || isNaN(value)) {
    throw new InvalidCommandArgumentsError();
  }
  scoreboardHandler.setScore(guildId, scoreboardName, user, value);
}

function handleRemove(guildId: string, scoreboardName: string, args: string[]) {
  const user = args[2];
  if (!user) {
    throw new InvalidCommandArgumentsError();
  }
  scoreboardHandler.removeScore(guildId, scoreboardName, user);
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

export class ScoreboardCommand extends Command {
  constructor() {
    super('scoreboard', 'Manages scoreboards (creates, sets, removes).', ['score']);
  }

  public async execute(message: Message, args: string[]): Promise<CommandResponse> {
    const guildId = message.guild?.id;
    if (!guildId) {
      throw new GuildNotFoundError();
    }

    if (args.length === 0) {
      throw new InvalidCommandArgumentsError(
        'Usage !scoreboard <create|set|remove|show> <scoreboard-name> [args]',
      );
    }

    const subCommand = args[0];
    const scoreboardName = args[1];

    if (!subCommand || !scoreboardName) {
      throw new InvalidCommandArgumentsError('Please provide an action and a scoreboard name.');
    }

    switch (subCommand) {
      case 'create':
        handleCreate(guildId, scoreboardName);
        return CommandResponse.message(`Scoreboard ${scoreboardName} created successfully.`);
      case 'delete':
        if (message.member?.permissions.has(PermissionsBitField.Flags.Administrator)) {
          handleDelete(guildId, scoreboardName);
          return CommandResponse.message(`Scoreboard ${scoreboardName} deleted successfully.`);
        }
        return CommandResponse.message(`Only admins can delete scoreboards.`);
      case 'set': {
        handleSet(guildId, scoreboardName, args.slice(2));
        return CommandResponse.react('👍');
      }
      case 'remove': {
        handleRemove(guildId, scoreboardName, args.slice(2));
        return CommandResponse.react(`👍`);
      }
      case 'show':
        return CommandResponse.message(handleShow(guildId, scoreboardName));
    }

    return CommandResponse.message('Wrong usage of the command, read the help page.');
  }

  public help(): string {
    return new CommandHelpBuilder()
      .command(this.name, this.description)
      .usage(`${this.name} <create|delete|set|remove|show> <scoreboard> [user] [value]`)
      .section('Options')
      .option('create <scoreboard>', 'Creates a new scoreboard.')
      .option(
        'delete <scoreboard>',
        'Deletes an entire scoreboard (this action cannot be reverted).',
      )
      .option('set <scoreboard> [user] <value>', 'Sets the score of `user` to `value`.')
      .option('remove <scoreboard> [user]', 'Removes the `user` entry from the scoreboard.')
      .option('show <scoreboard>', 'Displays the scoreboard in a fancy fancy way')
      .toString();
  }
}
