import { Client, Intents } from 'discord.js';
import { registerCommands, registerInteraction } from './commandProcessor.js';
import { messageCreated } from './messageCreated.js';
import { settingsInitialize } from './settings.js';
import logger from './util/logger.js';
import { config } from 'dotenv';
config();

async function main() {
	const client = new Client({
		intents: [Intents.FLAGS.GUILD_MESSAGES],
	});

	await settingsInitialize();

	client.on('messageCreate', messageCreated);
	client.on('ready', async () => {
		logger.info('Bot started');

		await registerInteraction(client);
		await registerCommands(client);
	});

	await client.login(process.env.DISCORD_TOKEN);
}

main();
