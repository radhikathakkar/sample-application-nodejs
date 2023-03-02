const Dotenv = require('dotenv');

Dotenv.config({ silent: true });

module.exports = {
	PORT: process.env.PORT || 3030,
	DB: {
		USERNAME: process.env.DB_USERNAME ,
		PASSWORD: process.env.DB_PASSWORD,
		NAME: process.env.DB_NAME,
		HOST: process.env.DB_HOST,
		DIALECT: process.env.DB_DIALECT || 'postgres',
		PORT: process.env.DB_PORT || '5432'
	},
	HTTP_STATUS_CODES: {
		OK: 200,
		BAD_REQUEST: 400,
		INTERNAL_SERVER_ERROR: 500,
	},
};
