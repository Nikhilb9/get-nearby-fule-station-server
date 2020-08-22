/** @format */
const models = require("../../models/index");
const SequelizeOperator = require("sequelize").Op;

class UserDAO {
	async getUserRoleWithRole(role) {
		return await models.user_role.findOne({ where: { role: role } });
	}
	async getUserWithEmail(email) {
		return await models.user.findOne({
			where: { email: email },
			include: [
				{
					model: models.profile_status,
				},
			],
		});
	}

	async getUserWithUserIdAndRoleId(userId, userRoleId) {
		return await models.user.findOne({
			where: { id: userId, userRoleId: userRoleId },
		});
	}

	async getFulesWithId(fules) {
		return await models.fule_type.findAll({
			where: { fule: { [SequelizeOperator.in]: fules } },
			attributes: ["id", "fule"],
		});
	}

	async getFuleById(fuleId) {
		return await models.fule_type.findOne({ where: { id: fuleId } });
	}

	async getProfileStatusWithStatus(profileStatus) {
		return await models.profile_status.findOne({
			where: { status: profileStatus },
			attributes: ["id"],
		});
	}
	async createUser(params) {
		try {
			const profileStatusId = await this.getProfileStatusWithStatus("ACTIVATE");
			return await models.user.create({
				email: params.email,
				passwordHash: params.passwordHash,
				profileStatusId: profileStatusId.id,
				name: params.name,
				userRoleId: params.userRoleId,
				locationLatitude: params.locationLatitude,
				locationLongitude: params.locationLongitude,
			});
		} catch (err) {
			throw err;
		}
	}

	async addFulesTypeToUser(userId, fuleIds) {
		try {
			const promises = [];
			fuleIds.forEach((element) => {
				promises.push(
					models.user2fule_type.create({
						fuleStationId: userId,
						fuleId: element,
					})
				);
			});
			await Promise.all(promises);
		} catch (err) {
			throw err;
		}
	}
	async getUserWithUserId(userId) {
		return await models.user.findOne({ where: { id: userId } });
	}
	async bookFuleStation(params) {
		return await models.bookings.create({
			fuleStationId: params.fuleStationId,
			customerId: params.customerId,
			fuleId: params.fuleId,
			bookingDate: params.bookingDate,
		});
	}

	async getFuleStationBooking(bookingDate, fuleId, fuleStationId) {
		return await models.bookings.findOne({
			where: {
				fuleStationId: fuleStationId,
				bookingDate: bookingDate,
				fuleId: fuleId,
			},
		});
	}
	async getFuleStationBlockedUser(fuleStationId, customerId) {
		return await models.blocked_users.findOne({
			where: { blockerUserId: fuleStationId, blockedUserId: customerId },
		});
	}

	async getAllBlockerFuleStationId(customerId) {
		return await models.blocked_users.findAll({
			where: {
				blockedUserId: customerId,
			},
		});
	}
	async getFuleStationBookings(fuleStationId) {
		try {
			const profileStatusId = await this.getProfileStatusWithStatus("ACTIVATE");
			return await models.bookings.findAll({
				where: {
					fuleStationId: fuleStationId,
				},
				include: [
					{
						model: models.user,
						where: { profileStatusId: profileStatusId.id },
						raw: true,
					},
				],
			});
		} catch (err) {
			throw err;
		}
	}
	async getBlockedUserWithBlockerId(blockerId) {
		return await models.blocked_users.findAll({
			where: { blockerUserId: blockerId },
			raw: true,
		});
	}

	async updateUserProfile(userId, profilePic) {
		return await models.user.update(
			{ pictureUrl: profilePic },
			{
				where: { id: userId },
			}
		);
	}
}

const userDao = new UserDAO();

module.exports = userDao;
