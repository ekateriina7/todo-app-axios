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

export async function deleteTodo(todoId: string): Promise<string> {
  const response = await axios.delete(`/todos/${todoId}`);
  return response.statusText;
}

export async function updateTodo(todoId: string, updates: Partial<Todo>): Promise<Todo> {
  const response = await axios.patch(`/todos/${todoId}`, updates);
  return response.data;
}

export async function deleteAllCompletedTodos(ids: string[]): Promise<void> {
  await axios.patch('/todos?action=delete', { items: ids });
}

export async function toggleAllTodos(todos: Todo[]): Promise<void> {
  await axios.patch('/todos?action=update', { items: todos });
}
