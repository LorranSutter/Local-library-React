const app = require('../app');
const { changeId, randomString } = require('./randomGenerator');

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
        mongoose.connection.dropDatabase();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await mongoose.connection.db.dropCollection('authors');
    });

    // it('Creates a new author', done => {
    //     const newGenre = {
    //         first_name: randomString(10),
    //         family_name: randomString(15),
    //         date_of_birth: "1940-04-10",
    //         date_of_death: "2007-07-18"
    //     }

    //     request
    //         .post('/catalog/genre/create')
    //         .send(newGenre)
    //         .end(function (err, res) {
    //             if (err) return done(err);

    //             expect(res.status).toBe(201);
    //             expect(res.body.id).toMatch(/[\d\w]{24}/);
    //             expect(res.body.message).toBe(`Genre ${newGenre.name} created successfully`);

    //             done();
    //         });
    // });
});