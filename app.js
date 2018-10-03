const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const morgan = require('morgan');

const users = require('./routes/users');
const todos = require('./routes/todos');
const authentication = require('./routes/authentication');

const app = express();

mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch((e) => console.log(e.message));

app.use(express.json());
app.use(morgan('common'));

app.use(session({
    name: 'Session',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000,
        httpOnly: false,
        secure: false
    },
    secret: 'secret'
}));

require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', users);
app.use('/api/todos', todos);
app.use('/api/auth', authentication);

const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`Listening on port ${port}...`));