import { useContext } from 'react';
import { EditModeContext } from '@/components/providers/EditModeProvider';

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error('useEditMode deve ser usado dentro de um EditModeProvider');
  }
  return context;
}
