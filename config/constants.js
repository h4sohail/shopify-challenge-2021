const PORT = process.env.PORT || 3000;

const PROD_URL = process.env.PROD_URL;

const URL = 'http://localhost';

const MONGO_URI = process.env.URI;

const API_URL = 'api/v1';

const getBaseAppURL = () => {
	if (PROD_URL) {
		return PROD_URL; // uses the default port
	} else {
		return URL + `:${PORT}`;
	}
}

module.exports = {
	PORT,
	MONGO_URI,
	API_URL,
	getBaseAppURL
};