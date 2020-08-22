/** @format */

var compile = require("string-template/compile");

module.exports = {
	INVALID: compile("Invalid {0}"),
	LIST_OF: compile("List of {0}"),
	PARAMETER_MISSING: compile("Parameter {0} is missing"),
	DUPLICATE_VALUE: compile("Duplicate {0}"),
	ADDED_SUCCESSFULLY: compile("{0} added successfully"),
};
