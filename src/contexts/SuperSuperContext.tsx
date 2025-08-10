import React, { createContext, useContext, useRef, useCallback } from 'react';

interface SuperSuperContextType {
  registerInstance: (id: string, closeHandler: () => void) => void;
  unregisterInstance: (id: string) => void;
  closeAllInstances: () => void;
}

const SuperSuperContext = createContext<SuperSuperContextType | null>(null);

export const useSuperSuperContext = () => {
  const context = useContext(SuperSuperContext);
  if (!context) {
    throw new Error('useSuperSuperContext must be used within a SuperSuperProvider');
  }
  return context;
};

export const SuperSuperProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const instancesRef = useRef<Map<string, () => void>>(new Map());

  const registerInstance = useCallback((id: string, closeHandler: () => void) => {
    instancesRef.current.set(id, closeHandler);
  }, []);

  const unregisterInstance = useCallback((id: string) => {
    instancesRef.current.delete(id);
  }, []);

  const closeAllInstances = useCallback(() => {
    instancesRef.current.forEach((closeHandler) => {
      closeHandler();
    });
    instancesRef.current.clear();
  }, []);

  const value = {
    registerInstance,
    unregisterInstance,
    closeAllInstances,
  };

  return (
    <SuperSuperContext.Provider value={value}>
      {children}
    </SuperSuperContext.Provider>
  );
};