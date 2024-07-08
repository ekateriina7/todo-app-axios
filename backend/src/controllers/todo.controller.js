const {
  getAll,
  getById,
  create,
  remove,
  update,
  updateAll,
  deleteAll
} = require('../services/todo.service.js');

const get = async (req, res) => {
  try {
    const todos = await getAll();
    res.send(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.sendStatus(500);
  }
};

const getByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await getById(id);
    if (!todo) {
      res.sendStatus(404);
      return;
    }
    res.send(todo);
  } catch (error) {
    console.error('Error fetching todo by id:', error);
    res.sendStatus(500);
  }
};

const createController = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      res.sendStatus(422);
      return;
    }

    const todo = await create(title);
    res.status(201).send(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.sendStatus(500);
  }
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
