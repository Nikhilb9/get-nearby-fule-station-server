/** @format */

const redisService = require("./redisService");
const stringConstant = require("../common/stringConstant");

class RedisIndexingService {
	async indexFuleStation(fuleStation) {
		const setName = "FULE_STATION";

		const fuleStationDetails = {
			userId: fuleStation.userId,
			name: fuleStation.name,
			fule: fuleStation.fule,
			serviceRadius: fuleStation.radius,
		};

		return await Promise.all([
			redisService.addDataWithLocation({
				key: fuleStation.userId,
				longitude: fuleStation.long,
				latitude: fuleStation.lat,
				setName,
			}),
			redisService.setHash(
				stringConstant.redisSets.FULE_STATION_DETAILS_SET,
				fuleStation.userId,
				JSON.stringify(fuleStationDetails)
			),
		]);
	}
}

module.exports = new RedisIndexingService();
