const async = require('async');
const validator = require('express-validator');

const Book = require('../models/book');
const Author = require('../models/author');

// TODO Turn author list into API
// Display list of all Authors.
exports.author_list = function (req, res, next) {

    Author.find()
        .populate('author')
        .sort([['family_name', 'ascending']])
        .exec(function (err, list_authors) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('author_list', { title: 'Author List', author_list: list_authors });
        });

};

// TODO Turn author detail into API
// Display detail page for a specific Author.
exports.author_detail = function (req, res, next) {

    async.parallel({
        author: function (callback) {
            Author.findById(req.params.id)
                .exec(callback)
        },
        authors_books: function (callback) {
            Book.find({ 'author': req.params.id }, 'title summary')
                .exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.author == null) { // No results.
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books });
    });

};

// TODO Turn author create get into API
// Display Author create form on GET.
exports.author_create_get = function (req, res, next) {
    res.render('author_form', { title: 'Create Author' });
};

// TODO Turn author create post into API
// TODO Move author create post to middleware
// Handle Author create on POST.
exports.author_create_post = [

    // Validate fields.
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
        .escape(),

    // Sanitize fields.
    // validator.sanitizeBody('first_name').escape(),
    // validator.sanitizeBody('family_name').escape(),
    // validator.sanitizeBody('date_of_birth').toDate(),
    // validator.sanitizeBody('date_of_death').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an Author object with escaped and trimmed data.
            var author = new Author(
                {
                    first_name: req.body.first_name,
                    family_name: req.body.family_name,
                    date_of_birth: req.body.date_of_birth,
                    date_of_death: req.body.date_of_death
                });
            author.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(author.url);
            });
        }
    }
];

// TODO Turn author delete get into API
// Display Author delete form on GET.
exports.author_delete_get = function (req, res, next) {

    async.parallel({
        author: function (callback) {
            Author.findById(req.params.id).exec(callback)
        },
        authors_books: function (callback) {
            Book.find({ 'author': req.params.id }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.author == null) { // No results.
            res.redirect('/catalog/authors');
        }
        // Successful, so render.
        res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books });
    });

};

// TODO Turn author delete post into API
// Handle Author delete on POST.
exports.author_delete_post = function (req, res, next) {

    async.parallel({
        author: function (callback) {
            Author.findById(req.body.authorid).exec(callback)
        },
        authors_books: function (callback) {
            Book.find({ 'author': req.body.authorid }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // Success
        if (results.authors_books.length > 0) {
            // Author has books. Render in same way as for GET route.
            res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books });
            return;
        }
        else {
            // Author has no books. Delete object and redirect to the list of authors.
            Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
                if (err) { return next(err); }
                // Success - go to author list
                res.redirect('/catalog/authors')
            })
        }
    });
};

// TODO Turn author update get into API
// Display Author update form on GET.
exports.author_update_get = function (req, res) {

    // Get author for form.
    async.parallel({
        author: function (callback) {
            Author.findById(req.params.id).exec(callback);
        }
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.author == null) { // No results.
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        // Success
        res.render('author_form', { title: 'Update Author', author: results.author });
    });

};

// TODO Turn author update post into API
// TODO Move author update post to middleware
// Handle Author update on POST.
exports.author_update_post = [

    // Validate fields.
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
        .escape(),

    // Sanitize fields.
    // validator.sanitizeBody('first_name').escape(),
    // validator.sanitizeBody('family_name').escape(),
    // validator.sanitizeBody('date_of_birth').toDate(),
    // validator.sanitizeBody('date_of_death').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validator.validationResult(req);

        // Create a author object with escaped and trimmed data.
        var author = new Author(
            {
                _id: req.params.id, //This is required, or a new ID will be assigned!
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('author_form', { title: 'Update Author', author: author, errors: errors.array() });
            return;
        } else {
            // Data from form is valid. Update the record.
            Author.findByIdAndUpdate(req.params.id, author, {}, function (err, theauthor) {
                if (err) { return next(err); }
                // Successful - redirect to author detail page.
                res.redirect(theauthor.url);
            });
        }
    }
];