/** @format */

"use strict";

module.exports = (sequelize, DataTypes) => {
	const user2fule_type = sequelize.define(
		"user2fule_type",
		{
			fuleStationId: {
				type: DataTypes.UUID,
				field: "fule_station_id",
			},
			fuleId: {
				type: DataTypes.INTEGER,
				field: "fule_id",
			},
		},
		{ underscored: true }
	);
	user2fule_type.associate = function (models) {
		// associations can be defined here
		user2fule_type.belongsTo(models.fule_type, {
			foreignKey: "fuleId",
		});
	};

	return user2fule_type;
};
