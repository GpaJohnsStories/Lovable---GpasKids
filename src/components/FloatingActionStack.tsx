import React from 'react';
import { useLocation } from 'react-router-dom';
import ReportProblemButton from './ReportProblemButton';
import ScrollToTop from './ScrollToTop';
import BreakGuide from './break/BreakGuide';
import ContrastToggleButton from './ContrastToggleButton';

const FloatingActionStack = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/buddys_admin');

  if (isAdminPage) return null;

  return (
    <div className="fixed bottom-[86px] right-4 z-50 flex flex-col items-center gap-0 print:hidden bg-[#F9731633] border-2 border-[#F97316] rounded-lg p-2">
      <div className="-mb-[8px]">
        <ScrollToTop inline alwaysVisible />
      </div>
      <BreakGuide inline />
      <ContrastToggleButton inline />
    </div>
  );
};

export default FloatingActionStack;