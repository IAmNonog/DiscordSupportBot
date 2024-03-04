const { SlashCommandBuilder } = require('discord.js');
const utilities = require('../../utils/functions.js');

const TICKET_CLOSE_ASK = process.env.TICKET_CLOSE_ASK;
const TICKET_CLOSE_FORCE = process.env.TICKET_CLOSE_FORCE;
const ERROR_NOT_IN_SUPPORT_CHANNEL_MSG = process.env.ERROR_NOT_IN_SUPPORT_CHANNEL_MSG;
const TICKET_LAST_MSG_WHEN_CLOSED = process.env.TICKET_LAST_MSG_WHEN_CLOSED;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('close a ticket')
        .addBooleanOption(option =>
            option
                .setName('force')
                .setDescription('If true : does not require user confirmation')
                .setRequired(true)),
    async execute(interaction) {
        const client = interaction.client;
        const channel = await client.channels.fetch(interaction.channelId);

        // If this command is not used in a ticket
        if (!utilities.isATicket(channel)) {
            await interaction.reply(ERROR_NOT_IN_SUPPORT_CHANNEL_MSG);
            return;
        }

        // Get option
        const force = interaction.options.getBoolean('force');
        if (!force) {
            await channel.send('<@' + channel.onwerId + '>');
            await interaction.reply(TICKET_CLOSE_ASK);
        }
        else {
            await interaction.reply(TICKET_CLOSE_FORCE);
            await channel.send(TICKET_LAST_MSG_WHEN_CLOSED);
            // await utilities.closeTicket(channel);
        }
    },
};