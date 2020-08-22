/**
 * /* eslint-disable require-atomic-updates
 *
 * @format
 */

const nikhilError = require("../common/nikhilError").nikhilError;
const stringConstants = require("../common/stringConstant");
const utility = require("../common/utility");
const templateConstants = require("../common/templateConstant");
const userDAO = require("../services/DAO/userDAO");
const templateConstant = require("../common/templateConstant");
const { getUserWithUserIdAndRoleId } = require("../services/DAO/userDAO");
const upload = require("./uploadService");

class ValidateUserApis {
	/**
	 *This function create for validate login register request
	 * @param {object} body
	 */
	async validateLoginRegisterRequest(body) {
		try {
			const { email, password, role } = body;

			if (utility.isNullOrUndefined(role)) {
				throw nikhilError(
					templateConstants.PARAMETER_MISSING("role"),
					400,
					1100
				);
			}

			if (utility.isNullOrUndefined(password)) {
				throw nikhilError(
					templateConstants.PARAMETER_MISSING("password"),
					400,
					1100
				);
			}
			if (utility.isNullOrUndefined(email)) {
				throw nikhilError(
					templateConstants.PARAMETER_MISSING("password"),
					400,
					1100
				);
			}
			if (!utility.isString(role)) {
				throw nikhilError(templateConstants.INVALID("role"), 400, 1101);
			}
			if (!utility.isString(email)) {
				throw nikhilError(templateConstants.INVALID("email"), 400, 1101);
			}
			if (!utility.isString(password)) {
				throw nikhilError(templateConstants.INVALID("password"), 400, 1101);
			}

			if (!utility.isEmailValid(email)) {
				throw nikhilError(templateConstants.INVALID("email"), 400, 1101);
			}

			const userRole = await userDAO.getUserRoleWithRole(role.toUpperCase());

			if (!userRole) {
				throw nikhilError(templateConstants.INVALID("role"), 400, 1101);
			}

			return userRole;
		} catch (err) {
			if (err.statusCode === 404) {
				err.statusCode = 400;
				err.subCode = 1101;
			}
			throw err;
		}
	}
	/**
	 *This function create for validate register request
	 * @param {obj} req
	 * @param {obj} res
	 * @param {function} next
	 */
	async validateRegisterRequest(req, res, next) {
		try {
			const userRole = await this.validateLoginRegisterRequest(req.body);
			const name = req.body.name;
			const location = req.body.location;
			const fules = req.body.fules;
			const fulesAfterUpperCase = [];

			if (utility.isNullOrUndefined(name)) {
				throw nikhilError(
					templateConstants.PARAMETER_MISSING("name"),
					400,
					1100
				);
			}

			if (!utility.isString(name)) {
				throw nikhilError(templateConstants.INVALID("name"), 400, 1101);
			}

			if (req.body.role.toUpperCase() === "FULE_STATION") {
				if (utility.isNullOrUndefined(location)) {
					throw nikhilError(
						templateConstants.PARAMETER_MISSING("location"),
						400,
						1100
					);
				}

				if (utility.isArrayNullOrEmpty(fules)) {
					throw nikhilError(
						templateConstants.PARAMETER_MISSING("available_fules"),
						400,
						1100
					);
				}
				if (!utility.isString(location)) {
					throw nikhilError(templateConstants.INVALID("location"), 400, 1101);
				}

				if (fules.length <= 0 || fules.length > 3) {
					throw nikhilError(templateConstants.INVALID("fules"), 400, 1101);
				}

				const fuleTypes = ["GAS", "PETROL", "DIESEL"];
				const map = new Map();
				fules.forEach((element) => {
					if (!utility.isString(element)) {
						throw nikhilError(templateConstants.INVALID("fules"), 400, 1101);
					} else if (!fuleTypes.includes(element.toUpperCase())) {
						throw nikhilError(templateConstants.INVALID("fules"), 400, 1101);
					} else if (map.get(element.toUpperCase())) {
						throw nikhilError(
							stringConstants.genericMessage.DUPLICATE_VALUE,
							400,
							1101
						);
					} else {
						fulesAfterUpperCase.push(element.toUpperCase());
						map.set(element.toUpperCase(), 1);
					}
				});
				res.locals.fules = fulesAfterUpperCase;

				let latLong = req.body.location.split(",");

				if (this.isLatLongValid(latLong)) {
					res.locals.locationLatitude = Number(latLong[0]);
					res.locals.locationLongitude = Number(latLong[1]);
				} else {
					throw nikhilError(templateConstants.INVALID("location"), 400, 1101);
				}
			}
			const user = await userDAO.getUserWithEmail(req.body.email);

			if (user) {
				throw nikhilError(
					stringConstants.genericMessage.USER_EXISTS,
					400,
					1102
				);
			}
			res.locals.roleId = userRole.id;
			next();
		} catch (err) {
			next(err);
		}
	}

