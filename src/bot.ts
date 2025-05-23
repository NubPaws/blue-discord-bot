import logger from '@/utils/logger';
import client from '@/client';
import { handleCommand, loadCommands } from '@/cogsLoader';
import environment from '@/config/environment';
import { Events } from 'discord.js';

process.on('unhandledRejection', (reason) =>
  logger.error({ error: reason }, 'Unhandled promise rejection'),
);

process.on('uncaughtException', (error) =>
  logger.fatal({ error }, 'uncaught exception - shutting down'),
);

client.internal.once(Events.ClientReady, () => {
  logger.info({ clientTag: client.selfTag }, `logged in`);
  loadCommands();

  logger.info(`Bot invite link ${client.getInviteLink()}`);
});

client.internal.on(Events.MessageCreate, async (message) => {
  await handleCommand(message, environment.discord.prefix);
});

client.login(environment.discord.token);
