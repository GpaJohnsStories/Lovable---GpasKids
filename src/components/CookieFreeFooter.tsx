
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
          <div className="flex items-center space-x-2 text-green-700">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    to="/security"
                    onClick={scrollToTop}
                    className="block"
                  >
                    {isLoading ? (
                      <div className="w-12 h-12 bg-amber-200 rounded-full animate-pulse"></div>
                    ) : error || !iconUrl ? (
                      <div className="w-12 h-12 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full shadow-[0_6px_12px_rgba(194,65,12,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] border border-orange-700 transition-all duration-200 hover:shadow-[0_8px_16px_rgba(194,65,12,0.4),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)]">
                      </div>
                    ) : (
                      <img
                        src={iconUrl}
                        alt="Cookie-Free"
                        className="w-12 h-12 object-contain rounded-full hover:scale-110 transition-all duration-200 cursor-pointer"
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
          <div className="flex items-center space-x-1 text-amber-600 text-sm font-bold">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500" strokeWidth={3} />
            <span>for children with help from Lovable AI at Lovable.dev</span>
          </div>
          
          {/* Right Side */}
          <div className="text-amber-600 font-medium text-sm">
            © 2025 Grandpa John's Stories
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CookieFreeFooter;
