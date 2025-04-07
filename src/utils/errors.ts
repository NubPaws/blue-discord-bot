export class GuildNotFoundError extends Error {}

export class NoActiveMusicPlayerError extends Error {}

export class InvalidCommandArgumentsError extends Error {}

export class ChannelDoesNotExistError extends Error {
  constructor(guildId: string, channelId: string) {
    super(`Channel ${channelId} in guild ${guildId} does not exist.`);
  }
}

export class ChannelIsNotTextBasedError extends Error {
  constructor(guildId: string, channelId: string) {
    super(`Channel ${channelId} in guild ${guildId} is not a text based channel.`);
  }
}
