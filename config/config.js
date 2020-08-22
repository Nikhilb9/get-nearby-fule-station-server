/**
 * /* eslint-disable no-undef
 *
 * @format
 */

module.exports = {
	serverConfig: {
		PORT: process.env.SERVER_PORT,
		env: process.env.NODE_ENV || local,
	},
	dbConfig: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: "postgres",
		define: {
			freezeTableName: true,
			underscored: true,
			timestamps: true,
		},
		dialectOptions: {
			useUTC: false, // for reading from database
		},
		timezone: "-08:00",
	},
	authConfig: {
		tokenExpiry: 2592000,
		secretKey: process.env.JWT_SECRET_KEY,
		hashSaltRounds: 8,
	},
	redisConfig: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
	},
	apiKeyConfig: {
		username: process.env.USERNAME,
		password: process.env.PASSWORD,
	},
	fuleStationSearchRadius: {
		searchRadius: 5000,
	},
};
