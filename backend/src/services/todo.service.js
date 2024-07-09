const { v4: uuidv4 } = require('uuid');
const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('./db');

const Todo = sequelize.define(
  'Todo',
  {
    id: {
      type: DataTypes.UUID,
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
  const id = uuidv4();
  return Todo.create({ id, title }).then(normalize);
};

const remove = async (id) => {
  await Todo.destroy({
    where: { id }
  });
};

const removeMany = async (ids) => {
  await Todo.destroy({
    where: {
      id: {
        [Op.in]: ids
      }
    }
  });
};

const update = async ({ id, title, completed }) => {
  const [updated] = await Todo.update(
    { title, completed },
    { where: { id } }
  );

  if (updated) {
    const updatedTodo = await Todo.findByPk(id);
    return normalize(updatedTodo);
  }

  return null;
};

const updateMany = async (todos) => {
  return await sequelize.transaction(async (t) => {
    for (const { id, title, completed } of todos) {
      await Todo.update(
        { title, completed },
        { where: { id }, transaction: t }
      );
    }
  });
};

function isUUID(id) {
  const pattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return pattern.test(id);
}

module.exports = {
  normalize,
  getAll,
  getById,
  create,
  remove,
  removeMany,
  update,
  updateMany,
};
