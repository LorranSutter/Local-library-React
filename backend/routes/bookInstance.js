const express = require('express');
const router = express.Router();

const book_instance_controller = require('../controllers/bookinstanceController');

const book_instance_validator = require('../middlewares/bookInstanceValidator');
const { validate } = require('../middlewares/validate');

// POST request for creating BookInstance. 
router.post('/bookinstance/create', book_instance_validator.validator, validate, book_instance_controller.bookinstance_create);

// DELETE request to delete BookInstance.
router.delete('/bookinstance/:id', book_instance_controller.bookinstance_delete);

// PUT request to update BookInstance.
router.put('/bookinstance/:id', book_instance_validator.validator, validate, book_instance_controller.bookinstance_update);

// GET request for one BookInstance.
router.get('/bookinstance/:id', book_instance_controller.bookinstance_detail);

// GET request for list of all BookInstance.
router.get('/bookinstances', book_instance_controller.bookinstance_list);

module.exports = router;