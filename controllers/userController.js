/** @format */
const passwordService = require("../services/passwordService");
const userDAO = require("../services/DAO/userDAO");
const jwtService = require("../services/jwtService");
const tokenService = require("../services/tokenService");
const { authConfig, fuleStationSearchRadius } = require("../config/config");
const stringConstant = require("../common/stringConstant");
const redisIndexingService = require("../services/redisIndexingService");
const userValidationService = require("../services/userValidationService");
const authService = require("../services/authService");
const redisService = require("../services/redisService");
const templateConstant = require("../common/templateConstant");
const utility = require("../common/utility");

class UserController {
	constructor(userRouter) {
		this.userRouter = userRouter;
		this.registerRoutes();
	}
	registerRoutes() {
		this.userRouter.post(
			"/",
			userValidationService.validateRegisterRequest.bind(userValidationService),
			this.register.bind(this)
		);
		this.userRouter.post(
			"/authenticate",
			userValidationService.valiadateLoginRequest.bind(userValidationService),
			this.login
		);
		this.userRouter.get(
			"/fulestation/search",
			authService.verifyTokenAuth.bind(authService),
			userValidationService.validateSearchFuleStationRequest.bind(
				userValidationService
			),
			this.searchFuleStation
		);

		this.userRouter.post(
			"/fulestation/book",
			authService.verifyTokenAuth.bind(authService),
			userValidationService.validateBookFuleStationRequest,
			this.bookFuleStation
		);
		this.userRouter.get(
			"/fulestation/bookings",
			authService.verifyTokenAuth.bind(authService),
			userValidationService.validateGetBookingsRequest,
			this.getBookings
		);

		this.userRouter.post(
			"/profilepic",
			authService.verifyTokenAuth.bind(authService),
			userValidationService.validateProfilePicRequest,
			this.profilePic
		);
	}

	/**
	 * This function create for user registration
	 * @param {object} req
	 * @param {object} res
	 * @param {function} next
	 */
	async register(req, res, next) {
		try {
			const { name, email, password, role } = req.body;
			const { roleId, locationLatitude, locationLongitude, fules } = res.locals;
			const hashedPassword = await passwordService.hashPassword(password);
			let fuleIds = [];
			let roleFuleStation = false;

			let params = {
				locationLatitude: locationLatitude,
				locationLongitude: locationLongitude,
				name: name,
				roleId: roleId,
				email: email,
				hashPassword: hashedPassword,
			};

			if (role.toUpperCase() === "FULE_STATION") {
				roleFuleStation = true;
				params = {
					locationLatitude: locationLatitude,
					locationLongitude: locationLongitude,
					name: name,
					userRoleId: roleId,
					email: email,
					passwordHash: hashedPassword,
				};
				const fule = await userDAO.getFulesWithId(fules);

				fuleIds = fule.map((element) => {
					return element.id;
				});
			} else {
				params = {
					name: name,
					userRoleId: roleId,
					email: email,
					passwordHash: hashedPassword,
				};
			}

			const user = await userDAO.createUser(params);

			if (roleFuleStation) {
				await userDAO.addFulesTypeToUser(user.id, fuleIds);
			}
			const token = await jwtService.generateToken({
				userId: user.id,
				username: user.name,
				role: role.toUpperCase(),
			});

			await tokenService.setToken(
				user.id,
				role.toUpperCase(),
				token,
				authConfig.tokenExpiry
			);

			res.locals.response = {
				body: {
					user: {
						token: token,
						name: user.name,
					},
				},
				message: stringConstant.userControllerMessage.REGISTERED,
			};
			next();

			if (roleFuleStation) {
				const fuleStationDoc = {
					userId: user.id,
					name: user.name,
					fule: fuleIds,
					radius: 5, // in miles,
					lat: parseFloat(user.locationLatitude),
					long: parseFloat(user.locationLongitude),
				};
				await redisIndexingService.indexFuleStation(fuleStationDoc);
			}
		} catch (err) {
			next(err);
		}
	}
	/**
	 * This function create for user authentication
	 * @param {object} req
	 * @param {object} res
	 * @param {function} next
	 */
	async login(req, res, next) {
		try {
			const role = req.body.role.toUpperCase();
			const password = req.body.password;
			const { user } = res.locals;
			await passwordService.verifyPassword(password, user.passwordHash);
			const token = await jwtService.generateToken({
				userId: user.id,
				username: user.name,
				role: role.toUpperCase(),
			});

			await tokenService.setToken(
				user.id,
				role.toUpperCase(),
				token,
				authConfig.tokenExpiry
			);
			res.locals.response = {
				body: {
					user: {
						token: token,
						name: user.name,
					},
				},
				message: stringConstant.userControllerMessage.LOGGED_IN,
			};
			next();
		} catch (err) {
			next(err);
		}
	}

