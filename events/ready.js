module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.user.setPresence({
			activity: {
				name: `${process.env.PREFIX} with ${client.guilds.cache.reduce(
					(a, c) => a + c.memberCount,
					0
				)} users`,
				type: 'PLAYING'
			},
			status: 'ONLINE'
		});

		setInterval(() => {
			//runs every 30sec
			client.user.setPresence({
				activity: {
					name: `${process.env.PREFIX} with ${client.guilds.cache.reduce(
						(a, c) => a + c.memberCount,
						0
					)} users`,
					type: 'PLAYING'
				},
				status: 'ONLINE'
			});
		}, 6000000); // runs every 100 minutes i.e. 1 hr 40 mins
		console.log(
			`Logged in as ${client.user.tag}! Serving ${client.guilds.cache.reduce(
				(a, c) => a + c.memberCount,
				0
			)} users!!`
		);
	}
};
