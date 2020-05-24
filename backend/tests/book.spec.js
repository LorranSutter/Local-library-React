const app = require('../app');
const randomGenerator = require('./randomGenerator');
const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');

const supertest = require('supertest')
const request = supertest(app);
const moment = require('moment');

const mongoose = require('mongoose');

const MONGOURI = "mongodb+srv://lorran:BCDV1007@cluster0-lyl06.gcp.mongodb.net/local_library_test?retryWrites=true&w=majority";

describe('Book', () => {

    beforeAll(async () => {
        await mongoose.connect(MONGOURI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        });
        mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
        await mongoose.connection.dropDatabase();
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it('Creates a new book', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const savedAuthor = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const savedGenre = await newGenre.save();

        const newBook = randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]);

        request
            .post('/catalog/book/create')
            .send(newBook)
            .end(function (err, res) {
                if (err) return done(err);

                expect(res.status).toBe(201);
                expect(res.body.id).toMatch(/[\d\w]{24}/);
                expect(res.body.message).toBe(`Book ${newBook.title} created successfully`);

                done();
            });
    });

    it('Cannot create book, because all fields are missing', async done => {
        request
            .post('/catalog/book/create')
            .end(function (err, res) {
                if (err) return done(err);

                expect(res.status).toBe(422);
                expect(res.body.errors).toContainEqual({ "title": "Title must not be empty." });
                expect(res.body.errors).toContainEqual({ "author": "Author must not be empty." });
                expect(res.body.errors).toContainEqual({ "summary": "Summary must not be empty." });
                expect(res.body.errors).toContainEqual({ "isbn": "ISBN must not be empty." });

                done();
            });
    });

    it('Gets book list', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const savedGenre = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const savedAuthor = await newGenre.save();

        const newBook1 = new Book(randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]));
        const newBook2 = new Book(randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]));
        const newBook3 = new Book(randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]));

        const resCreate1 = await newBook1.save();
        const resCreate2 = await newBook2.save();
        const resCreate3 = await newBook3.save();

        request
            .get('/catalog/books')
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.book_list.length).toBeGreaterThanOrEqual(3);

                expect(res.body.book_list).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            _id: resCreate1.id
                        }),
                        expect.objectContaining({
                            _id: resCreate2.id
                        }),
                        expect.objectContaining({
                            _id: resCreate3.id
                        })
                    ])
                );

                done();
            });
    });

    it('Gets book detail', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const savedAuthor = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const savedGenre = await newGenre.save();

        const newBook = new Book(randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]));
        const resCreate = await newBook.save();

        request
            .get(`/catalog/book/${resCreate.id}`)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.book.title).toBe(newBook.title);
                expect(res.body.book.author._id).toBe(savedAuthor.id);
                expect(res.body.book.summary).toBe(newBook.summary);
                expect(res.body.book.genre.length).toBe(1);

                expect(res.body.book.genre).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            _id: savedGenre.id
                        })
                    ])
                );

                expect(res.body.book_instances).toStrictEqual([]);

                done();
            });
    });

    it('Book not found in detail', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const savedAuthor = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const savedGenre = await newGenre.save();

        const newBook = new Book(randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]));
        const resCreate = await newBook.save();

        const newBookId = randomGenerator.changeId(resCreate.id);

        request
            .get(`/catalog/book/${newBookId}`)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(404);
                expect(res.body.error.status).toBe(404);
                expect(res.body.error.message).toBe(`Book ${newBookId} not found`);

                done();
            });
    });

    it('Deletes a book', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const savedAuthor = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const savedGenre = await newGenre.save();

        const newBook = new Book(randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]));
        const resCreate = await newBook.save();

        request
            .delete(`/catalog/book/${resCreate.id}`)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.message).toBe(`Book ${resCreate.id} deleted successfully`)

                done();
            });
    });

    it('Book not found in delete', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const savedAuthor = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const savedGenre = await newGenre.save();

        const newBook = new Book(randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]));
        const resCreate = await newBook.save();

        const newBookId = randomGenerator.changeId(resCreate.id);

        request
            .delete(`/catalog/book/${newBookId}`)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(404);
                expect(res.body.error.status).toBe(404);
                expect(res.body.error.message).toBe(`Book ${newBookId} not found`);

                done();
            });
    });

    it('Updates book', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const savedAuthor = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const savedGenre = await newGenre.save();

        const newBook1 = new Book(randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]));
        const newBook2 = new Book(randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]));

        const resCreate = await newBook1.save();

        request
            .put(`/catalog/book/${resCreate.id}`)
            .send(newBook2)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.message).toBe(`Book ${resCreate.id} updated successfully`)

                done();
            });
    });

    it('Book not found in update', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const savedAuthor = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const savedGenre = await newGenre.save();

        const newBook = new Book(randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]));

        const resCreate = await newBook.save();

        const newBookId = randomGenerator.changeId(resCreate.id);

        request
            .put(`/catalog/book/${newBookId}`)
            .send(newBook)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(404);
                expect(res.body.error.status).toBe(404);
                expect(res.body.error.message).toBe(`Book ${newBookId} not found`);

                done();
            });
    });

    it('Cannot update book, because all fields are missing', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const savedAuthor = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const savedGenre = await newGenre.save();

        const newBook = new Book(randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]));

        const resCreate = await newBook.save();

        request
            .put(`/catalog/book/${resCreate.id}`)
            .end(function (err, res) {
                if (err) return done(err);

                expect(res.status).toBe(422);
                expect(res.body.errors).toContainEqual({ "title": "Title must not be empty." });
                expect(res.body.errors).toContainEqual({ "author": "Author must not be empty." });
                expect(res.body.errors).toContainEqual({ "summary": "Summary must not be empty." });
                expect(res.body.errors).toContainEqual({ "isbn": "ISBN must not be empty." });

                done();
            });
    });

    //TODO Cannot delete book because there are associated bookinstances
    //TODO Book detail with bookinstances

});