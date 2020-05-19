const validator = require('express-validator');

exports.validator = [

    validator
        .body('name', 'Genre name required')
        .trim()
        .isLength({ min: 1 })
        .escape()
]