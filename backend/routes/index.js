const express = require('express');
const router = express.Router();

const catalog_controller = require('../controllers/catalogController');

router.get('/', catalog_controller.index);

router.get('/catalog', catalog_controller.index);

module.exports = router;
