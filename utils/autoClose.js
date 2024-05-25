const utilities = require('./functions.js');

const SUPPORT_CHANNEL_FORUM_ID = process.env.SUPPORT_CHANNEL_FORUM_ID;
const TICKET_AUTO_CLOSED_MSG = process.env.TICKET_AUTO_CLOSED_MSG;
const TIME_BEFORE_CLOSE_IN_HOURS = process.env.TIME_BEFORE_CLOSE_IN_HOURS;
const TICKET_LAST_MSG_WHEN_CLOSED = process.env.TICKET_LAST_MSG_WHEN_CLOSED;
const TICKET_CLOSE_ASK = process.env.TICKET_CLOSE_ASK;
const TICKET_PREFIX = process.env.TICKET_PREFIX;
const AUTO_RELAUNCH_USER = process.env.AUTO_RELAUNCH_USER;
const KEEP_TICKET_OPEN_MSG = process.env.KEEP_TICKET_OPEN_MSG;


const fs = require('fs');
const path = require('path');

function logAction(message, start = false) {
    const logFilePath = path.join(__dirname + '../../logs/', 'auto-close-log.txt');
    let logMessage;
    if(start) {
        logMessage = `\n\n\n${new Date().toISOString()} - ${message}\n`;
    }
    else {
        logMessage = `${new Date().toISOString()} - ${message}\n`;
    }
    
    fs.appendFileSync(logFilePath, logMessage, 'utf8');
}


async function isTicketNeedClosed(ticket, lastMessage) {
    const lastMessageText = lastMessage.content.trim();
    
    if (lastMessageText.includes(TICKET_CLOSE_ASK.trim())) {
        logAction("[NEED CLOSE] - lastMSG include TICKET_CLOSE_ASK");
        return true;
    }
    if(lastMessageText.includes(AUTO_RELAUNCH_USER.trim())) {
        logAction("[NEED CLOSE] - lastMSG include AUTO_RELAUNCH_USER");
        return true;
    }
    const isSupportMessage = await utilities.checkIfUserIDIsSupportMember(ticket, lastMessage.author.id);
    if (isSupportMessage && (!lastMessageText.includes(KEEP_TICKET_OPEN_MSG.trim())) && (lastMessage.author.id != ticket.ownerId)) {
        logAction("[NEED CLOSE] - lastMSG is sent by Support AND doesn't include KEEP_TICKET_OPEN_MSG AND not send by owner");
        return true;
    }

    logAction("[DON'T NEED CLOSE]");
    
    return false;
}

async function autoCloseMain(client) {
    try {
        logAction("[AUTO-SCAN] - Start", true);
        console.log("Start AUTO-CLOSE scan");
        // Get the support forum with his ID
        const forumChannel = await client.channels.fetch(SUPPORT_CHANNEL_FORUM_ID);
        if (!forumChannel) {
            logAction('Channel not found');
            return;
        }

        // Verify the type
        if (forumChannel.type !== 15) {
            logAction('The channel is not a forum');
            return;
        }

        // Get All Active threads
        const threads = await forumChannel.threads.fetchActive();
        if (threads.threads.size === 0) {
            logAction('No active thread');
            // Not active thread
            return;
        }

        // For each ticket
        for (const thread of threads.threads.values()) {
            logAction("------------------------------------");
            logAction("[NEW TICKET] - Scan Ticket : " + thread.name);
            // checks whether the thread's last message is older than X hours
            const messages = await thread.messages.fetch({ limit: 1 });
            const lastMessage = messages.first();
            logAction("[LAST MESSAGE] - ====\n" + lastMessage.content + "====");
            // const lastMessage = await thread.messages.fetch(thread.lastMessageId);
            const XHoursAgo = Date.now() - TIME_BEFORE_CLOSE_IN_HOURS * 60 * 60 * 1000;

            if (lastMessage.createdTimestamp < XHoursAgo && thread.name.includes('[' + TICKET_PREFIX)) {
                logAction("Old Message (last message is older than XHoursAgo) : ");
                logAction("\tLastMessageTime = " + lastMessage.createdTimestamp);
                logAction("\tXHoursAgo = " + XHoursAgo);

                // If the last message is a message from support OR bot ask to close the ticket
                if (await isTicketNeedClosed(thread, lastMessage)) {
                    logAction("CLOSED");

                    // Close the ticket
                    thread.send(TICKET_AUTO_CLOSED_MSG);
                    thread.send(TICKET_LAST_MSG_WHEN_CLOSED);
                }
            }
            else {
                logAction("LastMessage not old");
                logAction("\tLastMessageTime = " + lastMessage.createdTimestamp);
                logAction("\tXHoursAgo = " + XHoursAgo);
            }
            logAction("----------------------------------------");
        }
    } catch (error) {
        logAction("ERROR : ");
        logAction(error);
        console.error(error);
    }
}

module.exports = { autoCloseMain };