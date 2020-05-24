const app = require('../app');
const randomGenerator = require('./randomGenerator');
const Genre = require('../models/genre');

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
    })

    it('Creates a new genre', done => {
        const newGenre = { "name": randomGenerator.randomString(10) };

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
        const newGenre = new Genre({ "name": randomGenerator.randomString(10) });

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
        const newGenre1 = new Genre({ "name": randomGenerator.randomString(10) });
        const newGenre2 = new Genre({ "name": randomGenerator.randomString(10) });
        const newGenre3 = new Genre({ "name": randomGenerator.randomString(10) });

        await newGenre1.save();
        await newGenre2.save();
        await newGenre3.save();

        request
            .get('/catalog/genres')
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.genre_list.length).toBe(3);

                done();
            });
    });

    it('Gets genre detail', async done => {
        const newGenre = new Genre({ "name": randomGenerator.randomString(10) });

        const resCreate = await newGenre.save();

        request
            .get(`/catalog/genre/${resCreate.id}`)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.genre.name).toBe(newGenre.name);
                expect(res.body.genre_books).toStrictEqual([]);

                done();
            });
    });

    it('Genre not found in detail', async done => {
        const newGenre = new Genre({ "name": randomGenerator.randomString(10) });

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
        const newGenre = new Genre({ "name": randomGenerator.randomString(10) });

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
        const newGenre = new Genre({ "name": randomGenerator.randomString(10) });

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

    it('Updates genre', async done => {
        const newGenre1 = new Genre({ "name": randomGenerator.randomString(10) });
        const newGenre2 = new Genre({ "name": randomGenerator.randomString(10) });

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
        const newGenre = new Genre({ "name": randomGenerator.randomString(10) });

        const resCreate = await newGenre.save();

        const newGenreId = randomGenerator.changeId(resCreate.id);

        request
            .put(`/catalog/genre/${newGenreId}`)
            .send(newGenre)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(404);
                expect(res.body.error.status).toBe(404);
                expect(res.body.error.message).toBe(`Genre ${newGenreId} not found`);

                done();
            });
    });

    it('Cannot update genre, because name is missing', async done => {
        const newGenre = new Genre({ "name": randomGenerator.randomString(10) });

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

    //TODO Cannot delete genre because there are associated books
});