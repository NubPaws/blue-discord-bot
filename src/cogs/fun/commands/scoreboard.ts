import scoreboardHandler from '@/cogs/fun/scoreboardHandler';
import { Command } from '@/types/Command';
import { GuildNotFoundError, InvalidCommandArgumentsError } from '@/errors';
import { Message, PermissionsBitField } from 'discord.js';
import { AlignmentEnum, AsciiTable3 } from 'ascii-table3';
import { ScoreboardDoesNotExistsError } from '@/cogs/fun/errors';
import { codeBlock } from '@/utils/messageFormatter';
import { CommandHelpBuilder } from '@/utils/commandHelpBuilder';
import { CommandResponse } from '@/types/Response';

export class ScoreboardCommand extends Command {
  constructor() {
    super('scoreboard', 'Manages scoreboards (creates, sets, removes).', [
      'score',
    ]);
  }

  public async execute(
    message: Message,
    args: string[],
  ): Promise<CommandResponse> {
    const guildId = message.guild?.id;
    if (!guildId) {
      throw new GuildNotFoundError();
    }

    if (args.length === 0) {
      throw new InvalidCommandArgumentsError();
    }

    const subCommand = args[0];
    const scoreboardName = args[1];

    if (!subCommand || !scoreboardName) {
      throw new InvalidCommandArgumentsError();
    }

    switch (subCommand) {
      case 'create':
        this.handleCreate(guildId, scoreboardName);
        return CommandResponse.message(
          `Scoreboard ${scoreboardName} created successfully.`,
        );
      case 'delete':
        if (
          message.member?.permissions.has(
            PermissionsBitField.Flags.Administrator,
          )
        ) {
          this.handleDelete(guildId, scoreboardName);
          return CommandResponse.message(
            `Scoreboard ${scoreboardName} deleted successfully.`,
          );
        }
        return CommandResponse.message('Only admins can delete scoreboards.');
      case 'set': {
        this.handleSet(guildId, scoreboardName, args.slice(2));
        return CommandResponse.react('👍');
      }
      case 'remove': {
        this.handleRemove(guildId, scoreboardName, args.slice(2));
        return CommandResponse.react('👍');
      }
      case 'show':
        return CommandResponse.message(
          this.handleShow(guildId, scoreboardName),
        );
    }

    throw new InvalidCommandArgumentsError();
  }

  private handleCreate(guildId: string, scoreboardName: string) {
    scoreboardHandler.create(guildId, scoreboardName);
  }

  private handleDelete(guildId: string, scoreboardName: string) {
    scoreboardHandler.delete(guildId, scoreboardName);
  }

  private handleSet(guildId: string, scoreboardName: string, args: string[]) {
    const user = args[0];
    const value = parseInt(args[1]);
    if (!user || isNaN(value)) {
      throw new InvalidCommandArgumentsError();
    }
    scoreboardHandler.setScore(guildId, scoreboardName, user, value);
  }

  private handleRemove(
    guildId: string,
    scoreboardName: string,
    args: string[],
  ) {
    const user = args[0];
    if (!user) {
      throw new InvalidCommandArgumentsError();
    }
    scoreboardHandler.removeScore(guildId, scoreboardName, user);
  }

  private handleShow(guildId: string, scoreboardName: string): string {
    const data = scoreboardHandler.get(guildId, scoreboardName);
    if (Object.keys(data).length === 0) {
      throw new ScoreboardDoesNotExistsError();
    }

    const table = new AsciiTable3(scoreboardName)
      .setHeading('', 'User', 'Score')
      .setAlign(2, AlignmentEnum.CENTER)
      .addRowMatrix(
        Object.entries(data).map(([user, score], index) => [
          index,
          user,
          score,
        ]),
      );

    return codeBlock(table.toString());
  }

  public help(): string {
    return new CommandHelpBuilder()
      .command(this.name, this.description)
      .usage(
        `${this.name} <create|delete|set|remove|show> <scoreboard> [user] [value]`,
      )
      .section('Options')
      .option('create <scoreboard>', 'Creates a new scoreboard.')
      .option(
        'delete <scoreboard>',
        'Deletes an entire scoreboard (this action cannot be reverted).',
      )
      .option(
        'set <scoreboard> [user] <value>',
        'Sets the score of `user` to `value`.',
      )
      .option(
        'remove <scoreboard> [user]',
        'Removes the `user` entry from the scoreboard.',
      )
      .option(
        'show <scoreboard>',
        'Displays the scoreboard in a fancy fancy way',
      )
      .toString();
  }
}
