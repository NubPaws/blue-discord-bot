import {
  ChannelDoesNotExistError,
  ChannelIsNotTextBasedError,
} from '@/utils/errors';
import { Client, GatewayIntentBits, OAuth2Scopes } from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

function getInviteLink() {
  const inviteLink = client.generateInvite({
    scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
    permissions: [
      'SendMessages',
      'ManageMessages',
      'ReadMessageHistory',
      'EmbedLinks',
      'AttachFiles',
    ],
  });

  return inviteLink;
}

async function sendMessage(guildId: string, chatId: string, message: string) {
  const guild = await client.guilds.fetch(guildId);
  const channel = await guild.channels.fetch(chatId);

  if (!channel) {
    throw new ChannelDoesNotExistError(guildId, chatId);
  }

  if (!channel.isTextBased()) {
    throw new ChannelIsNotTextBasedError(guildId, chatId);
  }

  await channel.send(message);
}

export default {
  internal: client,

  selfTag: client.user?.tag,
  selfId: client.user?.id,

  userFromId: (id: string) => client.users.fetch(id),
  guildFromId: (id: string) => client.guilds.fetch(id),

  login: (token: string) => client.login(token),

  getInviteLink,

  sendMessage,
};
