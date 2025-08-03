
import { useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import HeaderContent from "./header/HeaderContent";

const WelcomeHeader = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isAdminPage = location.pathname.startsWith('/buddys_admin');
  
  // Don't render WelcomeHeader at all on admin pages
  if (isAdminPage) {
    return null;
  }

  return (
    <TooltipProvider>
      {/* Main Header Banner - Natural scrolling */}
      <header className="relative z-10">
        <div className="mx-auto px-4 py-2">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg border-4 border-orange-300 rounded-xl p-2">
            <HeaderContent isHomePage={isHomePage} isAdminPage={isAdminPage} />
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default WelcomeHeader;
