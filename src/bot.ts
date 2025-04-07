import logger from '@/utils/logger';
import client from '@/client';
import { handleCommand, loadCommands } from '@/core/commandHandler';
import environment from '@/config/environment';

client.internal.once('ready', () => {
  logger.info(`Logged in as ${client.selfTag()}`);
  loadCommands();

  logger.info(`Bot invite link ${client.getInviteLink()}`);
});

client.internal.on('messageCreate', async (message) => {
  await handleCommand(message, environment.discord.prefix);
});

client.login(environment.discord.token);
