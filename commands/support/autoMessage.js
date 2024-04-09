const { SlashCommandBuilder } = require('discord.js');


const AUTO_RELAUNCH_USER = process.env.AUTO_RELAUNCH_USER;
const AUTO_RULES = process.env.AUTO_RULES;
const TICKET_LAST_MSG_WHEN_CLOSED = process.env.TICKET_LAST_MSG_WHEN_CLOSED;


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
                    { name: 'Custom', value: 'custom' },
                ))
        .addStringOption(option =>
            option.setName('custom')
                .setDescription('Enter your personalised message (if custom is chosen).')
                .setRequired(false)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const choice = interaction.options.getString('message');
        let messageToSend = "";

        switch (choice) {
            case 'relaunch':
                messageToSend = AUTO_RELAUNCH_USER;
                break;
            case 'rules':
                messageToSend = AUTO_RULES;
                break;
            default:
                messageToSend = interaction.options.getString('custom') || "";
        }

        const channel = await interaction.client.channels.fetch(interaction.channelId);
        await channel.send(messageToSend);
        await interaction.editReply({ content: 'Message send.', ephemeral: true });

        if(messageToSend == AUTO_RULES) {
            await channel.send(TICKET_LAST_MSG_WHEN_CLOSED);
        }


    },
};