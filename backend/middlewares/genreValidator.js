const validator = require('express-validator');

exports.validator = [

    // Validate that the name field is not empty.
    validator
        .body('name', 'Genre name required')
        .trim()
        .isLength({ min: 1 })
        .escape()
]