const { Events } = require('discord.js');
const utilities = require('../utils/functions.js');


const NEW_TICKET_TAG = process.env.NEW_TICKET_TAG;
const WORKING_TICKET_TAG = process.env.WORKING_TICKET_TAG;
const DESABLE_TICKET_FOR_SUPPORT_MEMBER = process.env.DESABLE_TICKET_FOR_SUPPORT_MEMBER;
const TICKET_LAST_MSG_WHEN_CLOSED = process.env.TICKET_LAST_MSG_WHEN_CLOSED;
const CLIENT_ID = process.env.CLIENT_ID;
const TICKET_WORD_CLOSED_WHEN_BOT_ASK = process.env.TICKET_WORD_CLOSED_WHEN_BOT_ASK;
const TICKET_CLOSE_ASK = process.env.TICKET_CLOSE_ASK;

async function changeTagIfSupportWrite(thread, newMessageAuthor) {
    // If NewMessage Author is a support member
    if (await utilities.checkIfUserIDIsSupportMember(thread, newMessageAuthor.id) && thread.ownerId != newMessageAuthor.id) {
        // get Tags IDs
        const newTicketTagID = await utilities.getTagIdFromName(thread, NEW_TICKET_TAG);
        const workingTicketTagID = await utilities.getTagIdFromName(thread, WORKING_TICKET_TAG);
        // Get current tags applied to the ticket
        const currentTags = thread.appliedTags;
        // If "newTicket" Tag is applied
        const index = currentTags.indexOf(newTicketTagID);
        if (index !== -1) {
            // Replace "newTicket" by "workingTicket"
            currentTags.splice(index, 1, workingTicketTagID);
            await thread.setAppliedTags(currentTags);
        }
    }
}


module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        // Bot Message (no loop)
        // if (message.author.bot) return;

        // Get the channel
        const channel = await client.channels.fetch(message.channelId);

        // If this new message is in a ticket
        if (utilities.isATicket(channel)) {
            // console.log(channel);
            // For cache issue
            await channel.guild.members.fetch(channel.ownerId);

            // Cancel if the post was made by a support member (and if this option is enable)
            if (DESABLE_TICKET_FOR_SUPPORT_MEMBER == 'true' || DESABLE_TICKET_FOR_SUPPORT_MEMBER == 'TRUE') {
                if (await utilities.checkIfOwnerIsSupportMember(channel)) {
                    return;
                }

            }

            // If it's a ticket close signal
            if (message.author.bot && message.author.id == CLIENT_ID && message.content == TICKET_LAST_MSG_WHEN_CLOSED) {
                await utilities.closeTicket(channel);
                return;
            }

            // Check if we need to change tag to WORKING TAG
            if (NEW_TICKET_TAG != 'null' && WORKING_TICKET_TAG != 'null' && NEW_TICKET_TAG != '' && WORKING_TICKET_TAG != '') {
                changeTagIfSupportWrite(channel, message.author);
            }


            // Check if this new message is a "yes" and it was send by the ticket author
            if (message.content == TICKET_WORD_CLOSED_WHEN_BOT_ASK && message.author.id == channel.ownerId) {
                // if the previous message ask for closure (by bot)
                channel.messages.fetch({ limit: 2 }).then(async res => {
                    const lastMessage = res.last();
                    // If this previous message ask for closure AND was send by the bot
                    if (lastMessage.content == TICKET_CLOSE_ASK && lastMessage.author.id == CLIENT_ID) {
                        // Close the ticket
                        await channel.send(TICKET_LAST_MSG_WHEN_CLOSED);
                    }
                });
            }
        }


    },
};
