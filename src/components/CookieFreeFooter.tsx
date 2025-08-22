
import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCachedIcon } from '@/hooks/useCachedIcon';
import { useTooltipContext } from '@/contexts/TooltipContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const CookieFreeFooter = () => {
  const { iconUrl, isLoading, error } = useCachedIcon('!CO-CFF.png');
  const { registerTooltip } = useTooltipContext();

  React.useEffect(() => {
    registerTooltip('cookie-free-footer');
  }, [registerTooltip]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-amber-100 border-t border-amber-200">
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Left Side */}
          <div className="relative h-20 w-28 flex items-center text-green-700">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    to="/security"
                    onClick={scrollToTop}
                    className="block"
                  >
                    {isLoading ? (
                      <div className="w-20 h-20 bg-amber-200 rounded-full animate-pulse scale-[1.5] origin-left"></div>
                    ) : error || !iconUrl ? (
                      <img
                        src="/lovable-uploads/!CO-CFF.png"
                        alt="Cookie-Free"
                        className="w-20 h-20 object-contain rounded-full scale-[1.5] origin-left hover:scale-[1.6] transition-transform duration-200 cursor-pointer"
                      />
                    ) : (
                      <img
                        src={iconUrl}
                        alt="Cookie-Free"
                        className="w-20 h-20 object-contain rounded-full scale-[1.5] origin-left hover:scale-[1.6] transition-transform duration-200 cursor-pointer"
                      />
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cookie-Free Website - No tracking, no ads, just safe stories!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Center */}
          <div className="flex-1 flex flex-col items-center justify-center text-amber-600 text-lg font-bold px-4 text-center leading-tight">
            <div className="flex items-center flex-wrap justify-center gap-1">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 inline" strokeWidth={3} />
              <span>for children</span>
            </div>
            <div>with help from Lovable AI at Lovable.dev</div>
          </div>
          
          {/* Right Side */}
          <div className="text-amber-600 font-medium text-base">
            © 2025 Grandpa John's Stories
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CookieFreeFooter;
