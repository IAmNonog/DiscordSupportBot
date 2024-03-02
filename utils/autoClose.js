const utilities = require('./functions.js');

const SUPPORT_CHANNEL_FORUM_ID = process.env.SUPPORT_CHANNEL_FORUM_ID;
const TICKET_AUTO_CLOSED_MSG = process.env.TICKET_AUTO_CLOSED_MSG;
const TIME_BEFORE_CLOSE_IN_HOURS = process.env.TIME_BEFORE_CLOSE_IN_HOURS;
const TICKET_LAST_MSG_WHEN_CLOSED = process.env.TICKET_LAST_MSG_WHEN_CLOSED;
const TICKET_CLOSE_ASK = process.env.TICKET_CLOSE_ASK;
const TICKET_PREFIX = process.env.TICKET_PREFIX;

async function autoCloseMain(client) {
    try {
        // Get the support forum with his ID
        const forumChannel = await client.channels.fetch(SUPPORT_CHANNEL_FORUM_ID);
        if (!forumChannel) {
            console.log('Channel not found');
            return;
        }

        // Verify the type
        if (forumChannel.type !== 15) {
            console.log('The channel is not a forum');
            return;
        }

        // Get All Active threads
        const threads = await forumChannel.threads.fetchActive();
        if (threads.threads.size === 0) {
            // Not active thread
            return;
        }

        // For each ticket
        for (const thread of threads.threads.values()) {
            // checks whether the thread's last message is older than X hours
            const lastMessage = await thread.messages.fetch(thread.lastMessageId);
            const XHoursAgo = Date.now() - TIME_BEFORE_CLOSE_IN_HOURS * 60 * 60 * 1000;

            if (lastMessage.createdTimestamp < XHoursAgo && thread.name.includes('[' + TICKET_PREFIX)) {
                // Log last message if older than X hours (and it's a ticket with an ID)
                const isSupportMessage = await utilities.checkIfUserIDIsSupportMember(thread, lastMessage.author.id);
                // If the last message is a message from support OR bot ask to close the ticket
                if (lastMessage.content == TICKET_CLOSE_ASK || isSupportMessage) {
                    // Close the ticket
                    thread.send(TICKET_AUTO_CLOSED_MSG);
                    thread.send(TICKET_LAST_MSG_WHEN_CLOSED);
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = { autoCloseMain };