/** @format */

class NikhilError extends Error {
	constructor(message, statusCode, subCode) {
		super(message);
		this.statusCode = statusCode || 500;
		this.subCode = subCode || -1;
	}
}

const nikhilError = (message, statusCode, subCode) => {
	return new NikhilError(message, statusCode, subCode);
};

module.exports = {
	nikhilError,
	NikhilError,
};
