const express = require('express');
const router = express.Router();

const book_controller = require('../controllers/catalogController');

router.get('/', book_controller.index);

router.get('/catalog', book_controller.index);

module.exports = router;
