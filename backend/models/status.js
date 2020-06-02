const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StatusSchema = Schema(
    {
        name: {
            type: String,
            required: true
        }
    }
);

module.exports = mongoose.model('Status', StatusSchema);