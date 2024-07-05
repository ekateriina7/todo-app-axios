import React, { useContext } from 'react';
import { DispatchContext, StateContext } from '../../store/TodoContext';
import { ActionTypes } from '../../store/types';
import { TodoForm } from '../TodoForm/TodoForm';
import { toggleAllTodos } from '../../api/todos';

export const Header: React.FC = () => {
  const { todos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const completedTodos = todos.length && todos.every(todo => todo.completed);

  const handleToggleAll = async () => {
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !completedTodos,
    }));

    try {
      await toggleAllTodos(updatedTodos);
      dispatch({ type: ActionTypes.SET_TODOS, payload: updatedTodos });
    } catch (error) {
      console.error('Error toggling all todos:', error);
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          onClick={handleToggleAll}
          type="button"
          className={`todoapp__toggle-all ${completedTodos ? 'active' : ''}`}
          data-cy="ToggleAllButton"
        />
      )}
      <TodoForm />
    </header>
  );
};
