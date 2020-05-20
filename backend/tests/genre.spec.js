const app = require('../app');
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
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('Gets the test endpoint', async done => {
        const res = await request.get('/');

        console.log(res.body);
      
        done()
      })
});