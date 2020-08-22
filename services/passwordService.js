/** @format */

const bcrypt = require("bcrypt");
const stringConstant = require("../common/stringConstant")
	.passwordServiceMessage;
const nikhilError = require("../common/nikhilError").nikhilError;
const { authConfig } = require("../config/config");

class PasswordService {
	/**
	 * This function create convert password to hash
	 * @param {string} password
	 */
	hashPassword(password) {
		return new Promise((resolve, reject) => {
			bcrypt.hash(
				password,
				parseInt(authConfig.hashSaltRounds),
				(err, hashedPassword) => {
					if (err) {
						reject(err);
					} else {
						resolve(hashedPassword);
					}
				}
			);
		});
	}
	/**
	 *This function create for verify password
	 * @param {string} password
	 * @param {string} hashedPassword
	 */
	verifyPassword(password, hashedPassword) {
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, hashedPassword, (err, isSame) => {
				if (err) {
					reject(err);
				} else if (isSame) {
					resolve(stringConstant.PASSWORD_MATCHED);
				} else {
					reject(nikhilError(stringConstant.WRONG_PASSWORD, 401, 1001));
				}
			});
		});
	}
}

module.exports = new PasswordService();