	/**
	 * This function create for search fule staion nearby
	 * @param {object} req
	 * @param {object} res
	 * @param {fuction} next
	 */
	async searchFuleStation(req, res, next) {
		try {
			let fuleId = req.body.fule;
			let latitude = res.locals.locationLatitude;
			let longitude = res.locals.locationLongitude;
			let fuleStationDetails = [];

			let params = {
				latitude: parseFloat(latitude),
				longitude: parseFloat(longitude),
				searchingRadius: fuleStationSearchRadius.searchRadius,
				setName: "FULE_STATION",
			};

			const fuleStationWithDistance = await redisService.getNearby(params);
			const fuleStationIds = fuleStationWithDistance.map((fuleStation) => {
				return fuleStation.key;
			});

			try {
				fuleStationDetails = await redisService.getHash(
					stringConstant.redisSets.FULE_STATION_DETAILS_SET,
					fuleStationIds
				);
			} catch (err) {
				//
			}

			let fuleStations = [];

			for (let itr = 0; itr < fuleStationDetails.length; itr++) {
				const fuleStation = fuleStationWithDistance[itr];

				const fulesStationDetails = JSON.parse(fuleStationDetails[itr]);

				/**
				 * check if fule station has fule type
				 */
				if (
					fuleId !== 0 &&
					!fulesStationDetails.fule.some((fuleStationFuleType) => {
						return parseInt(fuleStationFuleType) === fuleId;
					})
				) {
					continue;
				}

				if (fuleStation.distance - fulesStationDetails.serviceRadius <= 0) {
					fuleStations.push({
						id: fulesStationDetails.userId,
						name: fulesStationDetails.name,
						fule: fulesStationDetails.fule,
						location: [fuleStation.latitude, fuleStation.longitude],
					});
				}
			}

			const blockerFuleStations = await userDAO.getAllBlockerFuleStationId(
				res.locals.user.userId
			);

			const blockerFuleStationsIds = blockerFuleStations.map(
				(element) => element.blockerUserId
			);

			const afterRemovedBlockerFuleStations = fuleStations.filter((element) => {
				return !blockerFuleStationsIds.includes(element.id);
			});
			let message = templateConstant.LIST_OF("fule station");

			if (utility.isArrayNullOrEmpty(fuleStations)) {
				message =
					stringConstant.userControllerMessage.NO_FULE_STATION_AVAILABLE;
			}
			res.locals.response = {
				body: {
					fuleStations: afterRemovedBlockerFuleStations,
				},
				message,
			};
			next();
		} catch (err) {
			next(err);
		}
	}
	/**
	 * This function create for book fule station
	 * @param {object} req
	 * @param {object} res
	 * @param {function} next
	 */
	async bookFuleStation(req, res, next) {
		try {
			const fuleStation = req.body.fule_station;
			const schedule = req.body.schedule; //2020-07-16 18:28:00.658+05:30 in this format
			const fuleId = req.body.fule_id;

			const params = {
				fuleStationId: fuleStation,
				bookingDate: schedule,
				fuleId: fuleId,
				customerId: res.locals.user.userId,
			};
			const fuleBooking = await userDAO.bookFuleStation(params);
			res.locals.response = {
				body: {
					booking_id: fuleBooking.id,
					schedule: fuleBooking.bookingDate,
				},
				message: stringConstant.userControllerMessage.FULE_STATION_BOOKED,
			};
			next();
		} catch (err) {
			console.log(err);
			next(err);
		}
	}
	/**
	 *This function create for get fule station bookings
	 * @param {object} req
	 * @param {object} res
	 * @param {object} next
	 */
	async getBookings(req, res, next) {
		try {
			const bookings = await userDAO.getFuleStationBookings(
				res.locals.user.userId
			);
			const blockedUsers = await userDAO.getBlockedUserWithBlockerId(
				res.locals.user.userId
			);
			const blockedUserId = blockedUsers.map((values) => values.blockedUserId);

			const unblockUser = bookings.filter((element) => {
				return !blockedUserId.includes(element.user.id);
			});

			const booking = unblockUser.map((value) => {
				return {
					customerName: value.user.name,
					customerEmail: value.user.email,
					customerPicture: value.user.pictureUrl,
					schedule: value.bookingDate,
				};
			});

			let message = stringConstant.userControllerMessage.NO_BOOKINGS;
			if (!utility.isArrayNullOrEmpty(booking)) {
				message = templateConstant.LIST_OF("bookings");
			}
			res.locals.response = {
				body: {
					bookings: booking,
				},
				message,
			};
			next();
		} catch (err) {
			console.log(err);
			next(err);
		}
	}
	/**
	 * This function create for uload profile pic
	 * @param {object} req
	 * @param {object} res
	 * @param {function} next
	 */
	async profilePic(req, res, next) {
		try {
			await userDAO.updateUserProfile(
				res.locals.user.userId,
				req.file.originalname
			);
			res.locals.response = {
				message: stringConstant.userControllerMessage.FILE_UPLOADED_SUCCESFULLY,
			};
			next();
		} catch (err) {
			console.log(err);
			next(err);
		}
	}
}

const userController = (userRouter) => {
	return new UserController(userRouter);
};

module.exports = {
	UserController,
	userController,
};
