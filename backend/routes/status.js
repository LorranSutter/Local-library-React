const express = require('express');
const router = express.Router();

const status_controller = require('../controllers/statusController');

// GET request for list of all Status
router.get('/status', status_controller.status_list);

module.exports = router;