import React, { createContext, useContext, useRef, useCallback } from 'react';

interface SuperAVContextType {
  registerInstance: (id: string, closeHandler: () => void) => void;
  unregisterInstance: (id: string) => void;
  closeAllInstances: () => void;
}

const SuperAVContext = createContext<SuperAVContextType | null>(null);

export const useSuperAVContext = () => {
  const context = useContext(SuperAVContext);
  if (!context) {
    throw new Error('useSuperAVContext must be used within a SuperAVProvider');
  }
  return context;
};

export const SuperAVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    <SuperAVContext.Provider value={value}>
      {children}
    </SuperAVContext.Provider>
  );
};