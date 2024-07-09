const {
  normalize,
  getAll,
  getById,
  create,
  remove,
  update,
  updateMany,
  removeMany
} = require('../services/todo.service.js');

const get = async (req, res) => {
  try {
    const todos = await getAll();
    res.send(todos.map(normalize));
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
    res.send(normalize(todo));
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
    res.status(201).send(normalize(todo));
  } catch (error) {
    console.error('Error creating todo:', error);
    res.sendStatus(500);
  }
};

const removeController = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await remove(id);
    if (!success) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  } catch (error) {
    console.error('Error removing todo:', error);
    res.sendStatus(500);
  }
};

const updateController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const todo = await update({ id, title, completed });
    if (!todo) {
      res.sendStatus(404);
      return;
    }
    res.send(normalize(todo));
  } catch (error) {
    console.error('Error updating todo:', error);
    res.sendStatus(500);
  }
};

const updateManyController = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      res.sendStatus(422);
      return;
    }
    await updateMany(items);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error updating todos:', error);
    res.sendStatus(500);
  }
};

const deleteManyController = async (req, res) => {
  try {
    const { items } = req.body;
    await removeMany(items);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting todos:', error);
    res.sendStatus(500);
  }
};

module.exports = {
  get,
  getById: getByIdController,
  create: createController,
  remove: removeController,
  update: updateController,
  updateMany: updateManyController,
  deleteMany: deleteManyController
};
