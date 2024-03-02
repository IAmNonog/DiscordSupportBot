/* require('discord.js');
require('dotenv').config(); */

const SUPPORT_ROLE_ID = process.env.SUPPORT_ROLE_ID;
const SUPPORT_CHANNEL_FORUM_ID = process.env.SUPPORT_CHANNEL_FORUM_ID;
const NEW_TICKET_TAG = process.env.NEW_TICKET_TAG;
const WORKING_TICKET_TAG = process.env.WORKING_TICKET_TAG;
const TICKET_PREFIX = process.env.TICKET_PREFIX;

// Check if a channel is a ticket (support forum)
function isATicket(channel) {
    if (channel.type == 11 && channel.parentId == SUPPORT_CHANNEL_FORUM_ID) {
        return true;
    }
    return false;
}


// returns true if the thread creator has the support role
async function checkIfOwnerIsSupportMember(thread) {
    try {
        const member = await thread.guild.members.fetch(thread.ownerId);
        if (member.roles.cache.has(SUPPORT_ROLE_ID)) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}

// returns true if the user with the ID userID has the support role
async function checkIfUserIDIsSupportMember(thread, userID) {
    try {
        const member = await thread.guild.members.fetch(userID);
        if (member.roles.cache.has(SUPPORT_ROLE_ID)) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}

// Get a tag's ID from its name
async function getTagIdFromName(thread, tagName) {
    if (!thread || !tagName) {
        return null;
    }

    try {
        // Retrieves the thread's parent forum
        const parentForum = await thread.parent.fetch();

        // Checks if the parentForum has tags and searches for the tag by name
        if (parentForum && parentForum.availableTags.length > 0) {
            const tag = parentForum.availableTags.find(t => t.name == tagName);

            if (tag) {
                return tag.id;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}


async function closeTicket(thread) {
    // Remove tag (WORKING)
    if (WORKING_TICKET_TAG != 'null' && WORKING_TICKET_TAG != 'NULL' && WORKING_TICKET_TAG != '') {
        const workingTicketTagID = await getTagIdFromName(thread, WORKING_TICKET_TAG);
        const currentTags = thread.appliedTags;
        // If "workingTicket" Tag is applied
        const index = currentTags.indexOf(workingTicketTagID);
        if (index !== -1) {
            // Remove it
            currentTags.splice(index, 1);
            await thread.setAppliedTags(currentTags);
        }
    }
    // Remove tag (NEW)
    if (NEW_TICKET_TAG != 'null' && NEW_TICKET_TAG != 'NULL' && NEW_TICKET_TAG != '') {
        const newTicketTagID = await getTagIdFromName(thread, NEW_TICKET_TAG);
        const currentTags = thread.appliedTags;
        // If "workingTicket" Tag is applied
        const index = currentTags.indexOf(newTicketTagID);
        if (index !== -1) {
            // Remove it
            currentTags.splice(index, 1);
            await thread.setAppliedTags(currentTags);
        }
    }

    // Then : close the ticket
    thread.setLocked(true);
    thread.setArchived(true);
}


function parseOptionTicket(inputString, forumID) {
    // Checks if the string starts with ticketPrefix
    if (inputString.startsWith(TICKET_PREFIX)) {
        // Removes the ticketPrefix from the string and returns the result
        return ('https://discord.com/channels/' + forumID + '/' + inputString.slice(TICKET_PREFIX.length));
    } else {
        // Returns the string itself if it does not begin with ticketPrefix
        return inputString;
    }
}

module.exports = { checkIfOwnerIsSupportMember, checkIfUserIDIsSupportMember, getTagIdFromName, isATicket, closeTicket, parseOptionTicket };