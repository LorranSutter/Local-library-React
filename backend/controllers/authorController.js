const async = require('async');

const Book = require('../models/book');
const Author = require('../models/author');

const { errorHandler } = require('../errorHandler');

// Return list of all Authors.
exports.author_list = function (req, res, next) {

    Author.find()
        .populate('author')
        .sort([['family_name', 'ascending']])
        .exec(function (err, list_authors) {
            if (err) { return next(err); }
            res.json({ author_list: list_authors });
        });
};

// Return detail for a specific Author.
exports.author_detail = function (req, res, next) {

    async.parallel({
        author: function (callback) {
            Author.findById(req.params.id).exec(callback);
        },
        authors_books: function (callback) {
            Book.find({ 'author': req.params.id }, 'title summary').exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (!results.author) {
            return next(errorHandler(`Author ${req.params.id} not found`, 404));
        }
        res.json({ author: results.author, author_books: results.authors_books });
    });

};

// Handle Author create.
exports.author_create = (req, res, next) => {

    // Create an Author object with escaped and trimmed data.
    const author = new Author(
        {
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death
        });

    author.save(function (err, doc) {
        if (err) { return next(err); }
        res.status(201).json({ id: doc.id, message: `Author ${doc.first_name} created successfully` });
    });
}

// Handle Author delete on DELETE.
exports.author_delete = function (req, res, next) {

    async.parallel({
        author: function (callback) {
            Author.findById(req.params.id).exec(callback)
        },
        author_books: function (callback) {
            Book.find({ 'author': req.params.id }, { id: 1 }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (!results.author) {
            return next(errorHandler(`Author ${req.params.id} not found`, 404));
        }
        if (results.author_books.length > 0) {
            // Author has books. Return 409 conflict error.
            return next(
                errorHandler(
                    `Author ${req.params.id} cannot be deleted because it has books associated`,
                    409,
                    { author_books: results.author_books }
                )
            );
        }
        // Author has no books. Delete object and return success message.
        Author.findByIdAndRemove(req.params.id, function deleteAuthor(err) {
            if (err) { return next(err); }
            res.json({ message: `Author ${req.params.id} deleted successfully` });
        });
    });
};

// Handle Author update on PUT.
exports.author_update = (req, res, next) => {

    // Create a author object with escaped and trimmed data.
    const author = new Author(
        {
            _id: req.params.id, //This is required, or a new ID will be assigned!
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death
        }
    );

    // Data is valid. Update the record.
    Author.findByIdAndUpdate(req.params.id, author, {}, function (err, updatedAuthor) {
        if (err) { return next(err); }
        if (!updatedAuthor) {
            return next(errorHandler(`Author ${req.params.id} not found`, 404));
        }
        res.json({ message: `Author ${req.params.id} updated successfully` });
    });
}