/** @format */

"use strict";

module.exports = (sequelize, DataTypes) => {
	const blocked_user = sequelize.define(
		"blocked_users",
		{
			blockerUserId: {
				type: DataTypes.UUID,
				field: "blocker_user_id",
			},
			blockedUserId: {
				type: DataTypes.UUID,
				field: "blocked_user_id",
			},
		},
		{ underscored: true }
	);
	blocked_user.associate = function (models) {};
	return blocked_user;
};
