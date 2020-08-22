/** @format */

"use strict";

module.exports = (sequelize, DataTypes) => {
	const profile_status = sequelize.define(
		"profile_status",
		{
			status: DataTypes.STRING,
		},
		{ underscored: true }
	);
	profile_status.associate = function (models) {
		// associations can be defined here
	};
	return profile_status;
};
