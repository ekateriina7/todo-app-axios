import React, { useContext, useEffect, useRef, useState } from 'react';
import { DispatchContext, StateContext } from '../../store/TodoContext';
import { ActionTypes, Todo } from '../../store/types';
import { addTodo } from '../../api/todos';

export const TodoForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const dispatch = useContext(DispatchContext);
  const { todos } = useContext(StateContext);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    try {
      const newTodo = await addTodo(title.trim());
      dispatch({ type: ActionTypes.ADD_TODO, payload: newTodo });
      setTitle('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const todoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoField.current) {
      todoField.current.focus();
    }
  }, [todos]);

  return (
    <form onSubmit={onSubmit}>
      <input
        ref={todoField}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => setTitle(event.target.value)}
      />
    </form>
  );
};
