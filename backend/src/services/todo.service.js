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
  WHERE id = $1
  `, [id]);
  console.log(result.rows[0])
  return result.rows[0];
};

const create = async (title) => {
  const id = uuidv4()
  await client.query(`
  INSERT INTO todos (id, title)
  VALUES ($1, $2)
  `, [id, title]);
  return getById(id);
};

const remove = async (id) => {
  const result = await client.query(`
    DELETE FROM todos
    WHERE id = $1
  `, [id]);

  return result.rowCount > 0;
};

const update = async ({ id, title, completed }) => {
  const todo = await getById(id);
  if (!todo) return null;

  const fields = [];
  const values = [id];
  let fieldIndex = 2;

  if (title !== undefined) {
    fields.push(`title = $${fieldIndex++}`);
    values.push(title);
  }
  if (completed !== undefined) {
    fields.push(`completed = $${fieldIndex++}`);
    values.push(completed);
  }
  if (fields.length === 0) return todo;

  const query = `
    UPDATE todos
    SET ${fields.join(', ')}
    WHERE id = $1
    RETURNING *
  `;

  const result = await client.query(query, values);
  return result.rows[0];
};

const updateAll = async (todos) => {
  for (const { id, title, completed } of todos) {
    await update({ id, title, completed });
  }
};

function isUUID(id) {
  const pattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return pattern.test(id);
}

const deleteAll = async (ids) => {
  if (!ids.every(isUUID)) {
    throw new Error('Invalid UUID');
  }

  const indexes = ids.map((_, i) => `$${i + 1}`).join(', ');
  const query = `
    DELETE FROM todos
    WHERE id IN (${indexes})
  `;
  await client.query(query, ids);
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
