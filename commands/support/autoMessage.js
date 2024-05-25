const { SlashCommandBuilder } = require('discord.js');
const utilities = require('../../utils/functions.js');


const AUTO_RELAUNCH_USER = process.env.AUTO_RELAUNCH_USER;
const AUTO_RULES = process.env.AUTO_RULES;
const AUTO_KEEP_OPEN = process.env.AUTO_KEEP_OPEN;

const TICKET_LAST_MSG_WHEN_CLOSED = process.env.TICKET_LAST_MSG_WHEN_CLOSED;
const ERROR_NOT_IN_SUPPORT_CHANNEL_MSG = process.env.ERROR_NOT_IN_SUPPORT_CHANNEL_MSG;



module.exports = {
    data: new SlashCommandBuilder()
        .setName('auto-message')
        .setDescription('Send an automatic message')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Choose a predefined message or enter your own (custom)')
                .setRequired(true)
                .addChoices(
                    { name: 'Relaunch', value: 'relaunch' },
                    { name: 'Rules', value: 'rules' },
                    { name: 'Keep-open', value: 'keep-open'},
                    { name: 'Custom', value: 'custom' },
                ))
        .addStringOption(option =>
            option.setName('custom')
                .setDescription('Enter your personalised message (if custom is chosen).')
                .setRequired(false)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const channel = await interaction.client.channels.fetch(interaction.channelId);

        // If this command is not used in a ticket
        if (!utilities.isATicket(channel)) {
            await interaction.editReply({ content: ERROR_NOT_IN_SUPPORT_CHANNEL_MSG, ephemeral: true });
            return;
        }

        const choice = interaction.options.getString('message');
        let messageToSend = "";

        switch (choice) {
            case 'relaunch':
                messageToSend = '<@' + channel.ownerId + '>\n' + AUTO_RELAUNCH_USER;
                break;
            case 'rules':
                messageToSend = AUTO_RULES;
                break;
            case 'keep-open':
                messageToSend = AUTO_KEEP_OPEN;
                break;
            default:
                messageToSend = interaction.options.getString('custom') || "";
        }

        await channel.send(messageToSend);
        await interaction.editReply({ content: 'Message send.', ephemeral: true });

        if(messageToSend == AUTO_RULES) {
            await channel.send(TICKET_LAST_MSG_WHEN_CLOSED);
        }


    },
};