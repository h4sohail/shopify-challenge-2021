const PORT = process.env.PORT || 3000;
const PROD_URL = process.env.PROD_URL;
const MONGO_URI = process.env.URI;
const SECRET = process.env.SECRET || 'of course i still love you'
const URL = 'http://localhost';
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
	SECRET,
	API_URL,
	getBaseAppURL
};