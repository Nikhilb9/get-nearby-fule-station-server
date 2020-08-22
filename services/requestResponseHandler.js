/** @format */

const nikhilError = require("../common/nikhilError").nikhilError;
const authService = require("./authService");
const templateConstant = require("../common/templateConstant");
const stringConstant = require("../common/stringConstant");
const isNikhilError = require("../common/utility").isNikhilError;

const utility = require("../common/utility");

// This middleware handles any route which is not defined in anay of the controllers
const handle404 = (req, res, next) => {
	const err = nikhilError(templateConstant.INVALID("Link"), 404, 1300);
	next(err);
};

// This middleware generates error response
const handleError = (err, req, res, _next) => {
	let error = err;
	if (!isNikhilError(error)) {
		error = nikhilError(stringConstant.genericMessage.SERVER_ERROR);
	}
	res.status(error.statusCode || 500);
	if (
		utility.isNullOrUndefined(res.locals.responseStatus) ||
		res.locals.responseStatus === false
	) {
		res.send({
			status: {
				code: error.subCode,
				message: error.message,
			},
		});
	}
};

// This middleware generates success response
const handleResponse = (req, res, next) => {
	if (res.locals.response) {
		let response = {
			status: {
				code: 0,
				message: res.locals.response.message,
			},
		};
		if (res.locals.response.body) {
			response = {
				...response,
				...res.locals.response.body,
			};
		}

		res.locals.responseStatus = true; //response sent
		res.send(response);
	} else {
		next();
	}
};

// This middleware verifies client
const verifyClient = async (req, res, next) => {
	try {
		await authService.clientAuth(req.headers["authorization"]);
		next();
	} catch (err) {
		next(err);
	}
};

module.exports = {
	handle404,
	handleError,
	handleResponse,
	verifyClient,
};
