const express = require('express');

const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const validateID = require('../middleware/validate-id');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
    Todo.find()
        .then(todos => res.send(todos))
        .catch(e => res.status(400).send(e.message));
});

router.get('/:id', validateID, (req, res) => {
    Todo.findById(req.params.id)
        .then(todo => {
            if (!todo)
                return res.status(404).send('Todo not found.');
            res.send(todo);
        })
        .catch(e => res.status(400).send(e.message));
});

router.post('/', auth, async (req, res) => {
    let todo = await Todo.findOne({task: req.body.task});
    if (todo)
        return res.status(400).send('Todo already exists.');

    todo = new Todo(req.body);

    todo.save()
        .then(todo => res.send(todo))
        .catch(e => res.status(400).send(e.message));
});

router.put('/:id', [auth, validateID], async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user)
        return res.status(404).send('User not found.');

    Todo.findByIdAndUpdate(req.params.id, {
            $set: {
                completed: req.body.completed,
                completedBy: user.username
            }
        }, {new: true})
        .then(todo => {
            if (!todo)
                return res.status(404).send('Todo not found.');
            res.send(todo);
        })
        .catch(e => res.status(400).send(e.message));
});

module.exports = router;