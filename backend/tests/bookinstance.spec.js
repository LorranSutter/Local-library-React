const app = require('../app');
const randomGenerator = require('./randomGenerator');
const Author = require('../models/author');
const Genre = require('../models/genre');
const Book = require('../models/book');
const Bookinstance = require('../models/bookinstance');

const supertest = require('supertest')
const request = supertest(app);

const mongoose = require('mongoose');

const MONGOURI = "mongodb+srv://lorran:BCDV1007@cluster0-lyl06.gcp.mongodb.net/local_library_test?retryWrites=true&w=majority";

describe('Bookinstance', () => {

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

    it('Creates a new book instance', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const savedAuthor = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const savedGenre = await newGenre.save();

        const newBook = new Book(randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]));
        const savedBook = await newBook.save();

        const newBookInstance = randomGenerator.generateBookInstance(savedBook.id);

        request
            .post('/catalog/bookinstance/create')
            .send(newBookInstance)
            .end(function (err, res) {
                if (err) return done(err);

                expect(res.status).toBe(201);
                expect(res.body.id).toMatch(/[\d\w]{24}/);
                expect(res.body.message).toBe(`Book Instance ${res.body.id} created successfully`);

                done();
            });
    });

    it('Cannot create book instance, because all fields are missing', async done => {
        request
            .post('/catalog/bookinstance/create')
            .end(function (err, res) {
                if (err) return done(err);

                expect(res.status).toBe(422);
                expect(res.body.errors).toContainEqual({ "book": "Book must be specified" });
                expect(res.body.errors).toContainEqual({ "imprint": "Imprint must be specified" });
                expect(res.body.errors).toContainEqual({ "status": "Status must be specified" });

                done();
            });
    });

    it('Cannot create book instance, because date is invalid', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const savedAuthor = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const savedGenre = await newGenre.save();

        const newBook = new Book(randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]));
        const savedBook = await newBook.save();

        const newBookInstance = randomGenerator.generateBookInstance(savedBook.id);
        newBookInstance.due_back = "123";

        request
            .post('/catalog/bookinstance/create')
            .send(newBookInstance)
            .end(function (err, res) {
                if (err) return done(err);

                expect(res.status).toBe(422);
                expect(res.body.errors).toContainEqual({ "due_back": "Invalid date" });

                done();
            });
    });

    it('Gets book instance list', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const savedGenre = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const savedAuthor = await newGenre.save();

        const newBook = new Book(randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]));
        const savedBook = await newBook.save();

        const newBookInstance1 = new Bookinstance(randomGenerator.generateBookInstance(savedBook.id));
        const newBookInstance2 = new Bookinstance(randomGenerator.generateBookInstance(savedBook.id));
        const newBookInstance3 = new Bookinstance(randomGenerator.generateBookInstance(savedBook.id));

        const resCreate1 = await newBookInstance1.save();
        const resCreate2 = await newBookInstance2.save();
        const resCreate3 = await newBookInstance3.save();

        request
            .get('/catalog/bookinstances')
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.bookinstance_list.length).toBeGreaterThanOrEqual(3);

                expect(res.body.bookinstance_list).toEqual(
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

    it('Gets book instance detail', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const savedGenre = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const savedAuthor = await newGenre.save();

        const newBook = new Book(randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]));
        const savedBook = await newBook.save();

        const newBookInstance = new Bookinstance(randomGenerator.generateBookInstance(savedBook.id));
        const resCreate = await newBookInstance.save();

        request
            .get(`/catalog/bookinstance/${resCreate.id}`)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.bookinstance._id).toBe(resCreate.id);
                expect(res.body.bookinstance.status).toBe(newBookInstance.status);
                expect(res.body.bookinstance.book._id).toBe(savedBook.id);
                expect(res.body.bookinstance.imprint).toBe(newBookInstance.imprint);

                done();
            });
    });

    it('Book instance not found in detail', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const savedGenre = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const savedAuthor = await newGenre.save();

        const newBook = new Book(randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]));
        const savedBook = await newBook.save();

        const newBookInstance = new Bookinstance(randomGenerator.generateBookInstance(savedBook.id));
        const resCreate = await newBookInstance.save();

        const newBookInstanceId = randomGenerator.changeId(resCreate.id);

        request
            .get(`/catalog/bookinstance/${newBookInstanceId}`)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(404);
                expect(res.body.error.status).toBe(404);
                expect(res.body.error.message).toBe(`Book Instance ${newBookInstanceId} not found`);

                done();
            });
    });

    it('Deletes a book instance', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const savedGenre = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const savedAuthor = await newGenre.save();

        const newBook = new Book(randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]));
        const savedBook = await newBook.save();

        const newBookInstance = new Bookinstance(randomGenerator.generateBookInstance(savedBook.id));
        const resCreate = await newBookInstance.save();

        request
            .delete(`/catalog/bookinstance/${resCreate.id}`)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.message).toBe(`Book Instance ${resCreate.id} deleted successfully`)

                done();
            });
    });

    it('Book instance not found in delete', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const savedGenre = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const savedAuthor = await newGenre.save();

        const newBook = new Book(randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]));
        const savedBook = await newBook.save();

        const newBookInstance = new Bookinstance(randomGenerator.generateBookInstance(savedBook.id));
        const resCreate = await newBookInstance.save();

        const newBookInstanceId = randomGenerator.changeId(resCreate.id);

        request
            .delete(`/catalog/bookinstance/${newBookInstanceId}`)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(404);
                expect(res.body.error.status).toBe(404);
                expect(res.body.error.message).toBe(`Book Instance ${newBookInstanceId} not found`);

                done();
            });
    });

    it('Updates book instance', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const savedGenre = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const savedAuthor = await newGenre.save();

        const newBook = new Book(randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]));
        const savedBook = await newBook.save();

        const newBookInstance1 = new Bookinstance(randomGenerator.generateBookInstance(savedBook.id));
        const newBookInstance2 = new Bookinstance(randomGenerator.generateBookInstance(savedBook.id));

        const resCreate = await newBookInstance1.save();

        request
            .put(`/catalog/bookinstance/${resCreate.id}`)
            .send(newBookInstance2)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.message).toBe(`Book Instance ${resCreate.id} updated successfully`)

                done();
            });
    });

    it('Book instance not found in update', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const savedGenre = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const savedAuthor = await newGenre.save();

        const newBook = new Book(randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]));
        const savedBook = await newBook.save();

        const newBookInstance = new Bookinstance(randomGenerator.generateBookInstance(savedBook.id));
        const resCreate = await newBookInstance.save();

        const newBookInstanceId = randomGenerator.changeId(resCreate.id);

        request
            .put(`/catalog/bookinstance/${newBookInstanceId}`)
            .send(newBookInstance)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(404);
                expect(res.body.error.status).toBe(404);
                expect(res.body.error.message).toBe(`Book Instance ${newBookInstanceId} not found`);

                done();
            });
    });

    it('Cannot update book instance, because all fields are missing', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const savedGenre = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const savedAuthor = await newGenre.save();

        const newBook = new Book(randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]));
        const savedBook = await newBook.save();

        const newBookInstance = new Bookinstance(randomGenerator.generateBookInstance(savedBook.id));
        const resCreate = await newBookInstance.save();

        request
            .put(`/catalog/bookinstance/${resCreate.id}`)
            .end(function (err, res) {
                if (err) return done(err);

                expect(res.status).toBe(422);
                expect(res.body.errors).toContainEqual({ "book": "Book must be specified" });
                expect(res.body.errors).toContainEqual({ "imprint": "Imprint must be specified" });
                expect(res.body.errors).toContainEqual({ "status": "Status must be specified" });

                done();
            });
    });

    it('Cannot update book instance, because date is invalid', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const savedGenre = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const savedAuthor = await newGenre.save();

        const newBook = new Book(randomGenerator.generateBook(savedAuthor.id, [savedGenre.id]));
        const savedBook = await newBook.save();

        const newBookInstance1 = new Bookinstance(randomGenerator.generateBookInstance(savedBook.id));
        const newBookInstance2 = randomGenerator.generateBookInstance(savedBook.id);
        newBookInstance2.due_back = "123";

        const resCreate = await newBookInstance1.save();

        request
            .put(`/catalog/bookinstance/${resCreate.id}`)
            .send(newBookInstance2)
            .end(function (err, res) {
                if (err) return done(err);

                expect(res.status).toBe(422);
                expect(res.body.errors).toContainEqual({ "due_back": "Invalid date" });

                done();
            });
    });
});