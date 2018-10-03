const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        minlength: 3,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        minlength: 6,
        trim: true,
        required: true
    }
});

userSchema.methods.hashPassword = function(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateToken = function() {
    return jwt.sign({_id: this._id, admin: this.admin}, config.get('key'));
};

const User = mongoose.model('User', userSchema);

module.exports = {userSchema, User};