
import { Book, MessageSquare, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const WelcomeHeader = () => {
  const location = useLocation();

  const navItems = [
    { 
      name: 'Home', 
      path: '/', 
      bgColor: 'bg-gradient-to-b from-[#C5E4F3] via-[#ADD8E6] to-[#8AC6D1]',
      hoverColor: 'hover:from-[#B8DCF0] hover:via-[#9BCFDF] hover:to-[#7AB8C4]',
      shadowColor: 'shadow-[0_6px_0_#7AB8C4,0_8px_15px_rgba(0,0,0,0.3)]',
      hoverShadow: 'hover:shadow-[0_4px_0_#7AB8C4,0_6px_12px_rgba(0,0,0,0.4)]'
    },
    { 
      name: 'Stories', 
      path: '/stories', 
      bgColor: 'bg-gradient-to-b from-[#C5E4F3] via-[#ADD8E6] to-[#8AC6D1]',
      hoverColor: 'hover:from-[#B8DCF0] hover:via-[#9BCFDF] hover:to-[#7AB8C4]',
      shadowColor: 'shadow-[0_6px_0_#7AB8C4,0_8px_15px_rgba(0,0,0,0.3)]',
      hoverShadow: 'hover:shadow-[0_4px_0_#7AB8C4,0_6px_12px_rgba(0,0,0,0.4)]'
    },
    { 
      name: 'Comments', 
      path: '/comments', 
      bgColor: 'bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500',
      hoverColor: 'hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-600',
      shadowColor: 'shadow-[0_6px_0_#ca8a04,0_8px_15px_rgba(0,0,0,0.3)]',
      hoverShadow: 'hover:shadow-[0_4px_0_#ca8a04,0_6px_12px_rgba(0,0,0,0.4)]'
    },
    { 
      name: 'About Us', 
      path: '/about', 
      bgColor: 'bg-gradient-to-b from-sky-300 via-sky-400 to-sky-500',
      hoverColor: 'hover:from-sky-400 hover:via-sky-500 hover:to-sky-600',
      shadowColor: 'shadow-[0_6px_0_#0369a1,0_8px_15px_rgba(0,0,0,0.3)]',
      hoverShadow: 'hover:shadow-[0_4px_0_#0369a1,0_6px_12px_rgba(0,0,0,0.4)]'
    }
  ];

  return (
    <TooltipProvider>
      <header className="bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg border-b-4 border-orange-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Personal Photo */}
              <Link to="/" className="bg-white rounded-full p-1 shadow-lg hover:shadow-xl transition-shadow">
                <img 
                  src="/lovable-uploads/d05b3b1c-686e-4f7b-9844-38a790c9b067.png" 
                  alt="Grandpa's beloved companion"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover object-top"
                />
              </Link>
              <div className="text-left">
                <div className="text-lg sm:text-2xl font-bold text-white font-handwritten">
                  <div>Grandpa John's</div>
                  <div className="text-left">Stories for Kids</div>
                </div>
                <p className="text-amber-100 text-xs sm:text-sm font-medium">Where every story feels like a new adventure</p>
              </div>
            </div>
            
            {/* Dancing GIF with Speech Bubble - Right Aligned */}
            <div className="relative hidden md:block">
              <Tooltip>
                <TooltipTrigger asChild>
                  <img 
                    src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExczNveHBjNDkxcDNwMG5mcHh2dmxvYXlycm4zZjF5a3BxaWRxb3VoNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cMALqIjmb7ygw/giphy.gif"
                    alt="Fun dancing GIF"
                    className="w-32 h-32 rounded-full border-4 border-white shadow-[inset_0_12px_20px_rgba(0,0,0,0.5),inset_0_6px_12px_rgba(0,0,0,0.3),inset_0_2px_6px_rgba(0,0,0,0.2)] object-cover object-left cursor-pointer"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Telescope</p>
                </TooltipContent>
              </Tooltip>
              {/* Speech Bubble Image */}
              <div className="absolute -left-24 top-2">
                <img 
                  src="/lovable-uploads/9c707001-90fd-4d75-97f7-a969bc295b8a.png" 
                  alt="Speech bubble saying HURRY UP!!! We want to read!!!"
                  className="w-24 h-24 object-contain"
                  onLoad={() => console.log('New speech bubble image loaded successfully')}
                  onError={(e) => console.log('New speech bubble image failed to load:', e)}
                />
              </div>
              {/* Under Construction Image - Positioned closer to Dancing GIF */}
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
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
          </div>
          
          {/* Navigation Menu Buttons - Moved up with reduced spacing */}
          <div className="flex flex-col sm:flex-row justify-start mt-3 gap-2 sm:gap-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    ${item.bgColor} ${item.hoverColor} ${item.shadowColor} ${item.hoverShadow}
                    ${isActive ? 'ring-4 ring-white ring-opacity-50 transform translate-y-1 shadow-[0_4px_0_#7AB8C4,0_6px_12px_rgba(0,0,0,0.4)]' : ''}
                    text-white px-3 sm:px-5 py-2 rounded-lg font-semibold 
                    transition-all duration-200 
                    hover:transform hover:translate-y-1 active:translate-y-2 active:shadow-[0_2px_0_#7AB8C4,0_4px_8px_rgba(0,0,0,0.3)]
                    flex items-center justify-center w-full sm:min-w-[100px] sm:w-auto
                    font-fun border-t border-white border-opacity-30
                    text-sm
                  `}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default WelcomeHeader;
