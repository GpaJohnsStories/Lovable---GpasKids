
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHelp } from '@/contexts/HelpContext';
// import HelpPopup from './HelpPopup';

interface GlobalHelpProviderProps {
  children: React.ReactNode;
}

const GlobalHelpProvider: React.FC<GlobalHelpProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const {
    isHelpOpen,
    helpContent,
    isLoading,
    currentRoute,
    storyData,
    hideHelp
  } = useHelp();

  console.log('🌐 GlobalHelpProvider render - isHelpOpen:', isHelpOpen);

  const handleNavigateToGuide = () => {
    navigate('/guide');
  };

  return (
    <>
      {children}
      {/* <HelpPopup
        isOpen={isHelpOpen}
        onClose={hideHelp}
        helpContent={helpContent}
        isLoading={isLoading}
        currentRoute={currentRoute}
        storyData={storyData}
        onNavigateToGuide={handleNavigateToGuide}
      /> */}
    </>
  );
};

export default GlobalHelpProvider;
