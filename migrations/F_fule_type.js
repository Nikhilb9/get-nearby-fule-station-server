/** @format */

"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable("fule_type", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},

			fule: {
				type: Sequelize.STRING(20),
				allowNull: false,
			},

			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(3)"),
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(3)"),
			},
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable("fule_type");
	},
};
