const app = require('../app');
const randomGenerator = require('./randomGenerator');
const Author = require('../models/author');
const Genre = require('../models/genre');
const Book = require('../models/book');

const supertest = require('supertest')
const request = supertest(app);

const mongoose = require('mongoose');

const MONGOURI = "mongodb+srv://lorran:BCDV1007@cluster0-lyl06.gcp.mongodb.net/local_library_test?retryWrites=true&w=majority";

describe('Genre', () => {

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

    it('Creates a new genre', done => {
        const newGenre = randomGenerator.generateGenre();

        request
            .post('/catalog/genre/create')
            .send(newGenre)
            .end(function (err, res) {
                if (err) return done(err);

                expect(res.status).toBe(201);
                expect(res.body.id).toMatch(/[\d\w]{24}/);
                expect(res.body.message).toBe(`Genre ${newGenre.name} created successfully`);

                done();
            });
    });

    it('Cannot create an existing genre', async done => {
        const newGenre = new Genre(randomGenerator.generateGenre());

        await newGenre.save();

        request
            .post('/catalog/genre/create')
            .send(newGenre)
            .end(function (err, res) {
                if (err) return done(err);

                expect(res.status).toBe(403);
                expect(res.body.error.status).toBe(403);
                expect(res.body.error.message).toBe(`Genre ${newGenre.name} already exists`);

                done();
            });
    });

    it('Cannot create genre, because name is missing', async done => {
        request
            .post('/catalog/genre/create')
            .end(function (err, res) {
                if (err) return done(err);

                expect(res.status).toBe(422);
                expect(res.body.errors).toContainEqual({ name: "Genre name required" });

                done();
            });
    });

    it('Gets genre list', async done => {
        const newGenre1 = new Genre(randomGenerator.generateGenre());
        const newGenre2 = new Genre(randomGenerator.generateGenre());
        const newGenre3 = new Genre(randomGenerator.generateGenre());

        const resCreate1 = await newGenre1.save();
        const resCreate2 = await newGenre2.save();
        const resCreate3 = await newGenre3.save();

        request
            .get('/catalog/genres')
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.genre_list.length).toBeGreaterThanOrEqual(3);

                expect(res.body.genre_list).toEqual(
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

    it('Gets genre detail', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const savedAuthor = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const resCreate = await newGenre.save();

        const newBook = new Book(randomGenerator.generateBook(savedAuthor.id, [resCreate.id]));
        const savedBook = await newBook.save();

        request
            .get(`/catalog/genre/${resCreate.id}`)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.genre._id).toBe(resCreate.id);
                expect(res.body.genre.name).toBe(newGenre.name);

                expect(res.body.genre_books).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            _id: savedBook.id
                        })
                    ])
                );

                done();
            });
    });

    it('Genre not found in detail', async done => {
        const newGenre = new Genre(randomGenerator.generateGenre());

        const resCreate = await newGenre.save();

        const newGenreId = randomGenerator.changeId(resCreate.id);

        request
            .get(`/catalog/genre/${newGenreId}`)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(404);
                expect(res.body.error.status).toBe(404);
                expect(res.body.error.message).toBe(`Genre ${newGenreId} not found`);

                done();
            });
    });

    it('Deletes a genre', async done => {
        const newGenre = new Genre(randomGenerator.generateGenre());

        const resCreate = await newGenre.save();

        request
            .delete(`/catalog/genre/${resCreate.id}`)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.message).toBe(`Genre ${resCreate.id} deleted successfully`)

                done();
            });
    });

    it('Genre not found in delete', async done => {
        const newGenre = new Genre(randomGenerator.generateGenre());

        const resCreate = await newGenre.save();

        const newGenreId = randomGenerator.changeId(resCreate.id);

        request
            .delete(`/catalog/genre/${newGenreId}`)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(404);
                expect(res.body.error.status).toBe(404);
                expect(res.body.error.message).toBe(`Genre ${newGenreId} not found`);

                done();
            });
    });

    it('Cannot delete genre, because it has books associated', async done => {
        const newAuthor = new Author(randomGenerator.generateAuthor());
        const savedAuthor = await newAuthor.save();

        const newGenre = new Genre(randomGenerator.generateGenre());
        const resCreate = await newGenre.save();

        const newBook = new Book(randomGenerator.generateBook(savedAuthor.id, [resCreate.id]));
        const savedBook = await newBook.save();

        request
            .delete(`/catalog/genre/${resCreate.id}`)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(409);
                expect(res.body.error.status).toBe(409);
                expect(res.body.error.message).toBe(`Genre ${resCreate.id} cannot be deleted because it has books associated`);
                expect(res.body.error.data.genre_books.length).toBe(1);

                expect(res.body.error.data.genre_books).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            _id: savedBook.id
                        })
                    ])
                );

                done();
            });
    });

    it('Updates genre', async done => {
        const newGenre1 = new Genre(randomGenerator.generateGenre());
        const newGenre2 = new Genre(randomGenerator.generateGenre());

        const resCreate = await newGenre1.save();

        request
            .put(`/catalog/genre/${resCreate.id}`)
            .send(newGenre2)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.message).toBe(`Genre ${resCreate.id} updated successfully`)

                done();
            });
    });

    it('Genre not found in update', async done => {
        const newGenre1 = new Genre(randomGenerator.generateGenre());
        const newGenre2 = new Genre(randomGenerator.generateGenre());

        const resCreate = await newGenre1.save();

        const newGenreId = randomGenerator.changeId(resCreate.id);

        request
            .put(`/catalog/genre/${newGenreId}`)
            .send(newGenre2)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(404);
                expect(res.body.error.status).toBe(404);
                expect(res.body.error.message).toBe(`Genre ${newGenreId} not found`);

                done();
            });
    });

    it('Cannot update genre, because name is missing', async done => {
        const newGenre = new Genre(randomGenerator.generateGenre());

        const resCreate = await newGenre.save();

        request
            .put(`/catalog/genre/${resCreate.id}`)
            .end(function (err, res) {
                if (err) return done(err);

                expect(res.status).toBe(422);
                expect(res.body.errors).toContainEqual({ name: "Genre name required" });

                done();
            });
    });

    it('Cannot update genre, it is an existing genre', async done => {
        const newGenre1 = new Genre(randomGenerator.generateGenre());
        const newGenre2 = new Genre(randomGenerator.generateGenre());

        await newGenre1.save();

        const resCreate = await newGenre2.save();

        request
            .put(`/catalog/genre/${resCreate.id}`)
            .send(newGenre1)
            .end(function (err, res) {
                if (err) return done(err);

                expect(res.status).toBe(403);
                expect(res.body.error.status).toBe(403);
                expect(res.body.error.message).toBe(`Genre ${newGenre1.name} already exists`);

                done();
            });
    });
});