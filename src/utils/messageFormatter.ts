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

export function unorderedList(text: string[]): string {
  return text.map((line) => `- ${line}`).join('\n');
}

export function orderedList(text: string[]): string {
  return text.map((line, index) => `${index + 1}. ${line}`).join('\n');
}

export function title(text: string): string {
  return `# ${text}`;
}

export function subtitle(text: string): string {
  return `## ${text}`;
}

export function subsubtitle(text: string): string {
  return `### ${text}`;
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
