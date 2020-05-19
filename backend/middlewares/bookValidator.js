const validator = require('express-validator');

exports.validator = [

    validator
        .body('title', 'Title must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    validator
        .body('author', 'Author must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    validator
        .body('summary', 'Summary must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    validator
        .body('isbn', 'ISBN must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape()
]