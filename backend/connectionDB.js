//Import the mongoose module
const mongoose = require('mongoose');

const dev_db_url = "mongodb+srv://lorran:BCDV1007@cluster0-lyl06.gcp.mongodb.net/local_library?retryWrites=true&w=majority";
const mongoDB = process.env.MONGODB_URI || dev_db_url;

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
