const Status = require('../models/status');

// Return list of all Status
exports.status_list = function (req, res, next) {

    Status
        .find()
        .sort([['name']])
        .exec(function (err, list_status) {
            if (err) { return next(err); }
            res.json({ list_status });
        });
};
