/** @format */

"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable("user2fule_type", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			fule_station_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "user",
					key: "id",
				},
			},
			fule_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "fule_type",
					key: "id",
				},
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
		return queryInterface.dropTable("user2fule_type");
	},
};
