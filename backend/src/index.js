const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http');

dotenv.config();
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/trending', require('./routes/trending'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/connections', require('./routes/connections'));
app.use('/api/direct-messages', require('./routes/directMessages'));
app.use('/api/place-suggestions', require('./routes/placeSuggestions'));

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5001;
const server = http.createServer(app);

function startServer(port) {
	server.listen(port, () => console.log(`Server running on port ${port}`));
}

server.on('error', (err) => {
	if (err && err.code === 'EADDRINUSE') {
		let usedPort = DEFAULT_PORT;
		try {
			const addr = server.address();
			if (addr && addr.port) usedPort = addr.port;
		} catch (e) {
			// ignore, fallback to DEFAULT_PORT
		}
		const tryPort = (typeof usedPort === 'number' ? usedPort : DEFAULT_PORT) + 1;
		console.warn(`Port ${DEFAULT_PORT} is in use. Trying port ${tryPort}...`);
		// attempt to listen on next port
		setTimeout(() => startServer(tryPort), 200);
		return;
	}
	console.error('Server error:', err);
	process.exit(1);
});

startServer(DEFAULT_PORT);