/** @format */

"use strict";

module.exports = (sequelize, DataTypes) => {
	const user = sequelize.define(
		"user",
		{
			id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			name: DataTypes.STRING,
			email: DataTypes.STRING,
			passwordHash: {
				type: DataTypes.STRING,
				field: "password_hash",
			},
			pictureUrl: {
				type: DataTypes.STRING,
				field: "picture_url",
			},
			locationLatitude: {
				type: DataTypes.DECIMAL,
				field: "location_latitude",
			},
			locationLongitude: {
				type: DataTypes.DECIMAL,
				field: "location_longitude",
			},
			profileStatusId: {
				type: DataTypes.INTEGER,
				field: "profile_status_id",
			},
			userRoleId: {
				type: DataTypes.INTEGER,
				field: "user_role_id",
			},
		},
		{ underscored: true }
	);
	user.associate = function (models) {
		// associations can be defined here
		user.belongsTo(models.profile_status, {
			foreignKey: "profileStatusId",
		});
		user.belongsTo(models.user_role, {
			foreignKey: "userRoleId",
		});

		user.hasMany(models.user2fule_type, {
			foreignKey: "fuleStationId",
		});
	};
	return user;
};
