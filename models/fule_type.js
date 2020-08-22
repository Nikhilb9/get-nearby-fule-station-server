/** @format */

"use strict";

module.exports = (sequelize, DataTypes) => {
	const fule_type = sequelize.define(
		"fule_type",
		{
			fule: DataTypes.STRING,
		},
		{ underscored: true }
	);
	fule_type.associate = function (models) {
		// associations can be defined here
	};
	return fule_type;
};
