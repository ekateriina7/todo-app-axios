import React, { useEffect, useReducer } from 'react';
import { initialState, reducer } from './todoReducer';
import { Action, ActionTypes, Todo } from './types';
import { getAll } from '../api/todos'; // Import the API function to fetch todos

export const StateContext = React.createContext(initialState);
export const DispatchContext = React.createContext((_action: Action) => {});

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

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

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};
