
import { Link, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useHelp } from "@/contexts/HelpContext";
import NavigationMenu from "./NavigationMenu";

interface HeaderContentProps {
  isHomePage: boolean;
}

const HeaderContent = ({ isHomePage }: HeaderContentProps) => {
  const location = useLocation();
  const { showHelp } = useHelp();

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
    <div className="flex items-center justify-between relative">
      {/* Buddy's Photo - Positioned above "Grandpa John's" text */}
      <div className="flex items-start gap-4">
        {/* Help Box with Buddy's Photo */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={handleHelpClick}
              onMouseDown={() => console.log('🐕 Buddy button mouse down!')}
              onMouseUp={() => console.log('🐕 Buddy button mouse up!')}
              className="relative z-10 bg-gradient-to-br from-green-600/80 to-green-700/60 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center text-center w-28 sm:w-32 h-40 sm:h-44 shadow-[0_8px_16px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] border-2 border-green-600 transform hover:scale-105 transition-transform duration-200 cursor-pointer active:scale-95"
            >
              <img 
                src="/lovable-uploads/949dcec1-2a5d-481c-9ce6-aa0da5edb3d0.png"
                alt="Buddy the Helper Dog"
                className="w-full h-16 md:h-18 sm:h-20 object-cover rounded-md mb-1"
              />
              <div className="text-yellow-200 text-[10px] md:text-[11px] sm:text-xs font-bold leading-tight">
                <div>Need Help?</div>
                <div>Click Here</div>
                <div>or Ctrl+H</div>
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent 
            side="right" 
            align="center" 
            sideOffset={-60}
            className="bg-red-600 border-red-700 text-[#FFFF00] font-bold shadow-lg"
          >
            <p>Click Here for Help!</p>
          </TooltipContent>
        </Tooltip>
        
        {/* Website Title and Subtitle */}
        <div className="text-left">
          <div className="text-lg sm:text-2xl font-bold font-handwritten">
            <div className="text-blue-900">Grandpa John's</div>
            <div className="text-left text-white text-xl sm:text-3xl">Stories for Kids</div>
          </div>
          <p className="text-amber-100 text-xs sm:text-sm font-medium">Where every story feels like a new adventure</p>
          
          {/* Navigation Menu - Show on home page, positioned below the text and left-aligned */}
          {isHomePage && (
            <div className="mt-4">
              <NavigationMenu />
            </div>
          )}
        </div>
      </div>
        
      {/* Dancing GIF with Speech Bubble - Only show on home page */}
      {isHomePage && (
        <div className="relative hidden md:block">
          <img 
            src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExczNveHBjNDkxcDNwMG5mcHh2dmxvYXlycm4zZjF5a3BxaWRxb3VoNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cMALqIjmb7ygw/giphy.gif"
            alt="Fun dancing GIF"
            className="w-72 h-48 rounded-full border-4 border-white shadow-[inset_0_12px_20px_rgba(0,0,0,0.5),inset_0_6px_12px_rgba(0,0,0,0.3),inset_0_2px_6px_rgba(0,0,0,0.2)] object-cover object-left"
          />
          {/* Speech Bubble Image */}
          <div className="absolute -left-24 top-2">
            <img 
              src="/lovable-uploads/85707d76-31c8-4dac-9fa7-c6752c4f8e74.png" 
              alt="Speech bubble saying HURRY UP!!! We want to read!!!"
              className="w-24 h-24 object-contain"
              onLoad={() => console.log('New speech bubble image loaded successfully')}
              onError={(e) => console.log('New speech bubble image failed to load:', e)}
            />
          </div>
          {/* Under Construction Image - Positioned at bottom of telescope */}
          <div className="absolute top-48 left-1/2 transform -translate-x-1/2">
            <Tooltip>
              <TooltipTrigger asChild>
                <img 
                  src="/lovable-uploads/3a1b5f78-6ca6-488d-90a3-369c6bc26b12.png"
                  alt="Under Construction"
                  className="w-36 h-36 object-contain cursor-pointer"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>UC</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      {/* Navigation Menu - Only show on non-home pages */}
      {!isHomePage && <NavigationMenu />}
    </div>
  );
};

export default HeaderContent;
