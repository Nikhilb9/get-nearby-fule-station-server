/** @format */

const redis = require("ioredis");
const { redisConfig } = require("../config/config");
const constant = require("../common/stringConstant").redisServiceMessage;
const nikhilError = require("../common/nikhilError").nikhilError;
const client = new redis(redisConfig.port, redisConfig.host);

class RedisService {
	setWithExpiry(key, value, expiryTime) {
		return new Promise((resolve, reject) => {
			client
				.set(key, value)
				.then((success) => {
					client.expire(key, expiryTime, (err) => {
						if (err) {
							reject(err);
						} else {
							resolve(success);
						}
					});
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	get(key) {
		return new Promise((resolve, reject) => {
			if (key) {
				client.get(key, (err, reply) => {
					if (err) {
						reject(err);
					} else {
						if (reply === null) {
							reject(nikhilError(constant.KEY_DOES_NOT_EXIST, 400, 1101));
						} else resolve(reply);
					}
				});
			} else {
				reject(nikhilError(constant.KEY_IS_INVALID, 400, 1101));
			}
		});
	}

	/**
	 * This method is used to add a geospatial index in the redis in a given set
	 * @param {object} params - all the location info and the set which is to be stored in redis as geospatial indexes
	 */
	addDataWithLocation(params) {
		return new Promise((resolve, reject) => {
			const { key, longitude, latitude, setName } = params;

			client.geoadd(setName, longitude, latitude, key, (err, reply) => {
				if (err) {
					reject(err);
				}

				resolve(reply);
			});
		});
	}

	/**
	 * This fuction is used to fetch all the the indexes within a radius
	 * of the given latitude and longitude in a required set in redis
	 * @param {object} params - constains all the location information and the set(in redis)
	 */
	getNearby(params) {
		return new Promise((resolve, reject) => {
			const { latitude, longitude, setName, searchingRadius } = params;
			client.georadius(
				setName,
				longitude,
				latitude,
				searchingRadius,
				"mi",
				"WITHDIST",
				"WITHCOORD",
				(err, reply) => {
					if (err) {
						reject(err);
					}
					let locations = [];
					reply.forEach((location) => {
						locations.push({
							key: location[0],
							distance: location[1],
							longitude: location[2][0],
							latitude: location[2][1],
						});
					});
					resolve(locations);
				}
			);
		});
	}

	/**
	 * Set a value against a field in the key hash
	 * @param {string} key - hash key
	 * @param {string} field - field in the hash key
	 * @param {Json string} value - value for a field in the hash key
	 */
	setHash(key, field, value) {
		return new Promise((resolve, reject) => {
			client.hset(key, field, value, (err, reply) => {
				if (err) {
					reject(err);
				}
				resolve(reply);
			});
		});
	}
	/**
	 * Get all the values for the fields in the hash key
	 * @param {string} key - hash key
	 * @param {array of strings} fields - fields in the hash key
	 */
	getHash(key, fields) {
		return new Promise((resolve, reject) => {
			client.hmget(key, fields, (err, reply) => {
				if (err) {
					reject(err);
				}
				resolve(reply);
			});
		});
	}
}

module.exports = new RedisService();
