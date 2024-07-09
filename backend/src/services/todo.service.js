const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('./db');

const Todo = sequelize.define(
  'Todo',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'todos',
    updatedAt: false,
    createdAt: false,
  },
);

const normalize = ({ id, title, completed }) => {
  return { id, title, completed };
};

const getAll = async () => {
  const result = await Todo.findAll({
    order: [['createdAt', 'DESC']],
  });
  return result.map(normalize);
};

const getById = async (id) => {
  const todo = await Todo.findByPk(id);
  return normalize(todo);
};

const create = (title) => {
  return Todo.create({ title }).then(normalize);
};

const remove = async (id) => {
  const result = await Todo.destroy({
    where: { id },
  });
  return result > 0;
};

const update = async ({ id, title, completed }) => {
  const todo = await Todo.findByPk(id);
  if (!todo) return null;

  if (title !== undefined) {
    todo.title = title;
  }
  if (completed !== undefined) {
    todo.completed = completed;
  }

  await todo.save();
  return normalize(todo);
};

const updateAll = async (todos) => {
  const updatePromises = todos.map(({ id, title, completed }) =>
    update({ id, title, completed }),
  );
  await Promise.all(updatePromises);
};

const deleteAll = async (ids) => {
  if (!ids.every(isUUID)) {
    throw new Error('Invalid UUID');
  }
  const result = await Todo.destroy({
    where: { id: ids },
  });
  return result > 0;
};

module.exports = {
  normalize,
  getAll,
  getById,
  create,
  remove,
  update,
  updateAll,
  deleteAll,
};

function isUUID(id) {
  const pattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return pattern.test(id);
}
