const validator = require('express-validator');

exports.validator = [

    validator
        .body('book', 'Book must be specified')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    validator
        .body('imprint', 'Imprint must be specified')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    validator
        .body('status', 'Status must be specified')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    validator
        .body('due_back', 'Invalid date')
        .optional({ checkFalsy: true })
        .isISO8601()
        .escape()
]