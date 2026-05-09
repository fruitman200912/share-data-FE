import { useContext } from 'react';
import { BoardContext } from '../contexts/BoardContext';

export function useBoard() {
  const context = useContext(BoardContext);
  if (!context) throw new Error('useBoard must be used within BoardProvider');
  return context;
}
