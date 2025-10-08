import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Todo from './Todo.mjs';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/todo-list', (req, res) => {
    return Todo.find()
        .then(data => {
            res.send(data);
        });
});

app.post('/add-todo', (req, res) => {

    const { text, isDone } = req.body;

    const todo = new Todo({
        text,
        isDone
    });

    return todo.save()
        .then(newTodo => {
            res.send(newTodo);
        })
        .catch(() => {
            console.log('Cannot add todo')
        });

});

app.put('/update-todo/:id', async (req, res) => {
    try {
        const { isDone } = req.body;
        const updated = await Todo.findByIdAndUpdate(req.params.id, { isDone }, { new: true });
        res.send(updated);
    } catch (err) {
        res.status(400).send({ error: 'Cannot update todo' });
    }
});

app.delete('/delete-todo/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.send({ message: 'Deleted' });
    } catch (err) {
        res.status(400).send({ error: 'Cannot delete todo' });
    }
});


app.listen(5555, () => {
    console.log('Server started to 5555')
});

const MONGO_URI = 'mongodb+srv://nester2108_db_user:566QQE5rnPtdfH9h@cluster0.93xdqnj.mongodb.net/mydatabase?retryWrites=true&w=majority';
                  

mongoose.connect(MONGO_URI);

mongoose.connection.on('open', () => {
    console.log('Mongo DB is connected');
})

mongoose.connection.on('error', () => {
    console.log('Mongo DB is failed connect');
})