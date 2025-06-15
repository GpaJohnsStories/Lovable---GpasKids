
import { Link, useLocation } from "react-router-dom";

const WelcomeText = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  console.log('WelcomeText - Current pathname:', location.pathname);
  console.log('WelcomeText - Is home page:', isHomePage);

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
    <div className="w-full py-4 mt-0" style={{backgroundColor: '#ADD8E6'}}>
      <div className="rounded-3xl p-8 shadow-lg border-2 border-orange-200 font-fun container mx-auto">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="relative">
            <img 
              src="/lovable-uploads/7877f657-a542-4479-a79d-5c919482ed36.png" 
              alt="Grandpa John at his desk with Buddy on his lap"
              className="w-64 h-64 rounded-xl object-cover shadow-lg flex-shrink-0 mx-auto md:mx-0"
              onLoad={() => console.log('Image loaded successfully:', '/lovable-uploads/7877f657-a542-4479-a79d-5c919482ed36.png')}
              onError={(e) => console.log('Image failed to load:', e)}
            />
          </div>
          <div className="flex flex-col justify-center text-center md:text-left flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 leading-relaxed mb-6">
              Hello!
            </h1>
            <p className="text-2xl text-blue-900 font-semibold leading-relaxed max-w-3xl mx-auto md:mx-0 font-fun mb-8">
              You have found my fun place for kids.<br />
              I am Grandpa John with my friend Buddy.<br />
              Here you will find stories, jokes, games and more.<br />
              Enjoy your time here!
            </p>
            
            {/* Navigation Menu - Show on home page */}
            {isHomePage && (
              <div className="w-full">
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    
                    console.log('Rendering nav item:', item.name, 'isActive:', isActive, 'path:', item.path);
                    
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`
                          ${item.bgColor} ${item.hoverColor} ${item.shadowColor} ${item.hoverShadow}
                          ${isActive ? 'ring-4 ring-white ring-opacity-50 transform translate-y-1' : ''}
                          text-white px-6 py-3 rounded-lg font-semibold 
                          transition-all duration-200 
                          hover:transform hover:translate-y-1 active:translate-y-2 
                          flex items-center justify-center min-w-[120px]
                          font-fun border-t border-white border-opacity-30
                          text-base
                        `}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeText;
