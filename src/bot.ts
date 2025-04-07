import { Client, GatewayIntentBits } from 'discord.js';
import { handleCommand, loadCommands } from '@/core/commandHandler';
import environment from '@/config/environment';
import { dirname } from 'path';
import logger from '@/utils/logger';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once('ready', () => {
  logger.info(`Logged in as ${client.user?.tag}`);
  loadCommands();
});

client.on('messageCreate', async (message) => {
  await handleCommand(message, environment.discord.prefix);
});

client.login(environment.discord.token);
