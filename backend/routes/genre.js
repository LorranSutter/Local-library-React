const express = require('express');
const router = express.Router();

const genre_controller = require('../controllers/genreController');

const genre_validator = require('../middlewares/genreValidator');
const { validate } = require('../middlewares/validate');

//POST request for creating Genre.
router.post('/genre/create', genre_validator.validator, validate, genre_controller.genre_create);

// DELETE request to delete Genre.
router.delete('/genre/:id', genre_controller.genre_delete);

// PUT request to update Genre.
router.put('/genre/:id', genre_validator.validator, validate, genre_controller.genre_update);

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);

module.exports = router;