import { ApplicationCommandData, Client, CommandInteraction } from 'discord.js';
import { settingsGet, settingsSet } from './settings.js';
import logger from './util/logger.js';

const skipCommands = process.env.SKIP_COMMANDS === 'TRUE';
const allowedUsers = process.env.ALLOWED_USERS?.split(',');

async function onInteraction(interaction: CommandInteraction) {
	const inGuild = interaction.inGuild();

	if (!inGuild || !interaction.member)
		return interaction.reply(
			`This command is only available to ${
				!inGuild ? 'servers' : 'certain users'
			}.`
		);

	const guild = interaction.guild;
	if (!guild)
		return interaction.reply(
			"I can't find your guild for some reason. Probably because it isnt cached. Try sending a message and trying again!"
		);

	if (allowedUsers && !allowedUsers.includes(interaction.user.id)) {
		return interaction.reply('You are not allowed to use this command.');
	}

	switch (interaction.commandName) {
		case 'autothread': {
			const channel = interaction.options.getChannel('channel', true);
			const threadName = interaction.options.getString('name', true);
			const guildSettings = await settingsGet(guild.id);

			const newAutoThreadMap = { ...guildSettings.enabledChannels };

			let confirmationMessage =
				'Auto threading has been enabled for this channel.';

			if (newAutoThreadMap[channel.id] !== undefined) {
				confirmationMessage =
					'Auto threading has been modified for this channel.';
			}

			newAutoThreadMap[channel.id] = threadName;

			await settingsSet(guild.id, { enabledChannels: newAutoThreadMap });
			return interaction.reply(confirmationMessage);
		}

		case 'disableautothread': {
			const channel = interaction.options.getChannel('channel', true);
			const guildSettings = await settingsGet(guild.id);

			const newAutoThreadMap = { ...guildSettings.enabledChannels };

			if (newAutoThreadMap[channel.id] === undefined) {
				return interaction.reply(
					'Auto threading is already disabled for this channel.'
				);
			}

			delete newAutoThreadMap[channel.id];

			await settingsSet(guild.id, { enabledChannels: newAutoThreadMap });
			return interaction.reply(
				'Auto threading has been disabled for this channel.'
			);
		}
	}
}

export async function registerCommands(client: Client) {
	if (skipCommands) return;

	const enableCommand: ApplicationCommandData = {
		name: 'autothread',
		description: 'Sets up autothread',
		options: [
			{
				name: 'channel',
				description: 'The channel to enable autothread for',
				type: 'CHANNEL',
				required: true,
			},
			{
				name: 'name',
				description:
					'The name of the thread to be created when someone chats',
				type: 'STRING',
				required: true,
			},
		],
	};

	const disableCommand: ApplicationCommandData = {
		name: 'disableautothread',
		description: 'Disables autothread',
		options: [
			{
				name: 'channel',
				description: 'The channel to disable autothread for',
				type: 'CHANNEL',
				required: true,
			},
		],
	};

	if (!client.application)
		throw new Error('Client application was undefined!');

	const enableCommandResponse = await client.application.commands.create(
		enableCommand
	);
	const disableCommandResponse = await client.application.commands.create(
		disableCommand
	);

	logger.debug(enableCommandResponse);
	logger.debug(disableCommandResponse);

	logger.info('Commands registered');
}

export async function registerInteraction(client: Client) {
	client.on('interactionCreate', (interaction) => {
		if (!interaction.isCommand()) return;
		onInteraction(interaction);
	});

	logger.info('Interaction registered');
}
