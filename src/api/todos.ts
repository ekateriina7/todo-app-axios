import axios from 'axios';
import { Todo } from '../store/types';

axios.defaults.baseURL = 'http://localhost:3005';

export function getAll(): Promise<Todo[]> {
  return axios.get('/todos').then(res => res.data);
}

export async function getOne(todoId: string): Promise<Todo> {
  const response = await axios.get(`/todos/${todoId}`);
  return response.data;
}

export async function addTodo(title: string): Promise<Todo> {
  const response = await axios.post('/todos', { title });
  return response.data;
}
