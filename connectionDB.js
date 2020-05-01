//Import the mongoose module
const mongoose = require('mongoose');

//Set up default mongoose connection
const dev_db_url = 'mongodb+srv://lorran:BCDV1007@cluster0-lyl06.gcp.mongodb.net/local_library?retryWrites=true&w=majority';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useFindAndModify: true });

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));