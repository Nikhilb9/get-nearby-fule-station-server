/** @format */

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable("blocked_users", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			blocker_user_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "user",
					key: "id",
				},
			},
			blocked_user_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "user",
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
		return queryInterface.dropTable("bookings");
	},
};
