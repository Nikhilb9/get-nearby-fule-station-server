/** @format */

const jwt = require("jsonwebtoken");
const { authConfig } = require("../config/config");
const constant = require("../common/stringConstant");
const nikhilError = require("../common/nikhilError").nikhilError;

class JWTService {
	/**
	 *This fucntion create for generate token
	 * @param {object} payload
	 */
	generateToken(payload) {
		return new Promise((resolve, reject) => {
			jwt.sign(
				payload,
				authConfig.secretKey,
				{
					expiresIn: authConfig.tokenExpiry,
				},
				(err, token) => {
					if (err) {
						reject(err);
					} else {
						resolve(token);
					}
				}
			);
		});
	}
	/**
	 * This function create for verify token
	 * @param {*} token
	 */
	verifyToken(token) {
		return new Promise((resolve, reject) => {
			jwt.verify(token, authConfig.secretKey, (err, authorizedData) => {
				if (err) {
					if (err instanceof jwt.TokenExpiredError) {
						return reject(
							nikhilError(constant.authServiceMessage.TOKEN_EXPIRED, 401, 1000)
						);
					}
					reject(err);
				} else {
					resolve(authorizedData);
				}
			});
		});
	}
}
module.exports = new JWTService();
