
import React from 'react';
import { useGlobalHelp } from '@/hooks/useGlobalHelp';
import HelpPopup from './HelpPopup';

interface GlobalHelpProviderProps {
  children: React.ReactNode;
}

const GlobalHelpProvider: React.FC<GlobalHelpProviderProps> = ({ children }) => {
  const {
    isHelpOpen,
    helpContent,
    isLoading,
    currentRoute,
    hideHelp
  } = useGlobalHelp();

  return (
    <>
      {children}
      <HelpPopup
        isOpen={isHelpOpen}
        onClose={hideHelp}
        helpContent={helpContent}
        isLoading={isLoading}
        currentRoute={currentRoute}
      />
    </>
  );
};

export default GlobalHelpProvider;
