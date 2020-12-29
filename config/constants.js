const PORT = process.env.PORT || 3000;
const URL = process.env.APP_BASE_URL || 'http://localhost';
const APP_BASE_URL = URL + `:${PORT}`;
const MONGO_URI = process.env.URI;
const API_URL = 'api/v1';

module.exports = {
	PORT,
	APP_BASE_URL,
	MONGO_URI,
	API_URL
};