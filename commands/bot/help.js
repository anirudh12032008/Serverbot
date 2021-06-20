Discord = require('discord.js');
module.exports = {
	name: 'test',
	description: 'test the bot',
	aliases: ['latency'],
	execute(message) {
		const pingEmbed = new Discord.MessageEmbed()
			.setColor('#FFC0CB')
			.setTitle('Test')
			.setDescription(`Your test was successful `);
		message.reply(pingEmbed)}
		};
