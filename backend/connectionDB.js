//Import the mongoose module
const mongoose = require('mongoose');

const MONGOURI = '<your-url>'
const mongoDB = process.env.MONGODB_URI || MONGOURI;

const InitiateMongoServer = async () => {
    try {
        await mongoose.connect(mongoDB, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        });
        console.log("Connected to DB !!");

        const db = mongoose.connection;

        //Bind connection to error event (to get notification of connection errors)
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    } catch (e) {
        console.log(e);
        throw e;
    }
};

module.exports = InitiateMongoServer;
