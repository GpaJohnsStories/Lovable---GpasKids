
import { useLocation } from "react-router-dom";
import { Lock } from "lucide-react";
import {
  NavigationMenu as ShadcnNavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import NavigationButton from "./NavigationButton";
import NavigationDropdown from "./NavigationDropdown";
import { useState, useEffect } from "react";

const NavigationMenu = () => {
  const location = useLocation();
  const [currentStoryPath, setCurrentStoryPath] = useState<string | null>(null);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  useEffect(() => {
    const storedPath = sessionStorage.getItem('currentStoryPath');
    if (storedPath) {
      setCurrentStoryPath(storedPath);
    }
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/story/')) {
      sessionStorage.setItem('currentStoryPath', location.pathname);
      setCurrentStoryPath(location.pathname);
    }
  }, [location.pathname]);

  const navItems = [
    { 
      name: 'Home', 
      path: '/', 
      bgColor: 'bg-gradient-to-b from-[#C5E4F3] via-[#ADD8E6] to-[#8AC6D1]',
      hoverColor: 'hover:from-[#B8DCF0] hover:via-[#9BCFDF] hover:to-[#7AB8C4]',
      shadowColor: 'shadow-[0_6px_0_#7AB8C4,0_8px_15px_rgba(0,0,0,0.3)]',
      hoverShadow: 'hover:shadow-[0_4px_0_#7AB8C4,0_6px_12px_rgba(0,0,0,0.4)]',
      textColor: 'text-blue-900',
      description: 'Return to Home Screen'
    },
    { 
      name: 'Library', 
      path: '/library', 
      bgColor: 'bg-gradient-to-b from-orange-500 via-orange-600 to-orange-700',
      hoverColor: 'hover:from-orange-600 hover:via-orange-700 hover:to-orange-800',
      shadowColor: 'shadow-[0_6px_0_#c2410c,0_8px_15px_rgba(0,0,0,0.3)]',
      hoverShadow: 'hover:shadow-[0_4px_0_#c2410c,0_6px_12px_rgba(0,0,0,0.4)]',
      textColor: 'text-white',
      description: 'Visit List of Stories or View a Story',
      subItems: [
        { name: 'Story List', path: '/library' },
        { name: 'Current Story', path: currentStoryPath || '#', disabled: !currentStoryPath },
      ]
    },
    { 
      name: 'Comments', 
      bgColor: 'bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500',
      hoverColor: 'hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-600',
      shadowColor: 'shadow-[0_6px_0_#ca8a04,0_8px_15px_rgba(0,0,0,0.3)]',
      hoverShadow: 'hover:shadow-[0_4px_0_#ca8a04,0_6px_12px_rgba(0,0,0,0.4)]',
      textColor: 'text-green-800',
      description: 'Make a Comment or View All Comments',
      subItems: [
        { name: 'Make Comment', path: '/make-comment' },
        { name: 'View Comments', path: '/view-comments' },
      ],
    },
    { 
      name: 'About', 
      bgColor: 'bg-gradient-to-b from-sky-300 via-sky-400 to-sky-500',
      hoverColor: 'hover:from-sky-400 hover:via-sky-500 hover:to-sky-600',
      shadowColor: 'shadow-[0_6px_0_#0369a1,0_8px_15px_rgba(0,0,0,0.3)]',
      hoverShadow: 'hover:shadow-[0_4px_0_#0369a1,0_6px_12px_rgba(0,0,0,0.4)]',
      textColor: 'text-blue-950',
      description: 'More about Grandpa John, Buddy, and Copyright',
      subItems: [
        { name: 'About Grandpa John', path: '/about' },
        { name: 'About Buddy', path: '/about#buddy' },
      ]
    },
    { 
      name: 'Writing', 
      bgColor: 'bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-500 hover:via-purple-600 hover:to-purple-700',
      shadowColor: 'shadow-[0_6px_0_#7c3aed,0_8px_15px_rgba(0,0,0,0.3)]',
      hoverShadow: 'hover:shadow-[0_4px_0_#7c3aed,0_6px_12px_rgba(0,0,0,0.4)]',
      textColor: 'text-white',
      description: 'Learn about copyright and writing your own stories',
      subItems: [
        { name: 'What Copyright Means to You', path: '/writing#copyright' },
        { name: 'Write a Story for Gpa\'s Kids', path: '/writing#write-story' },
      ]
    },
    { 
      name: 'Privacy', 
      path: '/privacy', 
      bgColor: 'bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-600',
      hoverColor: 'hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700',
      shadowColor: 'shadow-[0_6px_0_#ca8a04,0_8px_15px_rgba(0,0,0,0.3)]',
      hoverShadow: 'hover:shadow-[0_4px_0_#ca8a04,0_6px_12px_rgba(0,0,0,0.4)]',
      textColor: 'text-black',
      icon: Lock,
      description: 'Details of our privacy and security and how we\'ve implemented it'
    }
  ];

  return (
    <ShadcnNavigationMenu>
      <NavigationMenuList className="flex flex-row flex-wrap gap-3">
        {navItems.map((item) => (
          <NavigationMenuItem key={item.name}>
            {item.subItems ? (
              <NavigationDropdown 
                item={item} 
                onHover={setHoveredButton} 
                isHovered={hoveredButton === item.name}
              />
            ) : (
              <NavigationButton
                item={item}
                isActive={location.pathname === item.path}
                onHover={setHoveredButton}
                isHovered={hoveredButton === item.name}
              />
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </ShadcnNavigationMenu>
  );
};

export default NavigationMenu;
