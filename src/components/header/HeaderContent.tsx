import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useHelp } from "@/contexts/HelpContext";
import { useCachedIcon } from "@/hooks/useCachedIcon";
import SimpleVerticalMenu from "./SimpleVerticalMenu";

interface HeaderContentProps {
  isHomePage: boolean;
  isAdminPage?: boolean;
}

const HeaderContent = ({ isHomePage, isAdminPage = false }: HeaderContentProps) => {
  const location = useLocation();
  const { showHelp } = useHelp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Use cached icons for Buddy and Menu button - v2.0 with proper icon caching
  const { iconUrl: buddyIconUrl, isLoading: buddyLoading, error: buddyError } = useCachedIcon('ICO-HL2.gif');
  const { iconUrl: menuIconUrl, isLoading: menuLoading, error: menuError } = useCachedIcon('ICO-MU2.gif');
  const { iconUrl: safeForKidsIconUrl, isLoading: sfkLoading, error: sfkError } = useCachedIcon('ICO-SFK.gif');
  const { iconUrl: hgjIconUrl, isLoading: hgjLoading, error: hgjError } = useCachedIcon('ICO-HGJ.gif');

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleHelpClick = () => {
    console.log('🐕 Buddy clicked! Showing help for:', location.pathname);
    showHelp(location.pathname);
  };

  const handleMenuClick = () => {
    console.log('🎯 Menu button clicked, current state:', isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuMouseEnter = () => {
    setIsMenuHovered(true);
  };

  const handleMenuMouseLeave = () => {
    setIsMenuHovered(false);
  };

  return (
    <div className="min-h-[140px]">
      {/* Single compartment layout */}
      <div className="relative flex items-center justify-between h-full pt-1">
        
        {/* LEFT SECTION: Buddy + Title */}
        <div className="flex items-start gap-4 justify-start">
          <button 
            onClick={handleHelpClick}
            onMouseDown={() => console.log('🐕 Buddy button mouse down!')}
            onMouseUp={() => console.log('🐕 Buddy button mouse up!')}
            className="group relative z-10 bg-gradient-to-br from-green-600/80 to-green-700/60 hover:from-red-600/80 hover:to-red-700/60 backdrop-blur-sm rounded-lg p-2 flex flex-col items-center text-center w-16 h-16 sm:w-[5.5rem] sm:h-[5.5rem] md:w-[7rem] md:h-[7rem] min-w-16 sm:min-w-[5.5rem] md:min-w-[7rem] flex-shrink-0 shadow-[0_8px_16px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] border-2 border-green-600 hover:border-red-600 transform hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95"
          >
            {/* Loading state for Buddy */}
            {buddyLoading && (
              <div className="w-full h-12 sm:h-18 md:h-24 bg-green-300 animate-pulse rounded-md group-hover:hidden" />
            )}
            
            {/* Show text if no icon available, otherwise show Buddy image - hidden on hover */}
            {(buddyError || !buddyIconUrl) && !buddyLoading ? (
              <div className="w-full h-12 sm:h-18 md:h-24 bg-green-200 flex items-center justify-center text-green-800 text-xs font-bold rounded-md group-hover:hidden">
                BUDDY
              </div>
            ) : buddyIconUrl && !buddyLoading && !buddyError ? (
              <img 
                src={buddyIconUrl}
                alt="Buddy the Helper Dog"
                className="w-full h-12 sm:h-18 md:h-24 object-cover rounded-md group-hover:hidden"
              />
            ) : null}
            
            {/* Help text - shown on hover */}
            <div className="hidden group-hover:flex items-center justify-center h-full text-[#EAB308] text-xs sm:text-sm md:text-base font-bold text-center">
              Click for Buddy's Help
            </div>
          </button>
          
          {/* Website Title and Subtitle */}
          <div className="text-left self-end">
            <div className="text-lg sm:text-2xl font-bold font-handwritten">
              <div className="text-blue-900">Grandpa John's</div>
              <div className="text-left text-white text-xl sm:text-3xl">Stories for Kids</div>
            </div>
            <p className="text-amber-100 text-xs sm:text-sm font-medium">Where every story feels like a new adventure</p>
          </div>
        </div>

        {/* CENTER SECTION: Dancing GIF + Safe For Kids - Horizontally centered, top aligned */}
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2">
          {isHomePage ? (
            <div className="relative hidden md:flex md:justify-center md:items-center">
              <div className="relative">
                <img 
                  src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExczNveHBjNDkxcDNwMG5mcHh2dmxvYXlycm4zZjF5a3BxaWRxb3VoNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cMALqIjmb7ygw/giphy.gif"
                  alt="Fun dancing GIF"
                  className="w-48 lg:w-64 h-32 lg:h-40 rounded-full border-4 border-white shadow-[inset_0_12px_20px_rgba(0,0,0,0.5),inset_0_6px_12px_rgba(0,0,0,0.3),inset_0_2px_6px_rgba(0,0,0,0.2)] object-cover object-left"
                />
                {/* Speech Bubble Image - Positioned to the right of GIF */}
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                  <img 
                    src="/lovable-uploads/9b3a12df-2473-4574-9762-76224ff8b67d.png" 
                    alt="Speech bubble"
                    className="w-16 lg:w-20 h-16 lg:h-20 object-contain"
                    onLoad={() => console.log('New speech bubble image loaded successfully')}
                    onError={(e) => console.log('New speech bubble image failed to load:', e)}
                  />
                </div>
                {/* Safe For Kids Shield - Positioned to the right of speech bubble */}
                <div className="absolute -right-28 lg:-right-32 top-1/2 transform -translate-y-1/2">
                  {sfkLoading && (
                    <div className="w-12 sm:w-18 md:w-24 h-12 sm:h-18 md:h-24 bg-green-300 animate-pulse rounded-full border-2 border-green-500" />
                  )}
                  {(sfkError || !safeForKidsIconUrl) && !sfkLoading ? (
                    <div className="w-12 sm:w-18 md:w-24 h-12 sm:h-18 md:h-24 bg-green-200 flex items-center justify-center text-green-800 text-xs font-bold rounded-full border-2 border-green-500">
                      SAFE
                    </div>
                  ) : safeForKidsIconUrl && !sfkLoading && !sfkError ? (
                    <img 
                      src={safeForKidsIconUrl}
                      alt="Safe For Kids Shield"
                      className="w-12 sm:w-18 md:w-24 h-12 sm:h-18 md:h-24 object-contain"
                    />
                  ) : null}
                </div>
                </div>
                
                {/* ICO-HGJ Icon - Positioned between Safe for Kids and Menu button */}
                <div className="absolute -right-14 lg:-right-16 top-1/2 transform -translate-y-1/2">
                  {hgjLoading && (
                    <div className="w-12 sm:w-18 md:w-24 h-12 sm:h-18 md:h-24 bg-gray-300 animate-pulse rounded-full border-2 border-gray-500" />
                  )}
                  {(hgjError || !hgjIconUrl) && !hgjLoading ? (
                    <div className="w-12 sm:w-18 md:w-24 h-12 sm:h-18 md:h-24 bg-gray-200 flex items-center justify-center text-gray-800 text-xs font-bold rounded-full border-2 border-gray-500">
                      HGJ
                    </div>
                  ) : hgjIconUrl && !hgjLoading && !hgjError ? (
                    <img 
                      src={hgjIconUrl}
                      alt="HGJ Icon"
                      className="w-12 sm:w-18 md:w-24 h-12 sm:h-18 md:h-24 object-contain"
                    />
                  ) : null}
                </div>
            </div>
          ) : (
            /* Safe For Kids Shield for non-home pages - centered */
            <div className="w-48 lg:w-64 h-32 lg:h-40 flex items-center justify-center">
              <div className="flex items-center justify-center">
                {sfkLoading && (
                  <div className="w-12 sm:w-18 md:w-24 h-12 sm:h-18 md:h-24 bg-green-300 animate-pulse rounded-full border-2 border-green-500" />
                )}
                {(sfkError || !safeForKidsIconUrl) && !sfkLoading ? (
                  <div className="w-12 sm:w-18 md:w-24 h-12 sm:h-18 md:h-24 bg-green-200 flex items-center justify-center text-green-800 text-sm font-bold rounded-full border-2 border-green-500">
                    SAFE
                  </div>
                ) : safeForKidsIconUrl && !sfkLoading && !sfkError ? (
                  <img 
                    src={safeForKidsIconUrl}
                    alt="Safe For Kids Shield"
                    className="w-12 sm:w-18 md:w-24 h-12 sm:h-18 md:h-24 object-contain"
                  />
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SECTION: Gold Menu Button - Hidden on admin pages */}
        {!isAdminPage && (
          <div className="flex justify-end relative" ref={menuRef}>
            <button 
              onClick={handleMenuClick}
              aria-label="Click for Menu"
              className="group relative z-10 bg-gradient-to-br from-yellow-500/80 to-yellow-600/60 hover:from-yellow-400/80 hover:to-yellow-500/60 backdrop-blur-sm rounded-lg p-2 flex flex-col items-center text-center w-16 h-16 sm:w-[5.5rem] sm:h-[5.5rem] md:w-[7rem] md:h-[7rem] min-w-16 sm:min-w-[5.5rem] md:min-w-[7rem] flex-shrink-0 shadow-[0_8px_16px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] border-2 border-yellow-500 hover:border-yellow-400 transform hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95"
            >
              {/* Loading state for Menu */}
              {menuLoading && (
                <div className="w-full h-12 sm:h-18 md:h-24 bg-yellow-300 animate-pulse rounded-md" />
              )}
              
              {/* Show text if no icon available, otherwise show Menu image - hidden on hover */}
              {(menuError || !menuIconUrl) && !menuLoading ? (
                <div className="w-full h-12 sm:h-18 md:h-24 bg-yellow-200 flex items-center justify-center text-yellow-800 text-xs font-bold rounded-md group-hover:hidden">
                  MENU
                </div>
              ) : menuIconUrl && !menuLoading && !menuError ? (
                <img 
                  src={menuIconUrl}
                  alt="Main Menu"
                  className="w-full h-12 sm:h-18 md:h-24 object-cover rounded-md group-hover:hidden"
                />
              ) : null}
              
              {/* Menu help text - shown on hover */}
              <div className="hidden group-hover:flex items-center justify-center h-full text-blue-900 text-xs sm:text-sm md:text-base font-bold text-center">
                Click for Menu
              </div>
            </button>
            
            {/* Vertical Menu */}
            <SimpleVerticalMenu 
              isVisible={isMenuOpen} 
              onClose={() => setIsMenuOpen(false)} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderContent;