// To handle database query we can write code here

const sequelize = require('../db/config');
const { QueryTypes } = require('sequelize');
const HeartRate = require('../models/heartrate.models');

const createHeartRate = async params => {
	const data = await HeartRate.create(params);
	return data;
};

const findMinMaxHeartRates = async (currentTime, interval) => {
	const minReadingQuery = `
      SELECT MIN(measurement) as min_value
      FROM "HeartRates"
      WHERE on_date >= '${currentTime.toISOString()}' AND on_date < '${new Date(currentTime.getTime() + interval).toISOString()}'
    `;
	const maxReadingQuery = `
      SELECT MAX(measurement) as max_value
      FROM "HeartRates"
      WHERE on_date >= '${currentTime.toISOString()}' AND on_date < '${new Date(currentTime.getTime() + interval).toISOString()}'
    `;

	const min = await sequelize.query(minReadingQuery, { type: QueryTypes.SELECT });
	const max = await sequelize.query(maxReadingQuery, { type: QueryTypes.SELECT });

	return {
		min: min[0].min_value ? min[0].min_value : 0,
		max: max[0].max_value ? max[0].max_value : 0
	};
};

const createBulkHeartRate = async data => {
	const response = await HeartRate.bulkCreate(data);
	return response;
};

module.exports = {
	createHeartRate,
	findMinMaxHeartRates,
	createBulkHeartRate
};
