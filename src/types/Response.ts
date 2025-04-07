// CommandResponse.ts

export type CommandResponseType = 'message' | 'reply' | 'react' | 'none';

export class CommandResponse {
  readonly type: CommandResponseType;
  readonly content: string;

  private constructor(type: CommandResponseType, content: string) {
    this.type = type;
    this.content = content;
  }

  static message(content: string): CommandResponse {
    return new CommandResponse('message', content);
  }

  static reply(content: string): CommandResponse {
    return new CommandResponse('reply', content);
  }

  static react(emoji: string): CommandResponse {
    return new CommandResponse('react', emoji);
  }

  static none(): CommandResponse {
    return new CommandResponse('none', '');
  }
}
