import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useHelp } from "@/contexts/HelpContext";
import { supabase } from "@/integrations/supabase/client";
import VerticalMenu from "./VerticalMenu";

interface HeaderContentProps {
  isHomePage: boolean;
}

const HeaderContent = ({ isHomePage }: HeaderContentProps) => {
  const location = useLocation();
  const { showHelp } = useHelp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper function to get icon URL from Supabase storage
  const getIconUrl = (iconName: string) => {
    return supabase.storage.from('icons').getPublicUrl(iconName).data.publicUrl;
  };

  // Safe icon URL getter with fallback
  const getSafeIconUrl = (iconCode: string) => {
    return getIconUrl(`${iconCode}.gif`); // Start with GIF since we know ICO-HL2 is a GIF
  };

  const handleHelpClick = () => {
    console.log('🐕 Buddy clicked! Showing help for:', location.pathname);
    showHelp(location.pathname);
  };

  const handleMenuClick = () => {
    console.log('🎯 Menu button clicked, current state:', isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-[180px]">
      {/* Single compartment layout */}
      <div className="relative flex items-center justify-between h-full pt-2">
        
        {/* LEFT SECTION: Buddy + Title */}
        <div className="flex items-start gap-4 justify-start">
          <button 
            onClick={handleHelpClick}
            onMouseDown={() => console.log('🐕 Buddy button mouse down!')}
            onMouseUp={() => console.log('🐕 Buddy button mouse up!')}
            className="group relative z-10 bg-gradient-to-br from-green-600/80 to-green-700/60 hover:from-red-600/80 hover:to-red-700/60 backdrop-blur-sm rounded-lg p-2 flex flex-col items-center text-center w-16 h-16 sm:w-[5.5rem] sm:h-[5.5rem] md:w-[7rem] md:h-[7rem] min-w-16 sm:min-w-[5.5rem] md:min-w-[7rem] flex-shrink-0 shadow-[0_8px_16px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] border-2 border-green-600 hover:border-red-600 transform hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95"
          >
            {/* Buddy image - hidden on hover */}
            <img 
              src={getSafeIconUrl("ICO-HL2")}
              alt="Buddy the Helper Dog"
              className="w-full h-12 sm:h-18 md:h-24 object-cover rounded-md group-hover:hidden"
              onError={(e) => {
                const img = e.currentTarget;
                if (img.src.endsWith('.gif')) {
                  img.src = getIconUrl('ICO-HL2.png');
                } else if (img.src.endsWith('.png')) {
                  img.src = getIconUrl('ICO-HL2.jpg');
                } else {
                  console.log('All fallback formats failed for ICO-HL2');
                }
              }}
            />
            
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

        {/* CENTER SECTION: Dancing GIF - Horizontally centered, top aligned */}
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

        {/* RIGHT SECTION: Gold Menu Button */}
        <div className="flex justify-end relative">
          <button 
            onClick={handleMenuClick}
            className="group relative z-10 bg-gradient-to-br from-yellow-500/80 to-yellow-600/60 hover:from-yellow-400/80 hover:to-yellow-500/60 backdrop-blur-sm rounded-lg p-2 flex flex-col items-center text-center w-16 h-16 sm:w-[5.5rem] sm:h-[5.5rem] md:w-[7rem] md:h-[7rem] min-w-16 sm:min-w-[5.5rem] md:min-w-[7rem] flex-shrink-0 shadow-[0_8px_16px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] border-2 border-yellow-500 hover:border-yellow-400 transform hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95"
          >
            <img 
              src={getSafeIconUrl("ICO-MU2")}
              alt="Main Menu"
              className="w-full h-12 sm:h-18 md:h-24 object-cover rounded-md"
              onError={(e) => {
                const img = e.currentTarget;
                if (img.src.endsWith('.gif')) {
                  img.src = getIconUrl('ICO-MU2.png');
                } else if (img.src.endsWith('.png')) {
                  img.src = getIconUrl('ICO-MU2.jpg');
                } else {
                  console.log('All fallback formats failed for ICO-MU2');
                }
              }}
            />
          </button>
          
          {/* Vertical Menu */}
          <VerticalMenu 
            isVisible={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)} 
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderContent;