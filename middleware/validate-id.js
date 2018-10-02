const mongoose = require('mongoose');

module.exports = function validateID(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid ID.');
    next();
}