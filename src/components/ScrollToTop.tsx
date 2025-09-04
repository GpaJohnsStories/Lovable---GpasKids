
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCachedIcon } from '@/hooks/useCachedIcon';

const ScrollToTop = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/buddys_admin');
  const [showButton, setShowButton] = useState(false);
  const { iconUrl, isLoading } = useCachedIcon('!CO-PUP.gif');

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
    <div className="fixed bottom-[220px] left-4 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={scrollToTop}
              data-allow-superav-passthrough="true"
              variant="link"
              className="p-0 m-0 bg-transparent hover:bg-transparent border-none shadow-none h-auto w-auto focus:ring-0 focus:outline-none no-underline hover:no-underline cursor-pointer"
              aria-label="Go to top of page and menu"
            >
              {iconUrl ? (
                <img 
                  src={iconUrl} 
                  alt="Go to top" 
                  className="h-[65px] w-[65px]"
                />
              ) : (
                <ArrowUp className="h-8 w-8 text-orange-500" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-[#60a5fa] border-[#60a5fa]">
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
