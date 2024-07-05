const {
  getAll,
  getById,
  create,
  remove,
  update,
  updateAll,
  deleteAll
} = require('../services/todo.service.js');

const get = (req, res) => {
  res.send(getAll());
};

const getByIdController = (req, res) => {
  const { id } = req.params;
  const todo = getById(id);
  if (!todo) {
    res.sendStatus(404);
    return;
  }
  res.send(todo);
};

const createController = (req, res) => {
  const { title } = req.body;
  if (!title) {
    res.sendStatus(422);
    return;
  }

  const todo = create(title);
  res.status(201).send(todo);
};

const removeController = (req, res) => {
  const { id } = req.params;
  const success = remove(id);
  if (!success) {
    res.sendStatus(404);
    return;
  }
  res.sendStatus(204);
};

const updateController = (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const todo = update(id, updates);
  if (!todo) {
    res.sendStatus(404);
    return;
  }
  res.send(todo);
};

const updateMany = (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    res.sendStatus(422);
    return;
  }
  updateAll(items);
  res.sendStatus(204);
};

const deleteMany = (req, res) => {
  const { items } = req.body;
  deleteAll(items);
  res.sendStatus(204);
};

module.exports = {
  get,
  getById: getByIdController,
  create: createController,
  remove: removeController,
  update: updateController,
  updateMany,
  deleteMany
};