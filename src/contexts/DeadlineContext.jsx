import { createContext, useReducer, useCallback } from 'react';
import { deadlineService } from '../services/deadlineService';

export const DeadlineContext = createContext(null);

const initialState = {
  deadlines: [],
  upcomingDeadlines: [],
  isLoading: false,
  error: null,
};

function deadlineReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: true, error: null };
    case 'SET_DEADLINES':
      return { ...state, deadlines: action.payload, isLoading: false };
    case 'SET_UPCOMING':
      return { ...state, upcomingDeadlines: action.payload, isLoading: false };
    case 'ADD_DEADLINE':
      return { ...state, deadlines: [...state.deadlines, action.payload], isLoading: false };
    case 'UPDATE_DEADLINE': {
      const updated = action.payload;
      return {
        ...state,
        deadlines: state.deadlines.map((d) => (d.id === updated.id ? updated : d)),
        upcomingDeadlines: state.upcomingDeadlines.map((d) => (d.id === updated.id ? updated : d)).sort((a, b) => {
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }),
        isLoading: false,
      };
    }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}

export function DeadlineProvider({ children }) {
  const [state, dispatch] = useReducer(deadlineReducer, initialState);

  const loadDeadlines = useCallback(async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const deadlines = await deadlineService.getAll();
      dispatch({ type: 'SET_DEADLINES', payload: deadlines });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const loadUpcoming = useCallback(async (days = 3) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const upcoming = await deadlineService.getUpcoming(days);
      dispatch({ type: 'SET_UPCOMING', payload: upcoming });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const createDeadline = useCallback(async (data) => {
    try {
      const deadline = await deadlineService.create(data);
      dispatch({ type: 'ADD_DEADLINE', payload: deadline });
      return deadline;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, []);

  const toggleComplete = useCallback(async (id) => {
    try {
      const updated = await deadlineService.toggleComplete(id);
      dispatch({ type: 'UPDATE_DEADLINE', payload: updated });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  return (
    <DeadlineContext.Provider
      value={{ ...state, loadDeadlines, loadUpcoming, createDeadline, toggleComplete }}
    >
      {children}
    </DeadlineContext.Provider>
  );
}
