const express = require('express');
const cors = require('cors');
const { get, getById, create, remove, update, updateMany, deleteMany } = require('./controllers/todo.controller.js');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/todos', get);
app.get('/todos/:id', getById);
app.post('/todos', create);
app.delete('/todos/:id', remove);
app.patch('/todos/:id', update);
app.patch('/todos', (req, res) => {
  const { action } = req.query;
  if (action === 'delete') {
    return deleteMany(req, res);
  }
  if (action === 'update') {
    return updateMany(req, res);
  }
  res.sendStatus(422);
});

app.listen(3005, () => {
  console.log('Server is running on port 3005');
});