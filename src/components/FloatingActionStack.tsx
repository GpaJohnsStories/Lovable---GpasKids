import React from 'react';
import { useLocation } from 'react-router-dom';
import ReportProblemButton from './ReportProblemButton';
import ScrollToTop from './ScrollToTop';
import BreakGuide from './break/BreakGuide';

const FloatingActionStack = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/buddys_admin');

  if (isAdminPage) return null;

  return (
    <div className="fixed bottom-[86px] left-4 z-50 flex flex-col items-center gap-0 print:hidden">
      <div className="-mb-[4px]">
        <ScrollToTop inline alwaysVisible />
      </div>
      <div className="-mb-[2px]">
        <BreakGuide inline />
      </div>
      <ReportProblemButton inline />
    </div>
  );
};

export default FloatingActionStack;