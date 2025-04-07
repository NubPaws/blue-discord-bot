import environment from '@/config/environment';

export class CommandHelpBuilder {
  private lines: string[] = [];

  command(name: string, description: string): this {
    this.lines.push(`**${environment.discord.prefix}${name}** - ${description}`);
    return this;
  }

  option(name: string, description: string): this {
    this.lines.push(`- \`${name}\`: ${description}`);
    return this;
  }

  usage(example: string): this {
    this.lines.push(`\n**usage:**\n\`${example}\``);
    return this;
  }

  section(title: string): this {
    this.lines.push(`\n__${title}__`);
    return this;
  }

  note(text: string): this {
    this.lines.push(`> 💡 ${text}`);
    return this;
  }

  newLine(): this {
    this.lines.push('');
    return this;
  }

  toString(): string {
    return this.lines.join('\n');
  }
}
