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

export default {
  get: () => client,
  selfTag: () => client.user?.tag,

  userFromId: (id: string) => client.users.fetch(id),
  guildFromId: (id: string) => client.guilds.fetch(id),

  on: client.on,
  once: client.once,
  login: (token: string) => client.login(token),

  getInviteLink,
};
