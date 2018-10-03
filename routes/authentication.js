const express = require('express');
const passport = require('passport');
const Joi = require('joi');

const {User} = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    // let user = await User.findOne({email: req.body.email});
    // if (!user)
    //     return res.status(400).send('Invalid e-mail or password.');
    //
    // if (!user.validatePassword(req.body.password))
    //     return res.status(400).send('Invalid e-mail or password.');

    passport.authenticate('local', (err, user, info) => {
        if (err)
            return res.status(500).send(err);
        if (!user)
            return res.status(500).send(info);

        req.logIn(user, (err) => {
            if (err)
                return res.status(500).send(err);

            const token = user.generateToken();
            res.send(token);
        });
    })(req, res);

    // const token = user.generateToken();
    // res.send(token);
});

function validate(req) {
    const joiSchema = {
        email: Joi.string().email().required(),
        password: Joi.string().min(3).max(24).required()
    };
    return Joi.validate(req, joiSchema);
}

module.exports = router;