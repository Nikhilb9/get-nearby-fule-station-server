/** @format */

const genericMessage = {
	SERVER_ERROR: "Server Error",
	USER_EXISTS: "You are already registered. Please login to continue.",
	DUPLICATE_VALUE: "Duplicate values",
	USER_NOT_REGISTERED_WITH_THIS_ROLE: "You are not registered with this role",
	ACCOUNT_DEACTIVATED:
		"Your account has been deactivated please contact to nikhil baisoya",
};

const redisServiceMessage = {
	KEY_DOES_NOT_EXIST: "Key doesn't exist",
	REDIS_ERROR: "Redis Error",
	KEY_IS_INVALID: "Please provide key",
	VALUE_IS_INVALID: "Please provide value",
};

const passwordServiceMessage = {
	WRONG_PASSWORD: "Wrong Password",
	PASSWORD_MATCHED: "Password matched",
};

const authServiceMessage = {
	UNAUTHORIZED_PLATFORM: "Unauthorized Platform",
	UNAUTHORIZED_CLIENT: "Unauthorized Client",
	TOKEN_VERIFIED: "Token verified",
	TOKEN_EXPIRED: "Token has expired. Login to continue",
};

const tokenServiceMessage = {
	USER_ID_DOES_NOT_EXIST: "User ID doesn't exist",
	USER_ID_IS_INVALID: "Please provide User ID",
	TOKEN_IS_INVALID: "Please provide token",
};

const userControllerMessage = {
	REGISTERED: "Successfully registered",
	LOGGED_OUT: "Successfully logged out",
	LOGGED_IN: "Successfully logged in",
	USER_DOESNT_EXIST: "User does not exist",
	NO_FULE_STATION_AVAILABLE:
		"No fule station available for your search criteria",
	FULE_STATION_BOOKED: "Fule station booked",
	ALLREADY_BOOKED_ON_THIS_SCHEDULE:
		"Fule station has been allready booked on this schedule",
	CAN_NOT_BOOK_THIS_FULE_STATION:
		"You can not book this fule station because you are blocked by this fule station",
	NO_BOOKINGS: "You have not any booking",
	FILE_UPLOADED_SUCCESFULLY: "File upload successfully",
};

const redisSets = {
	FULE_STATION_DETAILS_SET: "fule_station_details",
};

module.exports = {
	redisServiceMessage,
	authServiceMessage,
	tokenServiceMessage,
	passwordServiceMessage,
	userControllerMessage,
	genericMessage,
	redisSets,
};
