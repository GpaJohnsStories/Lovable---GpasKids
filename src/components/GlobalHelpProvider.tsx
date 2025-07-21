
import React from 'react';
import { useHelp } from '@/contexts/HelpContext';
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
    storyData,
    hideHelp
  } = useHelp();

  console.log('🌐 GlobalHelpProvider render - isHelpOpen:', isHelpOpen);

  return (
    <>
      {children}
      <HelpPopup
        isOpen={isHelpOpen}
        onClose={hideHelp}
        helpContent={helpContent}
        isLoading={isLoading}
        currentRoute={currentRoute}
        storyData={storyData}
      />
    </>
  );
};

export default GlobalHelpProvider;
