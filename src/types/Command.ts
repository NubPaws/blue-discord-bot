import { Response } from '@/types/Response';
import { Message } from 'discord.js';

export interface Command {
  name: string;
  aliases?: string[];
  description: string;
  execute: (message: Message, args: string[]) => Promise<Response | void>;
}
