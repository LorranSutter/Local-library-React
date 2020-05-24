const app = require('../app');
const { changeId, randomString, randomDate } = require('./randomGenerator');

const supertest = require('supertest')
const request = supertest(app);
const moment = require('moment');

const mongoose = require('mongoose');

const MONGOURI = "mongodb+srv://lorran:BCDV1007@cluster0-lyl06.gcp.mongodb.net/local_library_test?retryWrites=true&w=majority";

const generateAuthor = () => {
    return {
        first_name: randomString(10),
        family_name: randomString(15),
        date_of_birth: moment(randomDate(new Date(1950, 0, 1), new Date(1960, 0, 1))).format("YYYY-MM-DD"),
        date_of_death: moment(randomDate()).format("YYYY-MM-DD")
    }
}

describe('Author', () => {

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
        const authorCollection = await mongoose.connection.db.listCollections({ name: 'authors' }).toArray();
        if (authorCollection.length !== 0) {
            await mongoose.connection.db.dropCollection('authors');
        }
    });

    it('Creates a new author', done => {
        const newAuthor = generateAuthor();

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
        const newAuthor = generateAuthor();
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
        const newAuthor1 = generateAuthor();
        const newAuthor2 = { ...newAuthor1 }
        const newAuthor3 = { ...newAuthor1 }

        await request.post('/catalog/author/create').send(newAuthor1);
        await request.post('/catalog/author/create').send(newAuthor2);
        await request.post('/catalog/author/create').send(newAuthor3);

        request
            .get('/catalog/authors')
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.author_list.length).toBe(3);

                done();
            });
    });

    it('Gets author detail', async done => {
        const newAuthor = generateAuthor();

        const resCreate = await request.post('/catalog/author/create').send(newAuthor);

        request
            .get(`/catalog/author/${resCreate.body.id}`)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.author.first_name).toBe(newAuthor.first_name);
                expect(res.body.author.family_name).toBe(newAuthor.family_name);
                expect(res.body.author_books).toStrictEqual([]);

                done();
            });
    });

    it('Author not found in detail', async done => {
        const newAuthor = generateAuthor();
        const resCreate = await request.post('/catalog/author/create').send(newAuthor);

        const newAuthorId = changeId(resCreate.body.id);

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
        const newAuthor = generateAuthor();

        const resCreate = await request.post('/catalog/author/create').send(newAuthor);

        request
            .delete(`/catalog/author/${resCreate.body.id}`)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.message).toBe(`Author ${resCreate.body.id} deleted successfully`)

                done();
            });
    });

    it('Author not found in delete', async done => {
        const newAuthor = generateAuthor();
        const resCreate = await request.post('/catalog/author/create').send(newAuthor);

        const newAuthorId = changeId(resCreate.body.id);

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

    it('Updates author', async done => {
        const newAuthor1 = generateAuthor();
        const newAuthor2 = generateAuthor();

        const resCreate = await request.post('/catalog/author/create').send(newAuthor1);

        request
            .put(`/catalog/author/${resCreate.body.id}`)
            .send(newAuthor2)
            .end(function (err, res) {

                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body.message).toBe(`Author ${resCreate.body.id} updated successfully`)

                done();
            });
    });

    it('Author not found in update', async done => {
        const newAuthor = generateAuthor();
        const resCreate = await request.post('/catalog/author/create').send(newAuthor);

        const newAuthorId = changeId(resCreate.body.id);

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
        const newAuthor = generateAuthor();
        const resCreate = await request.post('/catalog/author/create').send(newAuthor);

        request
            .put(`/catalog/author/${resCreate.body.id}`)
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
        const newAuthor1 = generateAuthor();
        const newAuthor2 = { ...newAuthor1 };
        newAuthor2.date_of_birth = "123";
        newAuthor2.date_of_death = "123";

        const resCreate = await request.post('/catalog/author/create').send(newAuthor1);

        request
            .put(`/catalog/author/${resCreate.body.id}`)
            .send(newAuthor2)
            .end(function (err, res) {
                if (err) return done(err);

                expect(res.status).toBe(422);
                expect(res.body.errors).toContainEqual({ "date_of_birth": "Invalid date of birth" });
                expect(res.body.errors).toContainEqual({ "date_of_death": "Invalid date of death" });

                done();
            });
    });


    //TODO Cannot delete author because there are associated books
});