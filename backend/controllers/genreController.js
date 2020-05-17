const async = require('async');
const validator = require('express-validator');

const Genre = require('../models/genre');
const Book = require('../models/book');

// TODO Turn genre list into API
// Display list of all Genre.
exports.genre_list = function (req, res, next) {

    Genre.find()
        .sort([['name']])
        .exec(function (err, list_genres) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('genre_list', { title: 'Genre List', genre_list: list_genres });
        });
};

// TODO Turn genre detail into API
// Display detail page for a specific Genre.
exports.genre_detail = function (req, res, next) {

    async.parallel({
        genre: function (callback) {
            Genre.findById(req.params.id)
                .exec(callback);
        },

        genre_books: function (callback) {
            Book.find({ 'genre': req.params.id })
                .exec(callback);
        },

    }, function (err, results) {
        if (err) { return next(err); }
        if (results.genre == null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books });
    });

};

// TODO Turn genre create get into API
// Display Genre create form on GET.
exports.genre_create_get = function (req, res) {
    res.render('genre_form', { title: 'Create Genre' });
};

// TODO Turn genre create post into API
// Handle Genre create on POST.
exports.genre_create_post = [

    // Validate that the name field is not empty.
    validator
        .body('name', 'Genre name required')
        .trim()
        .isLength({ min: 1 }),

    // Sanitize (escape) the name field.
    validator.sanitizeBody('name').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validator.validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var genre = new Genre(
            { name: req.body.name }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            Genre.findOne({ 'name': req.body.name })
                .exec(function (err, found_genre) {
                    if (err) { return next(err); }

                    if (found_genre) {
                        // Genre exists, redirect to its detail page.
                        res.redirect(found_genre.url);
                    }
                    else {

                        genre.save(function (err) {
                            if (err) { return next(err); }
                            // Genre saved. Redirect to genre detail page.
                            res.redirect(genre.url);
                        });

                    }

                });
        }
    }
];

// TODO Turn genre delete get into API
// Display Genre delete form on GET.
exports.genre_delete_get = function (req, res) {

    async.parallel({
        genre: function (callback) {
            Genre.findById(req.params.id).exec(callback)
        },
        genres_books: function (callback) {
            Book.find({ 'genre': req.params.id }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.genre == null) { // No results.
            res.redirect('/catalog/genre');
        }
        // Successful, so render.
        res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genres_books: results.genres_books });
    });

};

// TODO Turn genre delete post into API
// Handle Genre delete on POST.
exports.genre_delete_post = function (req, res) {

    async.parallel({
        genre: function (callback) {
            Genre.findById(req.body.genreid).exec(callback)
        },
        genres_books: function (callback) {
            Book.find({ 'genre': req.body.genreid }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // Success
        if (results.genres_books.length > 0) {
            // Genre has books. Render in same way as for GET route.
            res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genres_books: results.genres_books });
            return;
        }
        else {
            // Genre has no books. Delete object and redirect to the list of genres.
            Genre.findByIdAndRemove(req.body.genreid, function deleteGenre(err) {
                if (err) { return next(err); }
                // Success - go to Genre list
                res.redirect('/catalog/genres')
            })
        }
    });

};

// TODO Turn genre update get into API
// Display Genre update form on GET.
exports.genre_update_get = function (req, res) {

    // Get genre for form.
    async.parallel({
        genre: function (callback) {
            Genre.findById(req.params.id).exec(callback);
        }
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.genre == null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Success
        res.render('genre_form', { title: 'Update Genre', genre: results.genre });
    });

};

// TODO Turn genre update post into API
// Handle Genre update on POST.
exports.genre_update_post = [

    // Validate that the name field is not empty.
    validator
        .body('name', 'Genre name required')
        .trim()
        .isLength({ min: 1 }),

    // Sanitize (escape) the name field.
    validator.sanitizeBody('name').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validator.validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var genre = new Genre(
            {
                _id: req.params.id, //This is required, or a new ID will be assigned!
                name: req.body.name
            }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('genre_form', { title: 'Update Genre', genre: genre, errors: errors.array() });
            return;
        } else {
            // Data from form is valid. Update the record.
            Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err, thegenre) {
                if (err) { return next(err); }
                // Successful - redirect to genre detail page.
                res.redirect(thegenre.url);
            });
        }
    }
];