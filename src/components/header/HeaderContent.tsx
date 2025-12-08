import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useHelp } from "@/contexts/HelpContext";
import { useCachedIcon } from "@/hooks/useCachedIcon";
import SimpleVerticalMenu from "./SimpleVerticalMenu";
import { useSuperAVContext } from '@/contexts/SuperAVContext';

interface HeaderContentProps {
  isHomePage: boolean;
  isAdminPage?: boolean;
}

const HeaderContent = ({ isHomePage, isAdminPage = false }: HeaderContentProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showHelp } = useHelp();
  const { closeAllInstances } = useSuperAVContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Use cached icons for Buddy and Menu button - v2.0 with proper icon caching
  const { iconUrl: buddyIconUrl, isLoading: buddyLoading, error: buddyError } = useCachedIcon('!CO-BG1.gif', true); // Force refresh
  
  // Debug logging for Buddy icon
  console.log('🐕 Buddy Icon Debug:', {
    iconPath: '!CO-BG1.gif',
    iconUrl: buddyIconUrl,
    isLoading: buddyLoading,
    error: buddyError
  });
  const { iconUrl: menuIconUrl, isLoading: menuLoading, error: menuError } = useCachedIcon('!CO-TB2.gif');
  const { iconUrl: safeForKidsIconUrl, isLoading: sfkLoading, error: sfkError } = useCachedIcon('!CO-SFK.gif');
  const { iconUrl: dancingGifUrl, iconName: dancingIconName, isLoading: dancingLoading, error: dancingError } = useCachedIcon('!CO-TBX.gif');

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
    // Close all SuperAV instances before opening menu
    closeAllInstances();
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
      <div className="relative flex items-start justify-between h-full pt-px sm:pt-1">
        
        {/* LEFT SECTION: Buddy + Title */}
        <div className="flex items-start gap-4 justify-start">
          <Tooltip delayDuration={0} disableHoverableContent={false}>
            <TooltipTrigger asChild>
              <button 
                onClick={handleHelpClick}
                onMouseDown={() => console.log('🐕 Buddy button mouse down!')}
                onMouseUp={() => console.log('🐕 Buddy button mouse up!')}
                onTouchStart={() => console.log('🐕 Buddy button touch start!')}
                onTouchEnd={() => console.log('🐕 Buddy button touch end!')}
                className="group relative z-10 bg-gradient-to-br from-green-600/80 to-green-700/60 hover:from-red-600/80 hover:to-red-700/60 backdrop-blur-sm rounded-lg p-[2px] flex flex-col items-center text-center w-16 h-16 sm:w-[5.5rem] sm:h-[5.5rem] md:w-[7rem] md:h-[7rem] min-w-16 sm:min-w-[5.5rem] md:min-w-[7rem] flex-shrink-0 shadow-[0_8px_16px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] border-[2px] border-green-600 hover:border-red-600 transform hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95"
              >
                {/* Loading state for Buddy */}
                {buddyLoading && (
                  <div className="w-full h-full bg-green-300 animate-pulse rounded-[6px]" />
                )}
                
                {/* Show icon code if no icon available, otherwise show Buddy image */}
                {(buddyError || !buddyIconUrl) && !buddyLoading ? (
                  <div className="w-full h-full bg-green-200 flex items-center justify-center text-green-800 text-xs font-bold rounded-[6px]">
                    !CO-BG1.gif
                  </div>
                ) : buddyIconUrl && !buddyLoading && !buddyError ? (
                  <img 
                    src={buddyIconUrl}
                    alt="Buddy the Helper Dog"
                    className="w-full h-full object-cover rounded-[6px]"
                  />
                ) : null}
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-yellow-100 text-black border-2 border-yellow-600 font-bold text-base px-3 py-2 z-[10030]"
              sideOffset={8}
            >
              <p>Click for Buddy's Help</p>
            </TooltipContent>
          </Tooltip>
          
          {/* Website Title and Subtitle */}
          <div className="text-left self-end">
            <div className="text-lg sm:text-2xl font-bold font-handwritten">
              <div className="text-left text-white text-xl sm:text-3xl">Stories<br />for<br />Kids</div>
            </div>
            
          </div>
        </div>

        {/* CENTER SECTION: Dancing GIF + Safe For Kids - Horizontally centered, top aligned */}
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2">
          {isHomePage ? (
            <div className="relative hidden md:flex md:justify-center md:items-center">
              <div className="relative">
                {dancingLoading && (
                  <div className="w-48 lg:w-64 h-32 lg:h-40 rounded-full border-4 border-white bg-blue-300 animate-pulse flex items-center justify-center">
                    <span className="text-blue-800 text-sm font-bold">Loading...</span>
                  </div>
                )}
                {(dancingError || !dancingGifUrl) && !dancingLoading ? (
                  <div className="w-48 lg:w-64 h-32 lg:h-40 rounded-full border-4 border-white bg-blue-200 flex items-center justify-center shadow-[inset_0_12px_20px_rgba(0,0,0,0.5),inset_0_6px_12px_rgba(0,0,0,0.3),inset_0_2px_6px_rgba(0,0,0,0.2)]">
                    <span className="text-blue-800 text-sm font-bold text-center">!CO-TBX.gif</span>
                  </div>
                ) : dancingGifUrl && !dancingLoading && !dancingError ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <img 
                        src={dancingGifUrl}
                        alt={dancingIconName || "Dancing children"}
                        className="w-48 lg:w-64 h-32 lg:h-40 rounded-full border-4 border-white shadow-[inset_0_12px_20px_rgba(0,0,0,0.5),inset_0_6px_12px_rgba(0,0,0,0.3),inset_0_2px_6px_rgba(0,0,0,0.2)] object-cover object-left cursor-pointer"
                      />
                    </TooltipTrigger>
                    <TooltipContent 
                      side="bottom" 
                      align="center"
                      className="font-bold z-[10030]"
                    >
                      {dancingIconName || "Dancing children"}
                    </TooltipContent>
                  </Tooltip>
                ) : null}
                {/* Safe For Kids Shield - Now moved to right section next to menu */}
              </div>
            </div>
          ) : (
            // Safe For Kids Shield for non-home pages - now moved to right section
            null
          )}
        </div>

        {/* RIGHT SECTION: ICO-HGJ + Safe For Kids + Gold Menu Button - Hidden on admin pages */}
        {!isAdminPage && (
          <div className="flex items-start gap-4 justify-end relative" ref={menuRef} style={{ zIndex: 10001 }}>
            {/* Mobile: Safe for Kids only */}
            <div className="sm:hidden flex flex-col items-center mt-0">
              {/* Safe For Kids Icon */}
              <div className="flex items-center">
                {sfkLoading && (
                  <div className="w-16 h-16 bg-green-300 animate-pulse rounded-full border-2 border-green-500" />
                )}
                {(sfkError || !safeForKidsIconUrl) && !sfkLoading ? (
                  <div className="w-16 h-16 bg-green-200 flex items-center justify-center text-green-800 text-xs font-bold rounded-full border-2 border-green-500">
                    !CO-SFK.gif
                  </div>
                ) : safeForKidsIconUrl && !sfkLoading && !sfkError ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/security">
                        <button className="transition-transform duration-200 hover:scale-105 active:scale-95">
                          <img 
                            src={safeForKidsIconUrl}
                            alt="Safe For Kids Shield - Click for Security Info"
                            className="w-16 h-16 object-contain cursor-pointer"
                          />
                        </button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to read Grandpa John's Safety Promise to you!</p>
                    </TooltipContent>
                  </Tooltip>
                ) : null}
              </div>
            </div>

            {/* Desktop: Safe For Kids Icon (Hidden on mobile) */}
            <div className="hidden sm:flex items-center">
              {sfkLoading && (
                <div className="w-16 h-16 sm:w-[5.5rem] sm:h-[5.5rem] md:w-[7rem] md:h-[7rem] bg-green-300 animate-pulse rounded-full border-2 border-green-500" />
              )}
              {(sfkError || !safeForKidsIconUrl) && !sfkLoading ? (
                <div className="w-16 h-16 sm:w-[5.5rem] sm:h-[5.5rem] md:w-[7rem] md:h-[7rem] bg-green-200 flex items-center justify-center text-green-800 text-xs font-bold rounded-full border-2 border-green-500">
                  !CO-SFK.gif
                </div>
              ) : safeForKidsIconUrl && !sfkLoading && !sfkError ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/security">
                      <button className="transition-transform duration-200 hover:scale-105 active:scale-95">
                        <img 
                          src={safeForKidsIconUrl}
                          alt="Safe For Kids Shield - Click for Security Info"
                          className="w-16 h-16 sm:w-[5.5rem] sm:h-[5.5rem] md:w-[7rem] md:h-[7rem] object-contain cursor-pointer"
                        />
                      </button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to read Grandpa John's Safety Promise to you!</p>
                  </TooltipContent>
                </Tooltip>
              ) : null}
            </div>
            
            {/* Gold Menu Button */}
            <nav role="navigation" aria-label="Main navigation">
              <button 
                onClick={handleMenuClick}
                data-allow-superav-passthrough="true"
                aria-label="Open main navigation menu"
                aria-expanded={isMenuOpen}
                aria-haspopup="menu"
                id="main-menu"
                className="group relative z-10 bg-gradient-to-br from-yellow-500/80 to-yellow-600/60 hover:from-yellow-400/80 hover:to-yellow-500/60 backdrop-blur-sm rounded-lg p-2 flex flex-col items-center text-center w-16 h-16 sm:w-[5.5rem] sm:h-[5.5rem] md:w-[7rem] md:h-[7rem] min-w-16 sm:min-w-[5.5rem] md:min-w-[7rem] flex-shrink-0 shadow-[0_8px_16px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] border-2 border-yellow-500 hover:border-yellow-400 transform hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95"
              >
              {/* Loading state for Menu */}
              {menuLoading && (
                <div className="w-full h-12 sm:h-18 md:h-24 bg-yellow-300 animate-pulse rounded-md" />
              )}
              
              {/* Show text if no icon available, otherwise show Menu image - hidden on hover */}
              {(menuError || !menuIconUrl) && !menuLoading ? (
                <div className="w-full h-12 sm:h-18 md:h-24 bg-yellow-200 flex items-center justify-center text-yellow-800 text-xs font-bold rounded-md group-hover:hidden">
                  !CO-TB2.gif
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
            </nav>
            
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