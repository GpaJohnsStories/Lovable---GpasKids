
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import NavigationMenu from "./NavigationMenu";

interface HeaderContentProps {
  isHomePage: boolean;
}

const HeaderContent = ({ isHomePage }: HeaderContentProps) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex items-start justify-between relative">
      {/* Buddy's Photo - Positioned above "Grandpa John's" text */}
      <div className="flex items-start gap-4">
        {/* Help Box with Buddy's Photo */}
        <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center text-center w-28 sm:w-32 h-32 sm:h-36 shadow-[0_8px_16px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] border border-white/20 transform hover:scale-105 transition-transform duration-200">
          <img 
            src="/lovable-uploads/58384b36-a605-4f51-b242-cb44bffc266a.png"
            alt="Help? Click Here or Ctrl-H"
            className="w-full h-full object-cover"
          />
        </div>
        
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
