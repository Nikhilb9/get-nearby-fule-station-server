/** @format */

"use strict";

module.exports = (sequelize, DataTypes) => {
	const bookings = sequelize.define(
		"bookings",
		{
			fuleStationId: {
				type: DataTypes.UUID,
				field: "fule_station_id",
			},
			customerId: {
				type: DataTypes.UUID,
				field: "customer_id",
			},
			bookingDate: {
				type: DataTypes.DATE,
				field: "booking_date",
			},
			fuleId: {
				type: DataTypes.INTEGER,
				field: "fule_id",
			},
		},
		{ underscored: true }
	);
	bookings.associate = function (models) {
		// associations can be defined here
		bookings.belongsTo(models.user, {
			foreignKey: "customerId",
		});
	};
	return bookings;
};
