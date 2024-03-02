const { Events } = require('discord.js');
require('dotenv').config();

// .env values required here
const SUPPORT_ROLE_ID = process.env.SUPPORT_ROLE_ID;
const NO_SUPPORT_MEMBER_ERROR = process.env.NO_SUPPORT_MEMBER_ERROR;

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);
		// Check role of user
		if (!interaction.member.roles.cache.has(SUPPORT_ROLE_ID) && command.data.name != 'close-my-ticket') {
			await interaction.reply(NO_SUPPORT_MEMBER_ERROR);
			return;
		}

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	},
};