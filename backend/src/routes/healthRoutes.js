const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

router.post('/data', healthController.saveHealthData);

module.exports = router;
