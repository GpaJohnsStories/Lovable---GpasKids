import { useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useHelp } from "@/contexts/HelpContext";

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

  return (
    <div className="min-h-[180px]">
      {/* Single compartment layout */}
      <div className="relative flex items-center h-full pt-2">
        
        {/* LEFT SECTION: Buddy + Title */}
        <div className="flex items-start gap-4 justify-start">
          <button 
            onClick={handleHelpClick}
            onMouseDown={() => console.log('🐕 Buddy button mouse down!')}
            onMouseUp={() => console.log('🐕 Buddy button mouse up!')}
            className="group relative z-10 bg-gradient-to-br from-green-600/80 to-green-700/60 hover:from-red-600/80 hover:to-red-700/60 backdrop-blur-sm rounded-lg p-2 flex flex-col items-center text-center w-16 h-16 sm:w-[5.5rem] sm:h-[5.5rem] md:w-[7rem] md:h-[7rem] min-w-16 sm:min-w-[5.5rem] md:min-w-[7rem] flex-shrink-0 shadow-[0_8px_16px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] border-2 border-green-600 hover:border-red-600 transform hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95"
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

        {/* CENTER SECTION: Dancing GIF - Absolutely centered */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
      </div>
    </div>
  );
};

export default HeaderContent;