const express = require('express');
const router = express.Router();

const author_controller = require('../controllers/authorController');

const author_validator = require('../middlewares/authorValidator');
const { validate } = require('../middlewares/validate');

// POST request for creating Author.
router.post('/author/create', author_validator.validator, validate, author_controller.author_create);

// DELTE request to delete Author.
router.delete('/author/:id', author_controller.author_delete);

// PUT request to update Author.
router.put('/author/:id', author_validator.validator, validate, author_controller.author_update);

// GET request for one Author.
router.get('/author/:id', author_controller.author_detail);

// GET request for list of all Authors.
router.get('/authors', author_controller.author_list);

module.exports = router;