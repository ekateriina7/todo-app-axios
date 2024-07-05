const { v4: uuidv4 } = require('uuid');

let todos = [
  { id: '1', title: 'first', completed: false },
  { id: '2', title: 'second', completed: false },
  { id: '3', title: 'third', completed: true },
];

const getAll = () => {
  return todos;
};

const getById = (id) => {
  return todos.find((item) => item.id === id) || null;
};

const create = (title) => {
  const todo = {
    id: uuidv4(),
    title,
    completed: false,
  };
  todos.push(todo);
  return todo;
};

const remove = (id) => {
  const newTodos = todos.filter(item => item.id !== id);
  const success = newTodos.length !== todos.length;
  if (success) {
    todos = newTodos;
  }
  return success;
};

const update = (id, updates) => {
  const todo = todos.find(item => item.id === id);
  if (!todo) return null;
  Object.assign(todo, updates);
  return todo;
};

const updateAll = (items) => {
  for (const { id, title, completed } of items) {
    const todo = todos.find(item => item.id === id);
    if (!todo) continue;
    Object.assign(todo, { title, completed });
  }
};

const deleteAll = (ids) => {
  todos = todos.filter(todo => !ids.includes(todo.id));
};

module.exports = {
  getAll,
  getById,
  create,
  remove,
  update,
  updateAll,
  deleteAll
};