import { Book, MessageSquare, Home, Lock } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const WelcomeHeader = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
      name: 'Library', 
      path: '/library', 
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
    },
    { 
      name: 'Privacy', 
      path: '/privacy', 
      bgColor: 'bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-600',
      hoverColor: 'hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700',
      shadowColor: 'shadow-[0_6px_0_#ca8a04,0_8px_15px_rgba(0,0,0,0.3)]',
      hoverShadow: 'hover:shadow-[0_4px_0_#ca8a04,0_6px_12px_rgba(0,0,0,0.4)]',
      icon: Lock
    }
  ];

  const NavigationMenu = () => (
    <div className="flex flex-row gap-3">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.name}
            to={item.path}
            onClick={scrollToTop}
            className={`
              ${item.bgColor} ${item.hoverColor} ${item.shadowColor} ${item.hoverShadow}
              ${isActive ? 'ring-4 ring-white ring-opacity-50 transform translate-y-1 shadow-[0_4px_0_#7AB8C4,0_6px_12px_rgba(0,0,0,0.4)]' : ''}
              text-white px-5 py-2 rounded-lg font-semibold 
              transition-all duration-200 
              hover:transform hover:translate-y-1 active:translate-y-2 active:shadow-[0_2px_0_#7AB8C4,0_4px_8px_rgba(0,0,0,0.3)]
              flex items-center justify-center min-w-[100px]
              font-fun border-t border-white border-opacity-30
              text-sm ${item.icon ? 'gap-1' : ''}
            `}
          >
            {item.icon && <item.icon size={16} />}
            <span className={item.icon ? '' : 'text-center w-full'}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <TooltipProvider>
      {/* Main Header Banner */}
      <header className="bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg border-b-4 border-orange-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Personal Photo */}
              <Link to="/" onClick={scrollToTop} className="bg-white rounded-full p-1 shadow-lg hover:shadow-xl transition-shadow">
                <img 
                  src="/lovable-uploads/d05b3b1c-686e-4f7b-9844-38a790c9b067.png" 
                  alt="Grandpa's beloved companion"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover object-top"
                />
              </Link>
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <img 
                      src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExczNveHBjNDkxcDNwMG5mcHh2dmxvYXlycm4zZjF5a3BxaWRxb3VoNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cMALqIjmb7ygw/giphy.gif"
                      alt="Fun dancing GIF"
                      className="w-72 h-48 rounded-full border-4 border-white shadow-[inset_0_12px_20px_rgba(0,0,0,0.5),inset_0_6px_12px_rgba(0,0,0,0.3),inset_0_2px_6px_rgba(0,0,0,0.2)] object-cover object-left cursor-pointer"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Telescope</p>
                  </TooltipContent>
                </Tooltip>
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
        </div>
      </header>
    </TooltipProvider>
  );
};

export default WelcomeHeader;
