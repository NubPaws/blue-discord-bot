import { Client, GatewayIntentBits } from "discord.js";
import logger from "../utils/logger";
import { handleCommand, loadCommands } from "./commandHandler";
import environment from "../config/environment";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once('ready', () => {
  logger.info(`Logged in as ${client.user?.tag}`);
  loadCommands();
});

client.on('messageCreate', async (message) => {
  await handleCommand(message, environment.discord.prefix);
})

client.login(environment.discord.token);
