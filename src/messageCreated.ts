import { Message, ThreadChannel } from 'discord.js';
import { settingsGet } from './settings.js';
import logger from './util/logger.js';
import analyze from 'summary-bot';

function makeLen(message: string) {
	return message.length > 100 ? message.slice(0, 100) : message;
}

export async function messageCreated(message: Message) {
	if (
		!message.guild ||
		message.channel.type === 'DM' ||
		message.channel instanceof ThreadChannel ||
		message.author.bot
	)
		return;

	const serverSettings = await settingsGet(message.guild.id);

	const channelAllowed = serverSettings.enabledChannels[message.channel.id];
	if (!channelAllowed) return;

	logger.debug('Creating thread for message');
	await message.channel.threads.create({
		name: makeLen(analyze(message.content, 1).text || channelAllowed),
		autoArchiveDuration: 60,
	});
}
