const IS_PROD = process.env.IS_PROD == 'true';
const MONGO_URI = process.env.URI;
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'http://localhost';

if (IS_PROD) {
	let APP_BASE_URL = URL;
} else {
	APP_BASE_URL = URL + `:${PORT}`;
}

const API_URL = 'api/v1';

module.exports = {
	PORT,
	APP_BASE_URL,
	MONGO_URI,
	API_URL
};