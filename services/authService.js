/** @format */

const nikhilError = require("../common/nikhilError").nikhilError;
const templateConstant = require("../common/templateConstant");
const { apiKeyConfig } = require("../config/config");
const stringConstant = require("../common/stringConstant");
const tokenService = require("./tokenService");

const jwtService = require("./jwtService");

class AuthService {
	async clientAuth(auth) {
		try {
			// return new Promise((resolve, reject) => {
			if (!auth) {
				throw nikhilError(
					templateConstant.PARAMETER_MISSING("Header: Authorization"),
					400,
					1100
				);
			}
			var tmp = auth.split(" ");
			if (tmp.length !== 2) {
				throw nikhilError(
					templateConstant.INVALID("Header: Authorization"),
					400,
					1101
				);
			}
			// eslint-disable-next-line no-undef
			var buf = Buffer.from(tmp[1], "base64");
			var plainAuth = buf.toString();
			var creds = plainAuth.split(":");
			if (creds.length !== 2) {
				throw nikhilError(
					templateConstant.INVALID("Header: Authorization"),
					400,
					1100
				);
			}
			var bundle = creds[0];
			var token = creds[1];

			if (bundle === apiKeyConfig.username && token === apiKeyConfig.password) {
				return Promise.resolve(null);
			} else {
				throw nikhilError(
					stringConstant.authServiceMessage.UNAUTHORIZED_CLIENT,
					401,
					1000
				);
			}
		} catch (err) {
			if (err.statusCode === 404) {
				err = nikhilError(
					stringConstants.authServiceMessage.UNAUTHORIZED_CLIENT,
					401,
					1000
				);
			}
			return Promise.reject(err);
		}
	}
	async verifyTokenAuth(req, res, next) {
		try {
			if (!req.headers["token"]) {
				next(
					nikhilError(
						templateConstants.PARAMETER_MISSING("Header: Token"),
						401,
						1000
					)
				);
			}

			const authorizedData = await jwtService.verifyToken(req.headers["token"]);

			const tokenInRedis = await tokenService.getToken(
				authorizedData.userId,
				authorizedData.role
			);
			res.locals.user = authorizedData;
			if (tokenInRedis === req.headers["token"]) {
				next();
			} else {
				throw nikhilError(
					templateConstants.INVALID("Header: Token"),
					401,
					1000
				);
			}
		} catch (err) {
			let error = err;
			if (err.statusCode === 400) {
				error = nikhilError(
					templateConstants.INVALID("Header: Token"),
					401,
					1000
				);
			}
			next(error);
		}
	}
}

const authServiceObject = new AuthService();
module.exports = authServiceObject;