	//validate if the given latitude and longitude are number.
	isLatLongValid(latLong) {
		if (latLong.length !== 2) {
			return false;
		}

		if (
			utility.isValidLatitude(latLong[0]) &&
			utility.isValidLongitude(latLong[1])
		) {
			return true;
		} else {
			return false;
		}
	}
	/**
	 *This function create for validate login request
	 * @param {object} req
	 * @param {object} res
	 * @param {function} next
	 */
	async valiadateLoginRequest(req, res, next) {
		try {
			const userRole = await this.validateLoginRegisterRequest(req.body);
			const user = await userDAO.getUserWithEmail(req.body.email);
			if (utility.isNullOrUndefined(user)) {
				throw nikhilError(templateConstants.INVALID("email"), 401, 1101);
			}

			if (user.userRoleId !== userRole.id) {
				throw nikhilError(
					stringConstants.genericMessage.USER_NOT_REGISTERED_WITH_THIS_ROLE,
					400,
					1101
				);
			}

			if (user.profile_status.status === "DEACTIVATE") {
				throw nikhilError(
					stringConstants.genericMessage.ACCOUNT_DEACTIVATED,
					401,
					1103
				);
			}

			res.locals.user = user;
			next();
		} catch (err) {
			next(err);
		}
	}
	/**
	 *This function create for validate search fule station
	 * @param {object} req
	 * @param {object} res
	 * @param {function} next
	 */
	async validateSearchFuleStationRequest(req, res, next) {
		let { fule, location } = req.body;
		try {
			if (res.locals.user.role === "FULE_STATION") {
				throw nikhilError(templateConstants.INVALID("link"), 400, 1101);
			}

			if (utility.isNullOrUndefined(fule)) {
				throw nikhilError(
					templateConstant.PARAMETER_MISSING("fule"),
					400,
					1100
				);
			}

			if (utility.isNullOrUndefined(location)) {
				throw nikhilError(
					templateConstants.PARAMETER_MISSING("location"),
					400,
					1100
				);
			}

			if (!utility.isNumber(fule)) {
				throw nikhilError(templateConstants.INVALID("fule"), 400, 1101);
			}

			if (!utility.isString(location)) {
				throw nikhilError(templateConstants.INVALID("location"), 400, 1101);
			}

			let latLong = req.body.location.split(",");

			if (this.isLatLongValid(latLong)) {
				res.locals.locationLatitude = Number(latLong[0]);
				res.locals.locationLongitude = Number(latLong[1]);
			} else {
				throw nikhilError(templateConstants.INVALID("location"), 400, 1101);
			}

			next();
		} catch (err) {
			next(err);
		}
	}
	/**
	 *This function create for validate book fule station request
	 * @param {object} req
	 * @param {object} res
	 * @param {funcion} next
	 */
	async validateBookFuleStationRequest(req, res, next) {
		try {
			const fuleStation = req.body.fule_station;
			const schedule = req.body.schedule; //2020-07-16 18:28:00.658+05:30 in this format
			const fuleId = req.body.fule_id;

			if (res.locals.user.role === "FULE_STATION") {
				throw nikhilError(templateConstant.INVALID("link"), 400, 1101);
			}

			if (utility.isNullOrUndefined(fuleStation)) {
				throw nikhilError(
					templateConstants.PARAMETER_MISSING("fule_station"),
					400,
					1100
				);
			}

			if (utility.isNullOrUndefined(schedule)) {
				throw nikhilError(
					templateConstants.PARAMETER_MISSING("schedule"),
					400,
					1100
				);
			}

			if (utility.isNullOrUndefined(fuleId)) {
				throw nikhilError(
					templateConstants.PARAMETER_MISSING("fule_id"),
					400,
					1100
				);
			}

			if (!utility.isString(fuleStation)) {
				throw nikhilError(templateConstants.INVALID("fule_station"), 400, 1101);
			}

			if (!utility.isString(schedule)) {
				throw nikhilError(templateConstants.INVALID("schedule"), 400, 1101);
			}

			if (!utility.isString(fuleId)) {
				throw nikhilError(templateConstants.INVALID("fule_id"), 400, 1101);
			}

			if (!utility.isFutureTime(schedule)) {
				throw nikhilError(templateConstants.INVALID("schedule"), 400, 1101);
			}

			const fule = userDAO.getFulesWithId(fuleId);

			if (utility.isNullOrUndefined(fule)) {
				throw nikhilError(templateConstants.INVALID("fule_id"), 400, 1101);
			}

			const roleId = await userDAO.getUserRoleWithRole("FULE_STATION");

			const user = await getUserWithUserIdAndRoleId(fuleStation, roleId.id);

			if (utility.isNullOrUndefined(user)) {
				throw nikhilError(templateConstants.INVALID("fule_station"), 400, 1101);
			}
			const fuleStationBlockedUser = await userDAO.getFuleStationBlockedUser(
				fuleStation,
				res.locals.user.userId
			);

			if (!utility.isNullOrUndefined(fuleStationBlockedUser)) {
				throw nikhilError(
					stringConstants.userControllerMessage.CAN_NOT_BOOK_THIS_FULE_STATION,
					400,
					1110
				);
			}
			const getFuleStationBooking = await userDAO.getFuleStationBooking(
				schedule,
				fuleId,
				fuleStation
			);

			if (!utility.isNullOrUndefined(getFuleStationBooking)) {
				throw nikhilError(
					stringConstants.userControllerMessage
						.ALLREADY_BOOKED_ON_THIS_SCHEDULE,
					400,
					1110
				);
			}

			next();
		} catch (err) {
			next(err);
		}
	}
	/**
	 *This function create for validate get booking request
	 * @param {object} req
	 * @param {object} res
	 * @param {function} next
	 */
	async validateGetBookingsRequest(req, res, next) {
		try {
			if (res.locals.user.role === "CUSTOMER") {
				throw nikhilError(templateConstant.INVALID("link"), 400, 1101);
			}
			next();
		} catch (err) {
			next(err);
		}
	}
	/**
	 *This function create for validate profile request
	 * @param {*} req
	 * @param {*} res
	 * @param {*} next
	 */
	async validateProfilePicRequest(req, res, next) {
		upload(req, res, function (error) {
			if (error) {
				if (error.code == "LIMIT_FILE_SIZE") {
					next(
						nikhilError(
							"File Size is too large. Allowed file size is 3MB",
							400,
							1100
						)
					);
				}
			} else {
				if (!req.file) {
					next(nikhilError("file not found", 400, 1100));
				} else {
					next();
				}
			}
		});
	}
}

module.exports = new ValidateUserApis();
