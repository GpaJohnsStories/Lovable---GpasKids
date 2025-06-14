
import { Home, BookOpen, MessageCircle, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const WelcomeHeader = () => {
  const location = useLocation();

  const navItems = [
    { 
      name: 'Home', 
      path: '/', 
      icon: Home, 
      bgColor: 'bg-gradient-to-r from-amber-600 to-orange-600',
      hoverColor: 'hover:from-amber-700 hover:to-orange-700'
    },
    { 
      name: 'Stories', 
      path: '/stories', 
      icon: BookOpen, 
      bgColor: 'bg-gradient-to-r from-blue-400 to-blue-500',
      hoverColor: 'hover:from-blue-500 hover:to-blue-600'
    },
    { 
      name: 'Comments', 
      path: '/comments', 
      icon: MessageCircle, 
      bgColor: 'bg-gradient-to-r from-yellow-300 to-yellow-400',
      hoverColor: 'hover:from-yellow-400 hover:to-yellow-500'
    },
    { 
      name: 'About Me', 
      path: '/about', 
      icon: User, 
      bgColor: 'bg-gradient-to-r from-sky-300 to-sky-400',
      hoverColor: 'hover:from-sky-400 hover:to-sky-500'
    }
  ];

  return (
    <header className="bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg border-b-4 border-orange-300">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Personal Photo */}
            <Link to="/" className="bg-white rounded-full p-1 shadow-lg hover:shadow-xl transition-shadow">
              <img 
                src="/lovable-uploads/d05b3b1c-686e-4f7b-9844-38a790c9b067.png" 
                alt="Grandpa's beloved companion"
                className="w-16 h-16 rounded-full object-cover object-top"
              />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white font-handwritten">Grandpa John's Stories for Kids</h1>
              <p className="text-amber-100 text-sm font-medium">Where every story feels like a new adventure</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="/" className="text-white hover:text-amber-200 transition-colors font-medium flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Home
            </a>
            <a href="#" className="text-white hover:text-amber-200 transition-colors font-medium flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              My Stories
            </a>
            <a href="#" className="text-white hover:text-amber-200 transition-colors font-medium">
              About Me
            </a>
          </nav>
        </div>
        
        {/* Navigation Menu Buttons */}
        <div className="flex justify-center mt-6 gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  ${item.bgColor} ${item.hoverColor}
                  ${isActive ? 'ring-4 ring-white ring-opacity-50 scale-105' : ''}
                  text-white px-6 py-3 rounded-lg font-semibold shadow-lg 
                  hover:shadow-xl transition-all duration-300 hover:scale-105
                  flex items-center gap-2 min-w-[120px] justify-center
                  font-fun
                `}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default WelcomeHeader;
