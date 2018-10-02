const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');

const {User} = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (!user)
        return res.status(400).send('Invalid e-mail or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
        return res.status(400).send('Invalid e-mail or password.');

    const token = user.generateToken();
    res.send(token);
});

function validate(req) {
    const joiSchema = {
        email: Joi.string().email().required(),
        password: Joi.string().min(3).max(24).required()
    };
    return Joi.validate(req, joiSchema);
}

module.exports = router;