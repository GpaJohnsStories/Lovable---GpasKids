
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

  console.log('🌐 GlobalHelpProvider render - isHelpOpen:', isHelpOpen);

  return (
    <>
      {children}
      {/* Temporary debug indicator */}
      {isHelpOpen && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'red',
          color: 'white',
          padding: '20px',
          zIndex: 9999,
          border: '3px solid yellow'
        }}>
          HELP STATE IS OPEN! Current route: {currentRoute}
        </div>
      )}
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
