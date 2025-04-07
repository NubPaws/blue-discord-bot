// formatter.ts

// Text Formatting Functions
export function bold(text: string): string {
  return `**${text}**`;
}

export function italic(text: string): string {
  return `*${text}*`;
}

export function underline(text: string): string {
  return `__${text}__`;
}

export function strikethrough(text: string): string {
  return `~~${text}~~`;
}

export function spoiler(text: string): string {
  return `||${text}||`;
}

export function inlineCode(text: string): string {
  return `\`${text}\``;
}

export function codeBlock(text: string, language = ''): string {
  return `\`\`\`${language}\n${text}\n\`\`\``;
}

export function blockQuote(text: string): string {
  return `> ${text}`;
}

export function multilineQuote(text: string): string {
  return text
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n');
}

// Mention Functions
export function mentionUser(userId: string): string {
  return `<@${userId}>`;
}

export function mentionRole(roleId: string): string {
  return `<@&${roleId}>`;
}

export function mentionChannel(channelId: string): string {
  return `<#${channelId}>`;
}

// Example: Combos
export function emphasizedQuote(text: string): string {
  return blockQuote(bold(text));
}
