const express = require('express');

const router = express.Router();
const commonRoute = require('./common.route');

router.use('/common', commonRoute);

module.exports = router;
