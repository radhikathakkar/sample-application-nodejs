const express = require('express');
const router = express.Router();
const { getDataHandler, createHateRateHandler, getHearRatesHandler, createHateRateBulkHandler } = require('../contollers/common.controller');

// Get heart rate data with all other metrics using normal array funcitions
router.get('/heart-rates', getHearRatesHandler);

// post heart rates value to postgresql
router.post('/heart-rates', createHateRateHandler);

// post heart rates in bulk to postgresql
router.post('/heart-rates-bulk', createHateRateBulkHandler);

// post heart rates in bulk to postgresql
router.get('/heart-rates-sample', getDataHandler);
module.exports = router;
