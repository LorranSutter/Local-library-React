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
        mongoose.connection.dropDatabase();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        const genreCollection = await mongoose.connection.db.listCollections({ name: 'genres' }).toArray();
        if (genreCollection.length !== 0) {
            await mongoose.connection.db.dropCollection('genres');
        }

        const authorCollection = await mongoose.connection.db.listCollections({ name: 'authors' }).toArray();
        if (authorCollection.length !== 0) {
            await mongoose.connection.db.dropCollection('authors');
        }

        const bookCollection = await mongoose.connection.db.listCollections({ name: 'books' }).toArray();
        if (bookCollection.length !== 0) {
            await mongoose.connection.db.dropCollection('books');
        }
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
                expect(res.body.errors).toContainEqual({ "isbn": "ISBN must not be empty" });

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

        await newBook1.save();
        await newBook2.save();
        await newBook3.save();

        request
            .get('/catalog/books')
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.book_list.length).toBe(3);

                done();
            });
    });

    it.only('Gets book detail', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const savedAuthor = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const savedGenre = await newGenre.save();

        const newBook = new Book(randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]));
        const resCreate = await newBook.save();

        request
            .get(`/catalog/book/${resCreate.id}`)
            .end(function (err, res) {
                console.log(savedGenre.id)
                console.log(res.body)
                console.log(res.body.book.genre)
                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.book.title).toBe(newBook.title);
                expect(res.body.book.author._id).toBe(savedAuthor.id);
                expect(res.body.book.summary).toBe(newBook.summary);
                // TODO check id in the genre list
                expect(res.body.book.genre._id).toBe(savedGenre.id);
                expect(res.body.book_instances).toStrictEqual([]);

                done();
            });
    });


});