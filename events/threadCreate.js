const { Events } = require('discord.js');
const utilities = require('../utils/functions.js');
/*
========================================================================================
When creating a new thread :
 - If this new thread is a ticket (check role of thread creator, thread channel, etc.):
    - Rename it using the ticket ID
    - Add a welcome message
    - Add a "new ticket" tag if the option is enabled in .env
========================================================================================
*/

// .env values required here
const TICKET_PREFIX = process.env.TICKET_PREFIX;
const TICKET_TEMPLATE_OPEN = process.env.TICKET_TEMPLATE_OPEN;
const NEW_TICKET_TAG = process.env.NEW_TICKET_TAG;
const DESABLE_TICKET_FOR_SUPPORT_MEMBER = process.env.DESABLE_TICKET_FOR_SUPPORT_MEMBER;


module.exports = {
    name: Events.ThreadCreate,
    async execute(thread) {
        // Just for cache
        await thread.guild.members.fetch(thread.ownerId);


        // Cancel if we are not in support forum
        if (!utilities.isATicket(thread)) return;

        // Cancel if the post was made by a support member (and if this option is enable)
        if (DESABLE_TICKET_FOR_SUPPORT_MEMBER == 'true' || DESABLE_TICKET_FOR_SUPPORT_MEMBER == 'TRUE') {
            if (await utilities.checkIfOwnerIsSupportMember(thread)) {
                return;
            }

        }


        // Apply the NEW_TAG if not null
        if (NEW_TICKET_TAG != 'null' && NEW_TICKET_TAG != 'NULL' && NEW_TICKET_TAG != '') {
            try {
                const newTagID = await utilities.getTagIdFromName(thread, NEW_TICKET_TAG);
                if (newTagID != null) {
                    // Append to tags already defined
                    const newAppliedTags = [...thread.appliedTags, newTagID];
                    await thread.setAppliedTags(newAppliedTags);
                }
            }
            catch (e) {
                console.log("Error in ThreadCreate (apply new tag)");
                console.log(e);
            }

        }

        // Rename ticket with ID
        const ticketID = TICKET_PREFIX + thread.id;
        const newThreadName = thread.name + ' [' + ticketID + '] ';
        await thread.setName(newThreadName);

        // Send welcome message
        await thread.send(TICKET_TEMPLATE_OPEN);
        await thread.send('- Ticked ID : ' + ticketID);

    },

};
