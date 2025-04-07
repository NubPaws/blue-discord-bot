import logger from '@/utils/logger';
import client from '@/client';
import { handleCommand, loadCommands } from '@/core/commandHandler';
import environment from '@/config/environment';
import { Events } from 'discord.js';

client.internal.once(Events.ClientReady, () => {
  logger.info(`Logged in as ${client.selfTag}`);
  loadCommands();

  logger.info(`Bot invite link ${client.getInviteLink()}`);
});

client.internal.on(Events.MessageCreate, async (message) => {
  await handleCommand(message, environment.discord.prefix);
});

client.login(environment.discord.token);
