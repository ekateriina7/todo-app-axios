const { v4: uuidv4 } = require('uuid');
const pg = require('pg');

const { Client } = pg;
const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: '123123',
  database: 'postgres',
});

async function connectClient() {
  await client.connect();
}

connectClient().catch(console.error);


const getAll = async () => {
  const result = await client.query('SELECT * FROM todos');
  console.log(result.rows)
  return result.rows;
};

const getById = async (id) => {
  const result = await client.query(`
  SELECT * FROM todos
  WHERE id = '${id}'
  `);
  console.log(result.rows[0])
  return result.rows[0];
};

const create = async (title) => {
  const id = uuidv4()
  await client.query(`
  INSERT INTO todos (id, title)
  VALUES ('${id}', '${title}')
  `);
  return getById(id);
};

const remove = async (id) => {
  const newTodos = todos.filter(item => item.id !== id);
  const success = newTodos.length !== todos.length;
  if (success) {
    todos = newTodos;
  }
  return success;
};

const update = async ({ id, title, completed }) => {
  const todo = await getById(id);
  if (!todo) return null;

  const fields = [];
  if (title !== undefined) {
    fields.push(`title = '${title}'`);
  }
  if (completed !== undefined) {
    fields.push(`completed = ${completed}`);
  }
  if (fields.length === 0) return todo;

  const query = `
    UPDATE todos
    SET ${fields.join(', ')}
    WHERE id = '${id}'
  `;

  await client.query(query);
  return await getById(id);
};

const updateAll = async (items) => {
  for (const { id, title, completed } of items) {
    const todo = todos.find(item => item.id === id);
    if (!todo) continue;
    Object.assign(todo, { title, completed });
  }
};

const deleteAll = async (ids) => {
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
