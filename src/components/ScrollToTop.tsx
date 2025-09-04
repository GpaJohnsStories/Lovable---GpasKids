
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ScrollToTop = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/buddys_admin');
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!showButton || isAdminPage) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={scrollToTop}
              data-allow-superav-passthrough="true"
              size="sm"
              className="rounded-full shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white border-2 border-orange-600 hover:border-orange-500 transition-all duration-300 hover:scale-105 px-4 py-2 shadow-[0_4px_8px_rgba(0,0,0,0.3),0_2px_4px_rgba(255,140,0,0.4)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.4),0_3px_6px_rgba(255,140,0,0.5)]"
              aria-label="Go to top of page and menu"
            >
              {/* Placeholder for !CO-PUP.gif - upload the file first */}
              <img 
                src="/path-to-CO-PUP.gif" 
                alt="Go to top" 
                className="h-6 w-6"
                onError={(e) => {
                  // Fallback to ArrowUp icon if image doesn't load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.setAttribute('style', 'display: inline-block;');
                }}
              />
              <ArrowUp className="h-4 w-4 ml-2" style={{ display: 'none' }} />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-[#ADD8E6] border-[#ADD8E6]">
            <p className="font-fun text-21px font-bold text-white" style={{
              textShadow: '2px 2px 0px #666, 4px 4px 0px #333, 6px 6px 8px rgba(0,0,0,0.3)',
              fontFamily: 'Arial, sans-serif'
            }}>Go to Top of Page & the Menu</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ScrollToTop;
