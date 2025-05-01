"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const todos = [];
router.get('/', (req, res) => {
    res.status(200).json('Get All Todos');
});
router.post('/add', (req, res, next) => {
    const newTodo = {
        id: new Date().toISOString(),
        title: req.body.title,
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});
exports.default = router;
