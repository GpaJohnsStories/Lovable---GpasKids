import { Link, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useHelp } from "@/contexts/HelpContext";
import { useUserRole } from "@/hooks/useUserRole";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import NavigationButton from "./NavigationButton";
import NavigationDropdown from "./NavigationDropdown";
import { supabase } from "@/integrations/supabase/client";

interface HeaderContentProps {
  isHomePage: boolean;
}

const HeaderContent = ({ isHomePage }: HeaderContentProps) => {
  const location = useLocation();
  const { showHelp } = useHelp();
  const { userRole } = useUserRole();
  
  
  // Check if we're on an admin page
  const isAdminPage = location.pathname.startsWith('/buddys_admin');

  // Function to get icon URL from Supabase storage with fallback to ICO-N2K
  const getIconUrl = (filePath: string) => {
    return supabase.storage.from('icons').getPublicUrl(filePath).data.publicUrl;
  };

  // Safe icon URL with fallback
  const getSafeIconUrl = (filePath: string) => {
    try {
      return getIconUrl(filePath);
    } catch (error) {
      console.warn(`Failed to load icon ${filePath}, falling back to ICO-N2K.png`);
      return getIconUrl('ICO-N2K.png');
    }
  };

  const handleHelpClick = () => {
    console.log('🐕 Buddy clicked! Showing help for:', location.pathname);
    showHelp(location.pathname);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-[180px]">
      {/* Three-column grid layout */}
      <div className="grid grid-cols-3 gap-4 h-full items-start pt-2">
        
        {/* LEFT COLUMN: Buddy + Title */}
        <div className="flex items-start gap-4 justify-start">
          <button 
            onClick={handleHelpClick}
            onMouseDown={() => console.log('🐕 Buddy button mouse down!')}
            onMouseUp={() => console.log('🐕 Buddy button mouse up!')}
            className="group relative z-10 bg-gradient-to-br from-green-600/80 to-green-700/60 hover:from-red-600/80 hover:to-red-700/60 backdrop-blur-sm rounded-lg p-2 flex flex-col items-center text-center w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 min-w-20 sm:min-w-28 md:min-w-36 flex-shrink-0 shadow-[0_8px_16px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] border-2 border-green-600 hover:border-red-600 transform hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95"
          >
            <img 
              src="/lovable-uploads/949dcec1-2a5d-481c-9ce6-aa0da5edb3d0.png"
              alt="Buddy the Helper Dog"
              className="w-full h-12 sm:h-18 md:h-24 object-cover rounded-md mb-0.5"
            />
            <div className="text-yellow-200 group-hover:text-[#FFFF00] text-xs sm:text-sm md:text-base font-bold leading-tight transition-colors duration-200">
              <div className="group-hover:hidden">Need Help?</div>
              <div className="group-hover:hidden">Click Here</div>
              <div className="hidden group-hover:block">Click Here</div>
              <div className="hidden group-hover:block">for Help!</div>
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

        {/* CENTER COLUMN: Dancing GIF and decorative elements */}
        <div className="flex justify-center items-start">
          {isHomePage ? (
            <div className="relative hidden md:block">
              <img 
                src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExczNveHBjNDkxcDNwMG5mcHh2dmxvYXlycm4zZjF5a3BxaWRxb3VoNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cMALqIjmb7ygw/giphy.gif"
                alt="Fun dancing GIF"
                className="w-48 lg:w-64 h-32 lg:h-40 rounded-full border-4 border-white shadow-[inset_0_12px_20px_rgba(0,0,0,0.5),inset_0_6px_12px_rgba(0,0,0,0.3),inset_0_2px_6px_rgba(0,0,0,0.2)] object-cover object-left"
              />
              {/* Speech Bubble Image */}
              <div className="absolute -left-16 -top-2">
                <img 
                  src="/lovable-uploads/85707d76-31c8-4dac-9fa7-c6752c4f8e74.png" 
                  alt="Speech bubble"
                  className="w-16 lg:w-20 h-16 lg:h-20 object-contain"
                  onLoad={() => console.log('New speech bubble image loaded successfully')}
                  onError={(e) => console.log('New speech bubble image failed to load:', e)}
                />
              </div>
              {/* Under Construction Image - Positioned at bottom right */}
              <div className="absolute -bottom-8 -right-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <img 
                      src="/lovable-uploads/3a1b5f78-6ca6-488d-90a3-369c6bc26b12.png"
                      alt="Under Construction"
                      className="w-24 lg:w-32 h-24 lg:h-32 object-contain cursor-pointer"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>UC</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          ) : (
            /* Placeholder for balanced layout on non-home pages */
            <div className="w-48 lg:w-64 h-32 lg:h-40 flex items-center justify-center">
              <div className="text-white/40 text-center">
                <div className="text-lg font-bold">Welcome!</div>
                <div className="text-sm">Enjoy your visit</div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CSS-Only Dropdown Menu */}
        <div className="flex justify-end items-start">
          {isHomePage && (
            <div className="group relative">
              {/* Primary Menu Button */}
              <button 
                className="relative z-10 bg-gradient-to-br from-yellow-400/90 to-amber-500/80 hover:from-yellow-300/90 hover:to-yellow-400/80 backdrop-blur-sm rounded-lg p-2 flex flex-col items-center text-center w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 min-w-20 sm:min-w-28 md:min-w-36 flex-shrink-0 shadow-[0_8px_16px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] border-2 border-yellow-400 hover:border-yellow-300 transform hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95"
                aria-label="Main Navigation Menu"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img 
                  src={getSafeIconUrl('ICO-MU2.gif')}
                  alt="Primary Menu"
                  className="w-full h-12 sm:h-16 md:h-20 object-contain rounded-md mb-0.5"
                />
                <div className="text-orange-800 text-xs sm:text-sm md:text-base font-bold leading-tight">
                  <div>Menu</div>
                </div>
              </button>

              {/* CSS-Only Dropdown Menu */}
              <div className="absolute top-full right-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-300 ease-in-out z-50">
                <div 
                  className="rounded-lg shadow-lg border-2 border-orange-400 min-w-[120px]"
                  style={{ backgroundColor: '#FFD65C' }}
                >
                  <div className="flex flex-col p-2">
                    <Link
                      to="/"
                      className="flex items-center justify-center p-2 rounded-md hover:bg-orange-200 transition-colors duration-200 focus:bg-orange-200 focus:outline-none"
                      aria-label="Go to Home Page"
                    >
                      <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-orange-500 border-2 border-orange-600 shadow-md hover:scale-105 transition-transform duration-200">
                        <img 
                          src={getSafeIconUrl('ICO-HO2.png')}
                          alt="Home"
                          className="w-14 h-14 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src.includes('.png')) {
                              target.src = getSafeIconUrl('ICO-HO2.jpg');
                            } else if (target.src.includes('.jpg')) {
                              target.src = getSafeIconUrl('ICO-HO2.gif');
                            }
                          }}
                        />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default HeaderContent;