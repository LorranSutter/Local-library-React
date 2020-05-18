const validator = require('express-validator');

exports.validator = [

    validator
        .body('first_name')
        .isLength({ min: 1 })
        .trim()
        .withMessage('First name must be specified.')
        .isAlphanumeric()
        .withMessage('First name has non-alphanumeric characters.')
        .escape(),
    validator
        .body('family_name')
        .isLength({ min: 1 })
        .trim()
        .withMessage('Family name must be specified.')
        .isAlphanumeric()
        .withMessage('Family name has non-alphanumeric characters.')
        .escape(),
    validator
        .body('date_of_birth', 'Invalid date of birth')
        .optional({ checkFalsy: true })
        .isISO8601()
        .escape(),
    validator
        .body('date_of_death', 'Invalid date of death')
        .optional({ checkFalsy: true })
        .isISO8601()
        .escape()
]