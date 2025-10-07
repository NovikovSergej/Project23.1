import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const todaSchema = new Schema({
    text: String,
    isDone: Boolean
})

const Todo = model('Todo', todaSchema, 'todo');

export default Todo;