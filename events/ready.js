const { Events } = require('discord.js');
const autoClose = require('../utils/autoClose.js');

const ENABLE_AUTO_CLOSE_TICKET = process.env.ENABLE_AUTO_CLOSE_TICKET;
const AUTOCLOSE_CRON_CONFIG = process.env.AUTOCLOSE_CRON_CONFIG;
const AUTOCLOSE_CRON_TIMEZONE = process.env.AUTOCLOSE_CRON_TIMEZONE;

let cron = null;
if (ENABLE_AUTO_CLOSE_TICKET) {
	try {
		cron = require('node-cron');
	}
	catch (e) {
		console.log('unable to load cron module to schedule automatic ticket deletion');
		console.log(e);
	}

}

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		// automatic closing of inactive tickets :
		//  If the option is enabled, and cron is available on the system, run the task
		if (ENABLE_AUTO_CLOSE_TICKET && cron != null) {
			try {
				cron.schedule(AUTOCLOSE_CRON_CONFIG, async () => {
					await autoClose.autoCloseMain(client);
				}, {
					scheduled: true,
					timezone: AUTOCLOSE_CRON_TIMEZONE,
				});
			} catch (e) {
				/* empty */
			}

		}
	},
};