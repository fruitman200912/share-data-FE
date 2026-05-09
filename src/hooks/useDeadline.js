import { useContext } from 'react';
import { DeadlineContext } from '../contexts/DeadlineContext';

export function useDeadline() {
  const context = useContext(DeadlineContext);
  if (!context) throw new Error('useDeadline must be used within DeadlineProvider');
  return context;
}
