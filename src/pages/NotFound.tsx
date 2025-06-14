
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <WelcomeHeader />
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-orange-800">404</h1>
          <p className="text-xl text-orange-700 mb-4">Oops! Page not found</p>
          <a href="/" className="text-orange-600 hover:text-orange-700 underline">
            Return to Home
          </a>
        </div>
      </div>
      <CookieFreeFooter />
    </div>
  );
};

export default NotFound;
