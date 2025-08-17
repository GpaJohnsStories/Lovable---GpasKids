import { useState, useEffect } from 'react';

export const usePersonalId = () => {
  const [personalId, setPersonalIdState] = useState<string>('');

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('personalId');
    if (stored) {
      setPersonalIdState(stored);
    }
  }, []);

  const setPersonalId = (id: string) => {
    setPersonalIdState(id);
    if (id) {
      localStorage.setItem('personalId', id);
    } else {
      localStorage.removeItem('personalId');
    }
  };

  return {
    personalId,
    setPersonalId
  };
};