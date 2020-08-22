/** @format */

const redisService = require("./redisService");
const tokenConstant = require("../common/stringConstant").tokenServiceMessage;
const redisConstant = require("../common/stringConstant").redisServiceMessage;
const nikhilError = require("../common/nikhilError").nikhilError;

// it is used to generate the key
function keyGeneration(userID, role) {
	return userID + "_" + role.toUpperCase() + "_token";
}

class TokenService {
	// it is used to retrieve a token from redis database
	getToken(userID, role) {
		return new Promise((resolve, reject) => {
			var key = keyGeneration(userID, role);
			redisService
				.get(key)
				.then((reply) => {
					resolve(reply);
				})
				.catch((err) => {
					if (err.message === redisConstant.KEY_DOES_NOT_EXIST) {
						reject(
							nikhilError(tokenConstant.USER_ID_DOES_NOT_EXIST, 400, 1101)
						);
					} else if (err.message === redisConstant.KEY_IS_INVALID) {
						reject(nikhilError(tokenConstant.USER_ID_IS_INVALID, 400, 1101));
					} else reject(err);
				});
		});
	}

	// it is used to store a token to redis database
	setToken(userID, role, token, expiryTime) {
		return new Promise((resolve, reject) => {
			var key = keyGeneration(userID, role);
			redisService
				.setWithExpiry(key, token, expiryTime)
				.then((reply) => {
					resolve(reply);
				})
				.catch((err) => {
					if (err.message === redisConstant.KEY_IS_INVALID) {
						reject(nikhilError(tokenConstant.USER_ID_IS_INVALID, 400, 1101));
					} else if (err.message === redisConstant.VALUE_IS_INVALID) {
						reject(nikhilError(tokenConstant.TOKEN_IS_INVALID, 400, 1101));
					} else reject(err);
				});
		});
	}
}

const tokenServiceObject = new TokenService();
module.exports = tokenServiceObject; //exporting the token service object
