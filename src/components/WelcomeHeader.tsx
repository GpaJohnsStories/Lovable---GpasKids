
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
        <div className="container mx-auto px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg border-b-4 border-orange-300">
          <HeaderContent isHomePage={isHomePage} />
        </div>
      </header>
    </TooltipProvider>
  );
};

export default WelcomeHeader;
