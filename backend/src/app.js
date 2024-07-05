const express = require('express');
const cors = require('cors');

const todoRouter = require('./routes/todo.route');

const app = express();

app.use(cors());
app.use('/todos', express.json(), todoRouter)



app.listen(3005, () => {
  console.log('Server is running on port 3005');
});
