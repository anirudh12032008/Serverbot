const express = require('express');
const server = express();

server.all('*', (req, res) => {
	res.send(`working`);
});

function keepAlive() {
	server.listen(3000, () => {
		console.log('Server listening at PORT: 3000');
	});
}

module.exports = keepAlive;
