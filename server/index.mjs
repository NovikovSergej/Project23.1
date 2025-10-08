import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import url from 'url';
import Todo from './Todo.mjs';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, '../build')));
app.use(cors());
app.use(express.json());

app.get('/api/todo-list', (req, res) => {
    return Todo.find()
        .then(data => {
            res.send(data);
        });
});

app.post('/api/add-todo', (req, res) => {

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

app.put('/api/update-todo/:id', async (req, res) => {
    try {
        const { isDone } = req.body;
        const updated = await Todo.findByIdAndUpdate(req.params.id, { isDone }, { new: true });
        res.send(updated);
    } catch (err) {
        res.status(400).send({ error: 'Cannot update todo' });
    }
});

app.delete('/api/delete-todo/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.send({ message: 'Deleted' });
    } catch (err) {
        res.status(400).send({ error: 'Cannot delete todo' });
    }
});

const HOST = process.env.HOST || "";
const PORT = process.env.PORT || "5555";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

app.listen(PORT, HOST, () => {
    console.log(`Server started on http://${HOST}:${PORT}`);
});

mongoose.connect(MONGO_URI);

mongoose.connection.on('open', () => {
    console.log('Mongo DB is connected');
})

mongoose.connection.on('error', () => {
    console.log('Mongo DB is failed connect');
})