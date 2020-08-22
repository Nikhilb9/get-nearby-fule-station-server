/** @format */

"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert(
			"profile_status",
			[
				{
					status: "ACTIVATE",
				},
				{
					status: "DEACTIVATE",
				},
			],
			{}
		);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("profile_status", null, {});
	},
};
