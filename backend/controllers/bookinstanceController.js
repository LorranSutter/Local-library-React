const async = require('async');
const validator = require('express-validator');

const Book = require('../models/book');
const BookInstance = require('../models/bookinstance');

const { errorHandler } = require('../errorHandler');

// Return list of all BookInstances.
exports.bookinstance_list = function (req, res, next) {

    BookInstance.find()
        .populate('book', 'title')
        .exec(function (err, list_bookinstances) {
            if (err) { return next(err); }
            res.json({ bookinstance_list: list_bookinstances });
        });
};

// Return detail for a specific BookInstance.
exports.bookinstance_detail = function (req, res, next) {

    BookInstance.findById(req.params.id)
        .populate('book', 'title')
        .exec(function (err, bookinstance) {
            if (err) { return next(err); }
            if (!bookinstance) {
                return next(errorHandler(`Book Instance ${req.params.id} not found`, 404));
            }
            res.json({ bookinstance: bookinstance });
        })
};

// Handle BookInstance create on POST.
exports.bookinstance_create = (req, res, next) => {

    // Create a BookInstance object with escaped and trimmed data.
    var bookinstance = new BookInstance(
        {
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back || new Date()
        });

    // Data from form is valid.
    bookinstance.save(function (err, doc) {
        if (err) { return next(err); }
        res.status(201).json({ id: doc.id, message: `Book Instance ${doc.id} created successfully` });
    });
}

// Handle BookInstance delete on DELETE.
exports.bookinstance_delete = function (req, res, next) {

    async.parallel({
        bookinstance: function (callback) {
            BookInstance.findById(req.params.id).exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); }
        if (!results.bookinstance) {
            return next(errorHandler(`Book Instance ${req.params.id} not found`, 404));
        }
        BookInstance.findByIdAndRemove(req.params.id, function deleteBookInstance(err) {
            if (err) { return next(err); }
            res.json({ message: `Book Instance ${req.params.id} deleted successfully` });
        })
    });

};

// Handle bookinstance update on PUT.
exports.bookinstance_update = (req, res, next) => {

    // Create a book instance object with escaped and trimmed data.
    var bookinstance = new BookInstance(
        {
            _id: req.params.id, //This is required, or a new ID will be assigned!
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back || new Date()
        }
    );

    // Data is valid. Update the record.
    BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, function (err, updatedBookInstance) {
        if (err) { return next(err); }
        if (!updatedBookInstance) {
            return next(errorHandler(`Book Instance ${req.params.id} not found`, 404));
        }
        res.json({ message: `Book Instance ${req.params.id} updated successfully` });
    });
}