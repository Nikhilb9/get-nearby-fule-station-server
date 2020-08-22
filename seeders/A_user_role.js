/** @format */

"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert(
			"user_role",
			[
				{
					role: "FULE_STATION",
				},
				{
					role: "CUSTOMER",
				},
			],
			{}
		);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("user_role", null, {});
	},
};
