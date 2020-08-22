/** @format */

const NikhilError = require("../common/nikhilError").NikhilError;
const moment = require("moment");

const isNullOrUndefined = (param) => {
	if (param === null || param === undefined) {
		return true;
	}
	return false;
};

const isString = (str) => {
	return typeof str === "string" && str.trim().length > 0;
};

const isEmailValid = (email) => {
	// eslint-disable-next-line no-control-regex
	let emailValidator = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
	if (!emailValidator.test(email)) {
		return false;
	}
	return true;
};

const isArrayNullOrEmpty = (param) => {
	if (!param || !param.length) {
		return true;
	}
	return false;
};

const isNikhilError = (err) => {
	return err instanceof NikhilError;
};

const isNumber = (num) => {
	return typeof num === "number" ? true : false;
};

const isValidLatitude = (latitude) => {
	let isValid = false;
	if (!isNullOrUndefined(latitude)) {
		isValid = Number(latitude) > -90 && Number(latitude) < 90;
	}
	return isValid;
};

const isValidLongitude = (longitude) => {
	let isValid = false;
	if (!isNullOrUndefined(longitude)) {
		isValid = Number(longitude) > -180 && Number(longitude) < 180;
	}
	return isValid;
};

const isFutureTime = (date) => {
	return moment(date).isAfter(moment());
};

module.exports = {
	isNullOrUndefined,
	isEmailValid,
	isArrayNullOrEmpty,
	isNumber,
	isString,
	isValidLatitude,
	isValidLongitude,
	isNikhilError,
	isFutureTime,
};
