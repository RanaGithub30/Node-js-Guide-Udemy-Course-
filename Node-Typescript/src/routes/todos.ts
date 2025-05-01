import { Router } from 'express';
import { Todo } from '../models/todo';

const router = Router();

const todos: Todo[] = [];

router.get('/', (req, res) => {
    res.status(200).json('Get All Todos 222');
});

router.post('/add', (req, res, next) => {
    const newTodo: Todo = {
        id: new Date().toISOString(),
        title: req.body.title,
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

export default router;