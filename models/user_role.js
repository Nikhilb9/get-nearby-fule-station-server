/** @format */

"use strict";

module.exports = (sequelize, DataTypes) => {
	const user_role = sequelize.define(
		"user_role",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
			},
			role: DataTypes.STRING,
		},
		{ underscored: true }
	);
	user_role.associate = function (models) {
		// associations can be defined here
	};

	return user_role;
};
