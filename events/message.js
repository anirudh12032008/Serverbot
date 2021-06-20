const Discord = require('discord.js');

function clean(text) {
	if (typeof text === 'string')
		return text
			.replace(/`/g, '`' + String.fromCharCode(8203))
			.replace(/@/g, '@' + String.fromCharCode(8203));
	else return text;
}

module.exports = {
	name: 'message',
	once: false,
	execute(message, client) {
		const prefix = process.env.PREFIX;

		if (!message.content.toLowerCase().startsWith('dg ')) return;

		let args = message.content
			.slice(prefix.length)
			.trim()
			.split(/ +/);

		const commandName = args.shift().toLowerCase();

		const command =
			client.commands.get(commandName) ||
			client.commands.find(cmd => cmd.aliases && cmd.aliases === commandName);

		if (message.author.id === process.env.DEV) {
			if (commandName === 'restart') {
				//process.exit()
				client.login(process.env.BOTTOKEN);
			}

			if (commandName === 'evali') {
				const secret = /process.env/i;
				const isMatch = args.some(arg => arg.match(secret));
				if (isMatch)
					return message.channel.send('U tryna CRACK my code?!?!?!?!?');
				try {
					const code = args.join(' ');
					let evaled = eval(code);
					if (typeof evaled !== 'string')
						evaled = require('util').inspect(evaled);
					message.channel.send(clean(evaled), { code: 'diff', split: true });
				} catch (err) {
					message.channel.send(`\`ERROR\` \`\`\`diff\n- ${clean(err)}\n\`\`\``);
				}
			}
		}

		if (!command) return;

		if (command.guildOnly && message.channel.type === 'dm') {
			return message.reply("I can't execute that command inside DMs!");
		}

		if (command.Userpermissions) {
			const authorPerms = message.channel.permissionsFor(message.author);
			if (!authorPerms || !authorPerms.has(command.Userpermissions)) {
				return message.reply('You can not do this!');
			}
		}

		if (command.permissions) {
			let perms = [];
			let missingPerms = [];
			command.permissions.forEach(p => {
				perms.push(message.channel.permissionsFor(client.user).has(p));
				if (!message.channel.permissionsFor(client.user).has(p))
					missingPerms.push(p);
			});

			missingPerms = missingPerms.join('\n');

			if (perms.includes(false))
				return message.channel
					.send(
						'The Following permissions which are missing are needed by the bot for this command:\n\n```' +
							missingPerms.replace('_', ' ') +
							'\n```'
					)
					.catch(err => console.log(`Missing send message permission`));
		}

		if (command.args && !args.length) {
			let reply = `You didn't provide any arguments, ${message.author}!`;

			if (command.usage) {
				reply += `\nThe proper usage would be: \`${prefix}${command.name} ${
					command.usage
				}\``;
			}

			return message.channel.send(reply);
		}

		const { cooldowns } = client;
		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Discord.Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1000;
		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply(`please wait ${timeLeft.toFixed(
					1
				)} more second(s) before reusing the
\`${command.name}\` command.`);
			}
		}
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		try {
			command.execute(message, args, prefix);
		} catch (error) {
			console.error(error);
			message.reply('there was an error trying to execute that command!');
		}
	}
};
