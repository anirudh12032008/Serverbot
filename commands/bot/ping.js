Discord = require('discord.js');
module.exports = {
	name: 'ping',
	description: 'Get the Discord API latency & bot ping',
	aliases: ['latency'],
	execute(message) {
		const pingEmbed = new Discord.MessageEmbed()
			.setColor('#FFC0CB')
			.setTitle('🏓Pong.');
		message.reply('Calculating ping...').then(resultMessage => {
			const cnt = new Date().getTime();
			const ping = cnt - message.createdAt;
			pingEmbed.setDescription(
				`Your ping is \`${ping}\` ms\nLatency is \`${parseInt(
					message.client.ws.ping
				)}\` ms`
			);
			resultMessage.edit(message.author.toString(), pingEmbed);
		});
	}
};
