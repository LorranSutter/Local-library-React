const async = require('async');

const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');

const { errorHandler } = require('../errorHandler');

exports.index = function (req, res, next) {

    async.parallel({
        book_count: function (callback) {
            Book.countDocuments({}, callback);
        },
        book_instance_count: function (callback) {
            BookInstance.countDocuments({}, callback);
        },
        book_instance_available_count: function (callback) {
            BookInstance.countDocuments({ status: 'Available' }, callback);
        },
        author_count: function (callback) {
            Author.countDocuments({}, callback);
        },
        genre_count: function (callback) {
            Genre.countDocuments({}, callback);
        }
    }, function renderCB(err, results) {
        if (err) { return next(err); }
        res.json({ data: results });
    });
};

// Display list of all Books.
exports.book_list = function (req, res, next) {

    Book.find({}, 'title author')
        .populate('author', 'first_name family_name')
        .exec(function (err, list_books) {
            if (err) { return next(err); }
            res.json({ book_list: list_books });
        });

};

// Display detail page for a specific book.
exports.book_detail = function (req, res, next) {

    async.parallel({
        book: function (callback) {

            Book.findById(req.params.id)
                .populate('author', 'first_name family_name')
                .populate('genre')
                .exec(callback);
        },
        book_instance: function (callback) {

            BookInstance.find({ 'book': req.params.id }, { 'book': 0 })
                .exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (!results.book) {
            return next(errorHandler(`Book ${req.params.id} not found`, 404));
        }
        res.json({ book: results.book, book_instances: results.book_instance });
    });

};

// Handle book create on POST.
exports.book_create = (req, res, next) => {

    // Create a Book object with escaped and trimmed data.
    var book = new Book(
        {
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: convertGenreToArray(req)
        });

    // DataD is valid. Save book.
    book.save(function (err, doc) {
        if (err) { return next(err); }
        // res.redirect(book.url);
        res.status(201).json({ id: doc.id, message: `Book ${doc.title} created successfully` });
    });
}

// Handle book delete on DELETE.
exports.book_delete = function (req, res, next) {

    async.parallel({
        book: function (callback) {
            Book.findById(req.params.id).exec(callback)
        },
        bookinstances: function (callback) {
            BookInstance.find({ 'book': req.params.id }, { 'id': 1 }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (!results.book) {
            return next(errorHandler(`Book ${req.params.id} not found`, 404));
        }
        if (results.bookinstances.length > 0) {
            // Book has bookinstances. Render in same way as for GET route.
            return next(
                errorHandler(
                    `Book ${req.params.id} cannot be deleted because it has books instances associated`,
                    409,
                    { bookinstances: results.bookinstances }
                )
            );
        }
        // Book has no bookinstances. Delete object and redirect to the list of books.
        Book.findByIdAndRemove(req.params.id, function deleteBook(err) {
            if (err) { return next(err); }
            res.json({ message: `Book ${req.params.id} deleted successfully` });
        })
    });

};

// Handle book update on PUT.
exports.book_update = (req, res, next) => {

    // Create a Book object with escaped/trimmed data and old id.
    var book = new Book(
        {
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: convertGenreToArray(req),
            _id: req.params.id //This is required, or a new ID will be assigned!
        });

    // Data is valid. Update the record.
    Book.findByIdAndUpdate(req.params.id, book, {}, function (err, updatedBook) {
        if (err) { return next(err); }
        if (!updatedBook) {
            return next(errorHandler(`Book ${req.params.id} not found`, 404));
        }
        res.json({ message: `Book ${req.params.id} updated successfully` });
    });
}

function convertGenreToArray(req) {
    if (!(req.body.genre instanceof Array)) {
        if (typeof req.body.genre === 'undefined')
            return [];
        else
            return new Array(req.body.genre);
    }
}