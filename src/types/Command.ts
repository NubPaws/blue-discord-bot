import { CommandResponse } from '@/types/Response';
import { Message } from 'discord.js';

export abstract class Command {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly aliases: string[] = [],
  ) {}

  public abstract execute(message: Message, args: string[]): Promise<CommandResponse>;

  public abstract help(): string;
}
