const { SlashCommandBuilder } = require('discord.js');
const utilities = require('../../utils/functions.js');

const NO_SUPPORT_MEMBER_ERROR = process.env.NO_SUPPORT_MEMBER_ERROR;
const ERROR_NOT_IN_SUPPORT_CHANNEL_MSG = process.env.ERROR_NOT_IN_SUPPORT_CHANNEL_MSG;
const TICKET_LAST_MSG_WHEN_CLOSED = process.env.TICKET_LAST_MSG_WHEN_CLOSED;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close-my-ticket')
        .setDescription('close your own ticket'),
    async execute(interaction) {
        const client = interaction.client;
        const channel = await client.channels.fetch(interaction.channelId);

        // If this command is not used in a ticket
        if (!utilities.isATicket(channel)) {
            await interaction.reply(ERROR_NOT_IN_SUPPORT_CHANNEL_MSG);
            return;
        }
        if (channel.ownerId == interaction.user.id) {
            await interaction.reply('.');
            await channel.send(TICKET_LAST_MSG_WHEN_CLOSED);
        }
        else {
            await interaction.reply(NO_SUPPORT_MEMBER_ERROR);
        }

    },
};