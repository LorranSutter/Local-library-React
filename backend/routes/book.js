const express = require('express');
const router = express.Router();

const book_controller = require('../controllers/bookController');

const book_validator = require('../middlewares/bookValidator');
const { validate } = require('../middlewares/validate');

// GET catalog home page.
router.get('/', book_controller.index);

// POST request for creating Book.
router.post('/book/create', book_validator.validator, validate, book_controller.book_create);

// DELETE request to delete Book.
router.delete('/book/:id', book_controller.book_delete);

// PUT request to update Book.
router.put('/book/:id', book_controller.book_update);

// GET request for one Book.
router.get('/book/:id', book_controller.book_detail);

// GET request for list of all Book items.
router.get('/books', book_controller.book_list);

module.exports = router;