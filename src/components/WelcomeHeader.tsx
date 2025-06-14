
import { BookOpen, MessageCircle, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const WelcomeHeader = () => {
  const location = useLocation();

  const navItems = [
    { 
      name: 'Home', 
      path: '/', 
      icon: 'house', 
      bgColor: 'bg-gradient-to-b from-[#C5E4F3] via-[#ADD8E6] to-[#8AC6D1]',
      hoverColor: 'hover:from-[#B8DCF0] hover:via-[#9BCFDF] hover:to-[#7AB8C4]',
      shadowColor: 'shadow-[0_6px_0_#7AB8C4,0_8px_15px_rgba(0,0,0,0.3)]',
      hoverShadow: 'hover:shadow-[0_4px_0_#7AB8C4,0_6px_12px_rgba(0,0,0,0.4)]'
    },
    { 
      name: 'Stories', 
      path: '/stories', 
      icon: BookOpen, 
      bgColor: 'bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-500 hover:via-blue-600 hover:to-blue-700',
      shadowColor: 'shadow-[0_6px_0_#1e40af,0_8px_15px_rgba(0,0,0,0.3)]',
      hoverShadow: 'hover:shadow-[0_4px_0_#1e40af,0_6px_12px_rgba(0,0,0,0.4)]'
    },
    { 
      name: 'Comments', 
      path: '/comments', 
      icon: MessageCircle, 
      bgColor: 'bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500',
      hoverColor: 'hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-600',
      shadowColor: 'shadow-[0_6px_0_#ca8a04,0_8px_15px_rgba(0,0,0,0.3)]',
      hoverShadow: 'hover:shadow-[0_4px_0_#ca8a04,0_6px_12px_rgba(0,0,0,0.4)]'
    },
    { 
      name: 'About Us', 
      path: '/about', 
      icon: 'buddy', 
      bgColor: 'bg-gradient-to-b from-sky-300 via-sky-400 to-sky-500',
      hoverColor: 'hover:from-sky-400 hover:via-sky-500 hover:to-sky-600',
      shadowColor: 'shadow-[0_6px_0_#0369a1,0_8px_15px_rgba(0,0,0,0.3)]',
      hoverShadow: 'hover:shadow-[0_4px_0_#0369a1,0_6px_12px_rgba(0,0,0,0.4)]'
    }
  ];

  const renderIcon = (item: any) => {
    if (item.icon === 'buddy') {
      return (
        <img 
          src="/lovable-uploads/d857e4e2-2000-4e48-a99c-548e56c35e39.png" 
          alt="Buddy"
          className="w-5 h-5 rounded-full object-cover"
        />
      );
    } else if (item.icon === 'house') {
      return (
        <img 
          src="/lovable-uploads/6b23362c-187e-44ee-b422-7de152d617c0.png" 
          alt="House"
          className="w-5 h-5 object-cover"
        />
      );
    } else {
      const Icon = item.icon;
      return <Icon className="h-5 w-5 text-white" fill="currentColor" />;
    }
  };

  return (
    <header className="bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg border-b-4 border-orange-300">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center">
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
        </div>
        
        {/* Navigation Menu Buttons */}
        <div className="flex justify-center mt-6 gap-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  ${item.bgColor} ${item.hoverColor} ${item.shadowColor} ${item.hoverShadow}
                  ${isActive ? 'ring-4 ring-white ring-opacity-50 transform translate-y-1 shadow-[0_4px_0_#7AB8C4,0_6px_12px_rgba(0,0,0,0.4)]' : ''}
                  text-white px-6 py-3 rounded-lg font-semibold 
                  transition-all duration-200 
                  hover:transform hover:translate-y-1 active:translate-y-2 active:shadow-[0_2px_0_#7AB8C4,0_4px_8px_rgba(0,0,0,0.3)]
                  flex items-center gap-2 min-w-[120px] justify-center
                  font-fun border-t border-white border-opacity-30
                `}
              >
                {renderIcon(item)}
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
