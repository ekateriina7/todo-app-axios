import React, { useContext, useEffect, useMemo } from 'react';
import { getAll } from '../../api/todos';
import { StateContext, DispatchContext } from '../../store/TodoContext';
import { ActionTypes, FilterFields } from '../../store/types';
import { TodoItem } from '../TodoItem/TodoItem';

export const TodoList: React.FC = () => {
  const { todos, filter } = useContext(StateContext);
  console.log(todos)
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await getAll();
        dispatch({ type: ActionTypes.SET_TODOS, payload: todos });
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, [dispatch]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterFields.Active:
          return !todo.completed;
        case FilterFields.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [todos, filter]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos?.map(todo => <TodoItem todo={todo} key={todo.id} />)}
    </section>
  );
};

