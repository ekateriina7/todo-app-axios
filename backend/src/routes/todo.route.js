const express = require('express');
const { get, getById, create, remove, update, updateMany, deleteMany } = require('../controllers/todo.controller');

const todoRouter = express.Router()
todoRouter.get('/', get);
todoRouter.get('/:id', getById);
todoRouter.post('/', create);
todoRouter.delete('/:id', remove);
todoRouter.patch('/:id', update);
todoRouter.patch('/', (req, res) => {
  const { action } = req.query;
  if (action === 'delete') {
    return deleteMany(req, res);
  }
  if (action === 'update') {
    return updateMany(req, res);
  }
  res.sendStatus(422);
});

module.exports = todoRouter
