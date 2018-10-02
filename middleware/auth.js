const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function auth(req, res, next) {
    const token = req.header('x-auth');

    if (!token)
        return res.status(401).send('Access denied. Token is not provided.');

    try {
        const decodedPayLoad = jwt.verify(token, config.get('key'));
        req.user = decodedPayLoad;
        next();
    } catch (e) {
        res.status(400).send('Invalid token.');
    }
};