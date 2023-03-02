const responseHelper = require('../helpers/response');
const { COMMON, errorMessages } = require('../helpers/responseMessage');
const { createHeartRate, findMinMaxHeartRates, createBulkHeartRate } = require('../services/heartRate.service');
const fs = require('fs');
const path = process.cwd();

const getHearRatesHandler = async (req, res, next) => {
	try {
		const filePath = `${path}/clinical_metrics.json`;
		let fileData = fs.readFileSync(filePath);
		fileData = JSON.parse(fileData);
		if (!fileData) {
			return responseHelper.badRequestError(res, COMMON.NOT_FOUND);
		}
		if (!Object.keys(fileData.clinical_data).length) {
			return responseHelper.badRequestError(res, COMMON.NOT_FOUND);
		}
		const heartRateData = fileData.clinical_data.HEART_RATE.data;
		if (!heartRateData.length) {
			return responseHelper.badRequestError(res, COMMON.NOT_FOUND);
		}
		const { groupedData, aggregatedData } = heartRateData.reduce(
			(result, currentValue) => {
				const measurementDate = new Date(currentValue.on_date);
				const interval = Math.floor(measurementDate.getMinutes() / 15);
				const measurementTime = new Date(measurementDate.getFullYear(), measurementDate.getMonth(), measurementDate.getDate(), measurementDate.getHours(), interval * 15, 0, 0);
				let nextMeasurementDate = new Date(measurementTime);
				nextMeasurementDate = new Date(nextMeasurementDate.setMinutes(nextMeasurementDate.getMinutes() + 15)).toISOString();
				let date = measurementTime.toISOString();
				const measurementIndex = result.groupedData.findIndex(item => item.on_date === date);
				if (measurementIndex >= 0) {
					result.groupedData[measurementIndex].measurement.push(currentValue.measurement);
					result.aggregatedData[measurementIndex] = {
						from_date: date,
						to_date: nextMeasurementDate,
						min: Math.min(...result.groupedData[measurementIndex].measurement),
						max: Math.max(...result.groupedData[measurementIndex].measurement)
					};
				} else {
					result.groupedData.push({
						on_date: date,
						measurement: [currentValue.measurement]
					});
					result.aggregatedData.push({
						from_date: date,
						to_date: nextMeasurementDate,
						min: Math.min(currentValue.measurement),
						max: Math.max(currentValue.measurement)
					});
				}
				return result;
			},
			{ groupedData: [], aggregatedData: [] }
		);
		const heartRate = {
			count: aggregatedData.length,
			data: aggregatedData
		};
		let otherMetrics = {};

		for (let key in fileData.clinical_data) {
			if (key !== 'HEART_RATE') {
				otherMetrics[key] = fileData.clinical_data[key];
			}
		}
		const response = {
			HEART_RATE: heartRate,
			...otherMetrics
		};
		return responseHelper.success(res, COMMON.FETCH_SUCCESS, response);
	} catch (error) {
		return responseHelper.serverError(res, error);
	}
};

const getDataHandler = async (req, res, next) => {
	try {
		const { from_date, to_date } = req.query;

		if(!from_date || !to_date) {
			return responseHelper.badRequestError(res, errorMessages.VERIFY_BODY)
		}
		// Aggregate heart rate data in 15-minute intervals
		const startTime = new Date(from_date);
		const endTime = new Date(to_date);
		const interval = 15 * 60 * 1000; // 15 minutes in milliseconds
		let currentTime = startTime;
		let response = {}
		while (currentTime < endTime) {
			let resp = await findMinMaxHeartRates(currentTime, interval);
			let date = currentTime.toISOString();
			response[date] = {
				...resp
			}
			currentTime = new Date(currentTime.getTime() + interval);
		}
		return responseHelper.success(res, COMMON.FETCH_SUCCESS, response);
	} catch (error) {
		return responseHelper.serverError(res, error);
	}
};

const createHateRateHandler = async (req, res, next) => {
	try {
		const { measurement, on_date } = req.body;
		const params = {
			measurement,
			on_date
		};
		const data = await createHeartRate(params);
		if (!data) {
			return responseHelper.badRequestError(res, errorMessages.BAD_REQUEST, data);
		}
		return responseHelper.success(res, COMMON.CREATED_SUCCESS, data);
	} catch (error) {
		return responseHelper.serverError(res, error);
	}
};

const createHateRateBulkHandler = async (req, res, next) => {
	try {
		const { heartRateData } = req.body;
		let data;
		if(Array.isArray(heartRateData)) {
			data = await createBulkHeartRate(heartRateData);
		}
		if (!data) {
			return responseHelper.badRequestError(res, errorMessages.BAD_REQUEST);
		}
		return responseHelper.success(res, COMMON.CREATED_SUCCESS, data);
	} catch (error) {
		return responseHelper.serverError(res, error);
	}
};

module.exports = {
	createHateRateHandler,
	getHearRatesHandler,
	getDataHandler,
	createHateRateBulkHandler
};
