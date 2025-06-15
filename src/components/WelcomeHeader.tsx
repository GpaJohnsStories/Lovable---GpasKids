
import { Book, MessageSquare, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const WelcomeHeader = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

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

  const NavigationMenu = () => (
    <div className="flex flex-row gap-3">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.name}
            to={item.path}
            className={`
              ${item.bgColor} ${item.hoverColor} ${item.shadowColor} ${item.hoverShadow}
              ${isActive ? 'ring-4 ring-white ring-opacity-50 transform translate-y-1 shadow-[0_4px_0_#7AB8C4,0_6px_12px_rgba(0,0,0,0.4)]' : ''}
              text-white px-5 py-2 rounded-lg font-semibold 
              transition-all duration-200 
              hover:transform hover:translate-y-1 active:translate-y-2 active:shadow-[0_2px_0_#7AB8C4,0_4px_8px_rgba(0,0,0,0.3)]
              flex items-center justify-center min-w-[100px]
              font-fun border-t border-white border-opacity-30
              text-sm
            `}
          >
            {item.name}
          </Link>
        );
      })}
    </div>
  );

  return (
    <TooltipProvider>
      {/* Main Header Banner with 3D Effects */}
      <header className="bg-gradient-to-r from-amber-600 to-orange-600 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] border-b-4 border-orange-300 relative">
        {/* 3D perspective container */}
        <div 
          className="transform-gpu perspective-1000"
          style={{
            transform: 'rotateX(2deg)',
            transformOrigin: 'center bottom',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="container mx-auto px-4 py-4 relative">
            {/* Background 3D layer */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-amber-700 to-orange-700 rounded-lg"
              style={{
                transform: 'translateZ(-20px) rotateX(-2deg)',
                opacity: '0.6'
              }}
            ></div>
            
            {/* Main content layer */}
            <div 
              className="relative z-10"
              style={{
                transform: 'translateZ(10px)',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Personal Photo with 3D effect */}
                  <Link 
                    to="/" 
                    className="bg-white rounded-full p-1 shadow-[0_8px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.4)] transition-all duration-300 transform hover:scale-110 hover:rotate-3"
                    style={{
                      transform: 'translateZ(15px) rotateY(-5deg)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <img 
                      src="/lovable-uploads/d05b3b1c-686e-4f7b-9844-38a790c9b067.png" 
                      alt="Grandpa's beloved companion"
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover object-top"
                    />
                  </Link>
                  
                  <div 
                    className="text-left"
                    style={{
                      transform: 'translateZ(8px)',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }}
                  >
                    <div className="text-lg sm:text-2xl font-bold font-handwritten">
                      <div className="text-blue-900">Grandpa John's</div>
                      <div className="text-left text-white text-xl sm:text-3xl">Stories for Kids</div>
                    </div>
                    <p className="text-amber-100 text-xs sm:text-sm font-medium">Where every story feels like a new adventure</p>
                    
                    {/* Navigation Menu - Show on home page, positioned below the text and left-aligned */}
                    {isHomePage && (
                      <div 
                        className="mt-4"
                        style={{
                          transform: 'translateZ(5px)',
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                        }}
                      >
                        <NavigationMenu />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Dancing GIF with Speech Bubble - Only show on home page with enhanced 3D */}
                {isHomePage && (
                  <div 
                    className="relative hidden md:block"
                    style={{
                      transform: 'translateZ(12px) rotateY(5deg)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <img 
                          src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExczNveHBjNDkxcDNwMG5mcHh2dmxvYXlycm4zZjF5a3BxaWRxb3VoNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cMALqIjmb7ygw/giphy.gif"
                          alt="Fun dancing GIF"
                          className="w-72 h-48 rounded-full border-4 border-white shadow-[0_16px_32px_rgba(0,0,0,0.4),inset_0_8px_16px_rgba(0,0,0,0.3)] object-cover object-left cursor-pointer transition-transform duration-300 hover:scale-105"
                          style={{
                            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))'
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Telescope</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    {/* Speech Bubble Image with 3D positioning */}
                    <div 
                      className="absolute -left-24 top-2"
                      style={{
                        transform: 'translateZ(20px) rotateY(-10deg)',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                      }}
                    >
                      <img 
                        src="/lovable-uploads/85707d76-31c8-4dac-9fa7-c6752c4f8e74.png" 
                        alt="Speech bubble saying HURRY UP!!! We want to read!!!"
                        className="w-24 h-24 object-contain"
                        onLoad={() => console.log('New speech bubble image loaded successfully')}
                        onError={(e) => console.log('New speech bubble image failed to load:', e)}
                      />
                    </div>
                    
                    {/* Under Construction Image - Positioned at bottom of telescope with 3D depth */}
                    <div 
                      className="absolute top-48 left-1/2 transform -translate-x-1/2"
                      style={{
                        transform: 'translateX(-50%) translateZ(8px) rotateX(5deg)',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                      }}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <img 
                            src="/lovable-uploads/3a1b5f78-6ca6-488d-90a3-369c6bc26b12.png"
                            alt="Under Construction"
                            className="w-36 h-36 object-contain cursor-pointer transition-transform duration-300 hover:scale-110"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>UC</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                )}

                {/* Navigation Menu - Only show on non-home pages with 3D effect */}
                {!isHomePage && (
                  <div 
                    style={{
                      transform: 'translateZ(5px)',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}
                  >
                    <NavigationMenu />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional 3D shadow layer */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-amber-800 to-orange-800 rounded-b-lg"
          style={{
            transform: 'translateY(4px) translateZ(-30px)',
            opacity: '0.3',
            filter: 'blur(2px)'
          }}
        ></div>
      </header>
    </TooltipProvider>
  );
};

export default WelcomeHeader;
