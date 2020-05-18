const async = require('async');
const validator = require('express-validator');

const Genre = require('../models/genre');
const Book = require('../models/book');

// Display list of all Genre.
exports.genre_list = function (req, res, next) {

    Genre.find()
        .sort([['name']])
        .exec(function (err, list_genres) {
            if (err) { return next(err); }
            // Successful, so send
            res.json({ genre_list: list_genres })
        });
};

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
        res.json({ genre: results.genre, genre_books: results.genre_books });
    });

};

// Handle Genre create on POST.
exports.genre_create_post = (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validator.validationResult(req);

    // Create a genre object with escaped and trimmed data.
    var genre = new Genre(
        { name: req.body.name }
    );

    // Data from form is valid.
    // Check if Genre with same name already exists.
    Genre
        .findOne({ 'name': req.body.name })
        .exec(function (err, found_genre) {
            if (err) { return next(err); }

            if (found_genre) {
                // Genre exists, return a 403 error.
                res.status(403).json({ errors: `Genre ${genre.name} already exists` });
            }
            else {

                genre.save(function (err, doc) {
                    if (err) { return next(err); }
                    res.status(201).json({ id: doc.id, message: `Genre ${doc.name} created successfully` });
                });

            }

        });
};

// Handle Genre delete on DELETE.
exports.genre_delete = function (req, res, next) {

    async.parallel({
        genre: function (callback) {
            Genre.findById(req.params.id).exec(callback)
        },
        genres_books: function (callback) {
            Book.find({ 'genre': req.params.id }, { id: 1 }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // Success
        if (!results.genre) {
            res.status(404).json({ message: `Genre ${req.params.id} not found` });
        }
        else if (results.genres_books.length > 0) {
            // Genre has books. Return 409 conflict error.
            res.status(409).json({
                message: `Genre ${req.params.id} cannot be deleted because it has associated books`,
                genres_books: results.genres_books
            });
        }
        else {
            // Genre has no books. Delete object and return success message.
            Genre.findByIdAndRemove(req.params.id, function deleteGenre(err) {
                if (err) { return next(err); }
                res.json({ message: `Genre ${req.params.id} deleted successfully` });
            })
        }
    });

};

// Handle Genre update on PUT.
exports.genre_update = (req, res, next) => {

    // Create a genre object with escaped and trimmed data.
    var genre = new Genre(
        {
            _id: req.params.id, //This is required, or a new ID will be assigned!
            name: req.body.name
        }
    );

    // Data from form is valid. Update the record.
    Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err, updatedGenre) {
        if (err) { return next(err); }
        if (!updatedGenre) {
            res.status(404).json({ message: `Genre ${req.params.id} not found` });
        }
        else {
            res.json({ message: `Genre ${req.params.id} updated successfully` });
        }
    });
};


