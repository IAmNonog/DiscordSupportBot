const { SlashCommandBuilder } = require('discord.js');
const utilities = require('../../utils/functions.js');

const TICKET_DUPLICATE_MSG = process.env.TICKET_DUPLICATE_MSG;
const ERROR_NOT_IN_SUPPORT_CHANNEL_MSG = process.env.ERROR_NOT_IN_SUPPORT_CHANNEL_MSG;
const TICKET_LAST_MSG_WHEN_CLOSED = process.env.TICKET_LAST_MSG_WHEN_CLOSED;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('duplicate')
        .setDescription('close a ticket because it is duplicated (another ticket dealing with this problem already exists)')
        .addStringOption(option =>
            option
                .setName('initial-ticket')
                .setDescription('Link or ticket ID of the first ticket dealing with this problem')
                .setRequired(true)),
    async execute(interaction) {
        const client = interaction.client;
        const channel = await client.channels.fetch(interaction.channelId);

        // If this new command is not used in a ticket
        if (!utilities.isATicket(channel)) {
            await interaction.reply(ERROR_NOT_IN_SUPPORT_CHANNEL_MSG);
            return;
        }

        // Get option
        const ticket = interaction.options.getString('initial-ticket');
        const linkTicket = utilities.parseOptionTicket(ticket, channel.parentId);
        await interaction.reply(TICKET_DUPLICATE_MSG);
        await channel.send('- <@' + channel.ownerId + '> -> ' + linkTicket);
        await channel.send(TICKET_LAST_MSG_WHEN_CLOSED);

    },
};