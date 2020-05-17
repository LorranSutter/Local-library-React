const async = require('async');
const validator = require('express-validator');

const Book = require('../models/book');
const BookInstance = require('../models/bookinstance');

// TODO Turn bookinstance list into API
// Display list of all BookInstances.
exports.bookinstance_list = function (req, res, next) {

    BookInstance.find()
        .populate('book')
        .exec(function (err, list_bookinstances) {
            if (err) { return next(err); }
            // Successful, so render
            res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });
        });
};

// TODO Turn bookinstance detail into API
// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function (req, res, next) {

    BookInstance.findById(req.params.id)
        .populate('book')
        .exec(function (err, bookinstance) {
            if (err) { return next(err); }
            if (bookinstance == null) { // No results.
                var err = new Error('Book copy not found');
                err.status = 404;
                return next(err);
            }
            // Successful, so render.
            res.render('bookinstance_detail', { title: 'Copy: ' + bookinstance.book.title, bookinstance: bookinstance });
        })
};

// TODO Turn bookinstance create get into API
// Display BookInstance create form on GET.
exports.bookinstance_create_get = function (req, res, next) {

    Book.find({}, 'title')
        .exec(function (err, books) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('bookinstance_form', { title: 'Create BookInstance', book_list: books });
        });

};

// TODO Turn bookinstance create post into API
// Handle BookInstance create on POST.
exports.bookinstance_create_post = [

    // Validate fields.
    validator.body('book', 'Book must be specified')
        .trim()
        .isLength({ min: 1 }),
    validator.body('imprint', 'Imprint must be specified')
        .trim()
        .isLength({ min: 1 }),
    validator
        .body('due_back', 'Invalid date')
        .optional({ checkFalsy: true })
        .isISO8601(),

    // Sanitize fields.
    validator.sanitizeBody('book').escape(),
    validator.sanitizeBody('imprint').escape(),
    validator.sanitizeBody('status').trim().escape(),
    validator.sanitizeBody('due_back').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validator.validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        var bookinstance = new BookInstance(
            {
                book: req.body.book,
                imprint: req.body.imprint,
                status: req.body.status,
                due_back: req.body.due_back
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Book.find({}, 'title')
                .exec(function (err, books) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('bookinstance_form', { title: 'Create BookInstance', book_list: books, selected_book: bookinstance.book._id, errors: errors.array(), bookinstance: bookinstance });
                });
            return;
        }
        else {
            // Data from form is valid.
            bookinstance.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new record.
                res.redirect(bookinstance.url);
            });
        }
    }
];

// TODO Turn bookinstance delete get into API
// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function (req, res) {

    async.parallel({
        bookinstance: function (callback) {
            BookInstance.findById(req.params.id).exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); }
        // Successful, so render.
        res.render('bookinstance_delete', { title: 'Delete Book Instance', bookinstance: results.bookinstance });
    });

};

// TODO Turn bookinstance delete post into API
// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function (req, res) {

    async.parallel({
        bookinstance: function (callback) {
            BookInstance.findById(req.body.bookinstanceid).exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); }
        // Delete object and redirect to the list of books instances.
        BookInstance.findByIdAndRemove(req.body.bookinstanceid, function deleteBookInstance(err) {
            if (err) { return next(err); }
            // Success - go to Book instance list
            res.redirect('/catalog/bookinstances')
        })
    });

};

// TODO Turn bookinstance update get into API
// Display BookInstance update form on GET.
exports.bookinstance_update_get = function (req, res) {

    // Get author for form.
    async.parallel({
        bookinstance: function (callback) {
            BookInstance.findById(req.params.id).exec(callback);
        },
        book_list: function (callback) {
            Book.find({}, 'title').exec(callback);
        }
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.bookinstance == null) { // No results.
            var err = new Error('Book instance not found');
            err.status = 404;
            return next(err);
        }
        // Success
        res.render('bookinstance_form', { title: 'Update Book Instance', bookinstance: results.bookinstance, book_list: results.book_list });
    });

};

// TODO Turn bookinstance update post into API
// Handle bookinstance update on POST.
exports.bookinstance_update_post = [

    // Validate fields.
    validator.body('book', 'Book must be specified')
        .trim()
        .isLength({ min: 1 }),
    validator.body('imprint', 'Imprint must be specified')
        .trim()
        .isLength({ min: 1 }),
    validator
        .body('due_back', 'Invalid date')
        .optional({ checkFalsy: true })
        .isISO8601(),

    // Sanitize fields.
    validator.sanitizeBody('book').escape(),
    validator.sanitizeBody('imprint').escape(),
    validator.sanitizeBody('status').trim().escape(),
    validator.sanitizeBody('due_back').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validator.validationResult(req);

        // Create a book instance object with escaped and trimmed data.
        var bookinstance = new BookInstance(
            {
                _id: req.params.id, //This is required, or a new ID will be assigned!
                book: req.body.book,
                imprint: req.body.imprint,
                status: req.body.status,
                due_back: req.body.due_back
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('bookinstance_form', { title: 'Update Book Instance', bookinstance: bookinstance, errors: errors.array() });
            return;
        } else {
            // Data from form is valid. Update the record.
            BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, function (err, thebookinstance) {
                if (err) { return next(err); }
                // Successful - redirect to book instance detail page.
                res.redirect(thebookinstance.url);
            });
        }
    }
];