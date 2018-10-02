const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    task: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedBy: {
        type: String,
        default: null
    }
});
const Todo = mongoose.model('Todo', todoSchema);

module.exports = {todoSchema, Todo};