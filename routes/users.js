const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const {User} = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
    User.find()
        .then(users => res.send(users))
        .catch(e => res.status(400).send(e.message));
});

router.get('/me', auth, (req, res) => {
    User.findById(req.user._id)
        .then(user => {
            if (!user)
                return res.status(404).send('User not found.');
            res.send(user);
        })
        .catch(e => res.status(400).send(e.message));
});

router.post('/', async (req, res) => {
    let user = await User.findOne({email: req.body.email});
    if (user)
        return res.status(400).send('User already exists.');

    user = new User(req.body);

    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(user.password, salt);

    const token = user.generateToken();

    user.save()
        .then(user => res.header('x-auth', token).send(_.pick(user, ['_id', 'name', 'email'])))
        .catch(e => res.status(400).send(e.message));
});

module.exports = router;