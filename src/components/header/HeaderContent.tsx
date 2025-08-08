import { useState, useRef, useEffect } from 'react';
import { useHelp } from '@/contexts/HelpContext';
import { useCachedIcon } from '@/hooks/useCachedIcon';
import SimpleVerticalMenu from './SimpleVerticalMenu';

interface HeaderContentProps {
  isHomePage: boolean;
  isAdminPage?: boolean;
}

const HeaderContent = ({ isHomePage, isAdminPage }: HeaderContentProps) => {
  // State Management
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

  // Event Handlers
  const handleHelpClick = () => {
    console.log('Help button clicked');
    showHelp('/');
  };

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuMouseEnter = () => {
    setIsMenuHovered(true);
  };

  const handleMenuMouseLeave = () => {
    setIsMenuHovered(false);
  };

  return (
    <div className="flex items-center justify-between w-full relative">
      {/* Buddy Help Button - Left Side */}
      <div className="flex items-center">
        <button
          onClick={handleHelpClick}
          className="group flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/10 transition-all duration-200"
          aria-label="Get help from Buddy"
        >
          {/* Buddy Icon */}
          <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
            {buddyLoading && (
              <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-300 animate-pulse rounded-full border-2 border-blue-500" />
            )}
            {(buddyError || !buddyIconUrl) && !buddyLoading ? (
              <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-200 flex items-center justify-center text-blue-800 text-sm font-bold rounded-full border-2 border-blue-500">
                ?
              </div>
            ) : buddyIconUrl && !buddyLoading && !buddyError ? (
              <img 
                src={buddyIconUrl}
                alt="Buddy Help Assistant"
                className="w-8 h-8 md:w-12 md:h-12 object-contain"
              />
            ) : null}
          </div>
          
          {/* Help Text */}
          <div className="hidden sm:block text-white">
            <div className="text-sm font-semibold">Buddy</div>
            <div className="text-xs opacity-90">Click for help</div>
          </div>
        </button>
      </div>

      {/* Center Content - Title and Dancing GIF or Safe for Kids */}
      <div className="flex-1 flex flex-col items-center">
        {/* Title and Subtitle */}
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg font-handwritten">
            Grandpa John's Stories
          </h1>
          <p className="text-sm md:text-lg text-white/90 drop-shadow-md font-georgia mt-1">
            Where every story feels like home
          </p>
        </div>

        {/* Dancing GIF with Speech Bubble and Icons OR Safe For Kids Shield */}
        <div className="mt-2">
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
                    <div className="w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 bg-green-300 animate-pulse rounded-full border-2 border-green-500" />
                  )}
                  {(sfkError || !safeForKidsIconUrl) && !sfkLoading ? (
                    <div className="w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 bg-green-200 flex items-center justify-center text-green-800 text-xs font-bold rounded-full border-2 border-green-500">
                      SAFE
                    </div>
                  ) : safeForKidsIconUrl && !sfkLoading && !sfkError ? (
                    <img 
                      src={safeForKidsIconUrl}
                      alt="Safe For Kids Shield"
                      className="w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 object-contain"
                    />
                  ) : null}
                </div>
                
                {/* ICO-HGJ Icon - Positioned between Safe for Kids and Menu button */}
                <div className="absolute -right-14 lg:-right-16 top-1/2 transform -translate-y-1/2">
                  {hgjLoading && (
                    <div className="w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 bg-gray-300 animate-pulse rounded-full border-2 border-gray-500" />
                  )}
                  {(hgjError || !hgjIconUrl) && !hgjLoading ? (
                    <div className="w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 bg-gray-200 flex items-center justify-center text-gray-800 text-xs font-bold rounded-full border-2 border-gray-500">
                      HGJ
                    </div>
                  ) : hgjIconUrl && !hgjLoading && !hgjError ? (
                    <img 
                      src={hgjIconUrl}
                      alt="HGJ Icon"
                      className="w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 object-contain"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-48 lg:w-64 h-32 lg:h-40 flex items-center justify-center">
              <div className="flex items-center justify-center">
                {sfkLoading && (
                  <div className="w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 bg-green-300 animate-pulse rounded-full border-2 border-green-500" />
                )}
                {(sfkError || !safeForKidsIconUrl) && !sfkLoading ? (
                  <div className="w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 bg-green-200 flex items-center justify-center text-green-800 text-sm font-bold rounded-full border-2 border-green-500">
                    SAFE
                  </div>
                ) : safeForKidsIconUrl && !sfkLoading && !sfkError ? (
                  <img 
                    src={safeForKidsIconUrl}
                    alt="Safe For Kids Shield"
                    className="w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 object-contain"
                  />
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Menu Button - Right Side */}
      {!isAdminPage && (
        <div className="relative flex items-center" ref={menuRef}>
          <button
            onClick={handleMenuClick}
            onMouseEnter={handleMenuMouseEnter}
            onMouseLeave={handleMenuMouseLeave}
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-7rem md:h-7rem bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 hover:from-amber-300 hover:via-yellow-400 hover:to-orange-400 rounded-xl border-4 border-amber-300 shadow-[0_8px_20px_rgba(0,0,0,0.3),inset_0_4px_8px_rgba(255,255,255,0.3)] hover:shadow-[0_12px_25px_rgba(0,0,0,0.4),inset_0_4px_12px_rgba(255,255,255,0.4)] transform hover:scale-105 transition-all duration-200 flex items-center justify-center group relative overflow-hidden"
            aria-label="Open main menu"
          >
            {/* 3D shine effect */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
            
            {/* Menu Icon */}
            <div className="w-full h-12 sm:h-16 md:h-24 flex items-center justify-center">
              {menuLoading && (
                <div className="w-8 h-8 md:w-12 md:h-12 bg-orange-300 animate-pulse rounded-full border-2 border-orange-500" />
              )}
              {(menuError || !menuIconUrl) && !menuLoading ? (
                <div className="w-8 h-8 md:w-12 md:h-12 bg-orange-200 flex items-center justify-center text-orange-800 text-xs font-bold rounded-full border-2 border-orange-500">
                  MENU
                </div>
              ) : menuIconUrl && !menuLoading && !menuError ? (
                <img 
                  src={menuIconUrl}
                  alt="Menu Button Icon"
                  className="w-full h-full object-contain"
                />
              ) : null}
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
  );
};

export default HeaderContent;