const app = require('../app');
const randomGenerator = require('./randomGenerator');
const Author = require('../models/author');
const Genre = require('../models/genre');
const Book = require('../models/book');

const supertest = require('supertest')
const request = supertest(app);

const mongoose = require('mongoose');

const MONGOURI = "mongodb+srv://lorran:BCDV1007@cluster0-lyl06.gcp.mongodb.net/local_library_test?retryWrites=true&w=majority";

describe('Author', () => {

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

    it('Creates a new author', done => {
        const newAuthor = randomGenerator.generateAuthor();

        request
            .post('/catalog/author/create')
            .send(newAuthor)
            .end(function (err, res) {
                if (err) return done(err);

                expect(res.status).toBe(201);
                expect(res.body.id).toMatch(/[\d\w]{24}/);
                expect(res.body.message).toBe(`Author ${newAuthor.first_name} created successfully`);

                done();
            });
    });

    it('Cannot create author, because first name and family name are missing', async done => {
        request
            .post('/catalog/author/create')
            .end(function (err, res) {
                if (err) return done(err);

                expect(res.status).toBe(422);
                expect(res.body.errors).toContainEqual({ "first_name": "First name must be specified." });
                expect(res.body.errors).toContainEqual({ "first_name": "First name has non-alphanumeric characters." });
                expect(res.body.errors).toContainEqual({ "family_name": "Family name must be specified." });
                expect(res.body.errors).toContainEqual({ "family_name": "Family name has non-alphanumeric characters." });

                done();
            });
    });

    it('Cannot create author, because dates are invalid', async done => {
        const newAuthor = randomGenerator.generateAuthor();
        newAuthor.date_of_birth = "123";
        newAuthor.date_of_death = "123";

        request
            .post('/catalog/author/create')
            .send(newAuthor)
            .end(function (err, res) {
                if (err) return done(err);

                expect(res.status).toBe(422);
                expect(res.body.errors).toContainEqual({ "date_of_birth": "Invalid date of birth" });
                expect(res.body.errors).toContainEqual({ "date_of_death": "Invalid date of death" });

                done();
            });
    });

    it('Gets author list', async done => {
        const newAuthor1 = new Author(randomGenerator.generateAuthor());
        const newAuthor2 = new Author(randomGenerator.generateAuthor());
        const newAuthor3 = new Author(randomGenerator.generateAuthor());

        const resCreate1 = await newAuthor1.save();
        const resCreate2 = await newAuthor2.save();
        const resCreate3 = await newAuthor3.save();

        request
            .get('/catalog/authors')
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.author_list.length).toBeGreaterThanOrEqual(3);

                expect(res.body.author_list).toEqual(
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

    it('Gets author detail', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const resCreate = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const savedGenre = await newGenre.save();

        const newBook = new Book(randomGenerator.generateBook(resCreate.id, [savedGenre.id]));
        const savedBook = await newBook.save();

        request
            .get(`/catalog/author/${resCreate.id}`)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.author._id).toBe(resCreate.id);
                expect(res.body.author.first_name).toBe(newAuthor.first_name);
                expect(res.body.author.family_name).toBe(newAuthor.family_name);

                expect(res.body.author_books).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            _id: savedBook.id
                        }),
                    ])
                );

                done();
            });
    });

    it('Author not found in detail', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());

        const resCreate = await newAuthor.save();

        const newAuthorId = randomGenerator.changeId(resCreate.id);

        request
            .get(`/catalog/author/${newAuthorId}`)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(404);
                expect(res.body.error.status).toBe(404);
                expect(res.body.error.message).toBe(`Author ${newAuthorId} not found`);

                done();
            });
    });

    it('Deletes a author', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());

        const resCreate = await newAuthor.save();

        request
            .delete(`/catalog/author/${resCreate.id}`)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.message).toBe(`Author ${resCreate.id} deleted successfully`)

                done();
            });
    });

    it('Author not found in delete', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());

        const resCreate = await newAuthor.save();

        const newAuthorId = randomGenerator.changeId(resCreate.id);

        request
            .delete(`/catalog/author/${newAuthorId}`)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(404);
                expect(res.body.error.status).toBe(404);
                expect(res.body.error.message).toBe(`Author ${newAuthorId} not found`);

                done();
            });
    });

    it('Cannot delete author, because it has books associated', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const resCreate = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const savedGenre = await newGenre.save();

        const newBook = new Book(randomGenerator.generateBook(resCreate.id, [savedGenre.id]));
        const savedBook = await newBook.save();

        request
            .delete(`/catalog/author/${resCreate.id}`)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(409);
                expect(res.body.error.status).toBe(409);
                expect(res.body.error.message).toBe(`Author ${resCreate.id} cannot be deleted because it has books associated`);
                expect(res.body.error.data.author_books.length).toBe(1);

                expect(res.body.error.data.author_books).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            _id: savedBook.id
                        })
                    ])
                );

                done();
            });
    });

    it('Updates author', async done => {
        const newAuthor1 = new Author(randomGenerator.generateAuthor());
        const newAuthor2 = new Author(randomGenerator.generateAuthor());

        const resCreate = await newAuthor1.save();

        request
            .put(`/catalog/author/${resCreate.id}`)
            .send(newAuthor2)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.message).toBe(`Author ${resCreate.id} updated successfully`)

                done();
            });
    });

    it('Author not found in update', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());

        const resCreate = await newAuthor.save();

        const newAuthorId = randomGenerator.changeId(resCreate.id);

        request
            .put(`/catalog/author/${newAuthorId}`)
            .send(newAuthor)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(404);
                expect(res.body.error.status).toBe(404);
                expect(res.body.error.message).toBe(`Author ${newAuthorId} not found`);

                done();
            });
    });

    it('Cannot update author, because first name and family name are missing', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());

        const resCreate = await newAuthor.save();

        request
            .put(`/catalog/author/${resCreate.id}`)
            .end(function (err, res) {
                if (err) return done(err);

                expect(res.status).toBe(422);
                expect(res.body.errors).toContainEqual({ "first_name": "First name must be specified." });
                expect(res.body.errors).toContainEqual({ "first_name": "First name has non-alphanumeric characters." });
                expect(res.body.errors).toContainEqual({ "family_name": "Family name must be specified." });
                expect(res.body.errors).toContainEqual({ "family_name": "Family name has non-alphanumeric characters." });

                done();
            });
    });

    it('Cannot update author, because dates are invalid', async done => {
        const newAuthor1 = new Author(randomGenerator.generateAuthor());
        const newAuthor2 = randomGenerator.generateAuthor();
        newAuthor2.date_of_birth = "123";
        newAuthor2.date_of_death = "123";

        const resCreate = await newAuthor1.save();

        request
            .put(`/catalog/author/${resCreate.id}`)
            .send(newAuthor2)
            .end(function (err, res) {
                if (err) return done(err);

                expect(res.status).toBe(422);
                expect(res.body.errors).toContainEqual({ "date_of_birth": "Invalid date of birth" });
                expect(res.body.errors).toContainEqual({ "date_of_death": "Invalid date of death" });

                done();
            });
    });
});