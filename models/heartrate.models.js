/* eslint-disable func-names */
const sequelize = require('../db/config');
const { DataTypes } = require('sequelize');

const HeartRate = sequelize.define('HeartRate', {
	measurement: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	on_date: {
		type: DataTypes.DATE,
		allowNull: false
	}
});

module.exports = HeartRate;
