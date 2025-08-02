
import { useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import HeaderContent from "./header/HeaderContent";

const WelcomeHeader = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <TooltipProvider>
      {/* Main Header Banner - Now with sticky positioning */}
      <header className="sticky top-0 z-50">
        <div className="mx-auto px-4 py-2">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg border-4 border-orange-300 rounded-lg p-2">
            <HeaderContent isHomePage={isHomePage} />
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default WelcomeHeader;
