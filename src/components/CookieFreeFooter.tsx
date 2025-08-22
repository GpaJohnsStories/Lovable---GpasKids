
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
                      <div className="w-20 h-20 bg-amber-200 rounded-full animate-pulse"></div>
                    ) : error || !iconUrl ? (
                      <img
                        src="/lovable-uploads/!CO-CFF.png"
                        alt="Cookie-Free"
                        className="w-20 h-20 object-contain rounded-full hover:scale-110 transition-all duration-200 cursor-pointer"
                      />
                    ) : (
                      <img
                        src={iconUrl}
                        alt="Cookie-Free"
                        className="w-20 h-20 object-contain rounded-full hover:scale-110 transition-all duration-200 cursor-pointer"
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
