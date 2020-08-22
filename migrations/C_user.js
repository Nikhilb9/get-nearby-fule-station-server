/** @format */

"use strict";
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable("user", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			email: {
				allowNull: false,
				type: Sequelize.STRING,
				unique: true,
			},
			password_hash: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			picture_url: {
				type: Sequelize.STRING,
				defaultValue: null,
			},
			user_role_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "user_role",
					key: "id",
				},
			},
			location_latitude: {
				type: Sequelize.DECIMAL(9, 6),
				defaultValue: null,
			},
			location_longitude: {
				type: Sequelize.DECIMAL(9, 6),
				defaultValue: null,
			},
			profile_status_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "profile_status",
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
		return queryInterface.dropTable("user");
	},
};
