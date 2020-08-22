/** @format */

"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable("user_role", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			role: {
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
		return queryInterface.dropTable("user_role");
	},
};
