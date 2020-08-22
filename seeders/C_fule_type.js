/** @format */

"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert(
			"fule_type",
			[
				{
					fule: "GAS",
				},
				{
					fule: "DIESEL",
				},
				{
					fule: "PETROL",
				},
			],
			{}
		);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("fule_type", null, {});
	},
};
