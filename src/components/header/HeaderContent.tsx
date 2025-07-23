import { Link, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useHelp } from "@/contexts/HelpContext";
import { useUserRole } from "@/hooks/useUserRole";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import NavigationButton from "./NavigationButton";
import NavigationDropdown from "./NavigationDropdown";
import { supabase } from "@/integrations/supabase/client";

interface HeaderContentProps {
  isHomePage: boolean;
}

const HeaderContent = ({ isHomePage }: HeaderContentProps) => {
  const location = useLocation();
  const { showHelp } = useHelp();
  const { userRole } = useUserRole();
  
  // Check if we're on an admin page
  const isAdminPage = location.pathname.startsWith('/buddys_admin');

  // Function to get icon URL from Supabase storage
  const getIconUrl = (filePath: string) => {
    return supabase.storage.from('icons').getPublicUrl(filePath).data.publicUrl;
  };

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
        <button 
          onClick={handleHelpClick}
          onMouseDown={() => console.log('🐕 Buddy button mouse down!')}
          onMouseUp={() => console.log('🐕 Buddy button mouse up!')}
          className="group relative z-10 bg-gradient-to-br from-green-600/80 to-green-700/60 hover:from-red-600/80 hover:to-red-700/60 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center text-center w-28 sm:w-32 h-40 sm:h-44 shadow-[0_8px_16px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] border-2 border-green-600 hover:border-red-600 transform hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95"
        >
          <img 
            src="/lovable-uploads/949dcec1-2a5d-481c-9ce6-aa0da5edb3d0.png"
            alt="Buddy the Helper Dog"
            className="w-full h-16 md:h-18 sm:h-20 object-cover rounded-md mb-1"
          />
          <div className="text-yellow-200 group-hover:text-[#FFFF00] text-xs md:text-sm sm:text-base font-bold leading-tight transition-colors duration-200">
            <div className="group-hover:hidden">Need Help?</div>
            <div className="group-hover:hidden">Click Here</div>
            <div className="group-hover:hidden">or Ctrl+H</div>
            <div className="hidden group-hover:block">Click Here</div>
            <div className="hidden group-hover:block">for Help!</div>
          </div>
        </button>
        
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
              <NavigationMenu>
                 <NavigationMenuList className="space-x-2">
                   <NavigationMenuItem>
                     <NavigationButton 
                       item={{
                         name: "Home",
                         path: "/",
                         bgColor: "bg-indigo-500",
                         hoverColor: "hover:bg-indigo-600",
                         shadowColor: "shadow-lg",
                         hoverShadow: "hover:shadow-xl",
                         textColor: "text-white",
                         customIcon: getIconUrl('ICO-HOM.png')
                       }}
                       isActive={false}
                     />
                   </NavigationMenuItem>
                   <NavigationMenuItem>
                      <NavigationButton 
                        item={{
                          name: "Stories",
                         path: "/library",
                         bgColor: "bg-blue-500",
                         hoverColor: "hover:bg-blue-600",
                         shadowColor: "shadow-lg",
                         hoverShadow: "hover:shadow-xl",
                         textColor: "text-white",
                         customIcon: getIconUrl('ICO_BK1.png')
                       }}
                      isActive={false}
                    />
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationDropdown 
                      item={{
                        name: "About",
                        bgColor: "bg-green-500",
                        hoverColor: "hover:bg-green-600",
                        shadowColor: "shadow-lg",
                        hoverShadow: "hover:shadow-xl",
                        textColor: "text-white",
                        customIcon: getIconUrl('ICO-INF.png'),
                        subItems: [
                          { name: "About Grandpa John", path: "/about" },
                          { name: "About Buddy", path: "/about#about-buddy" },
                          { name: "About Authors", path: "/public-author-bios" },
                          { name: "A Special Thank You", path: "/about#special-thank-you" }
                        ]
                      }}
                    />
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationButton 
                      item={{
                        name: "Writing",
                        path: "/writing",
                        bgColor: "bg-purple-500",
                        hoverColor: "hover:bg-purple-600",
                        shadowColor: "shadow-lg",
                        hoverShadow: "hover:shadow-xl",
                        textColor: "text-white",
                        customIcon: getIconUrl('ICO-STY.png')
                      }}
                      isActive={false}
                    />
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationDropdown 
                      item={{
                        name: "Comments",
                        bgColor: "bg-orange-500",
                        hoverColor: "hover:bg-orange-600",
                        shadowColor: "shadow-lg",
                        hoverShadow: "hover:shadow-xl",
                        textColor: "text-white",
                        customIcon: getIconUrl('ICO-HIC.png'),
                        subItems: [
                          { name: "Make Comment", path: "/make-comment" },
                          { name: "View Comments", path: "/view-comments" }
                        ]
                      }}
                    />
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationButton 
                      item={{
                        name: "Help",
                        path: "/help-gpa",
                        bgColor: "bg-red-500",
                        hoverColor: "hover:bg-red-600",
                        shadowColor: "shadow-lg",
                        hoverShadow: "hover:shadow-xl",
                        textColor: "text-white"
                      }}
                      isActive={false}
                    />
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              {userRole && (userRole === 'admin' || userRole === 'viewer') && !isAdminPage && (
                <div className="mt-2">
                  <NavigationMenu>
                    <NavigationMenuList className="space-x-2">
                      <NavigationMenuItem>
                         <NavigationButton 
                           item={{
                             name: "Privacy",
                             path: "/privacy",
                             bgColor: "bg-gray-600",
                             hoverColor: "hover:bg-gray-700",
                             shadowColor: "shadow-lg",
                             hoverShadow: "hover:shadow-xl",
                             textColor: "text-white",
                             customIcon: getIconUrl('ICO-LKD.png')
                           }}
                          isActive={false}
                        />
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
              )}
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
            {/* Bottom layer - Speech bubble image */}
            <img 
              src="/lovable-uploads/85707d76-31c8-4dac-9fa7-c6752c4f8e74.png" 
              alt="Speech bubble"
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
      {!isHomePage && !isAdminPage && (
        <div className="flex items-center gap-4">
          <NavigationMenu>
             <NavigationMenuList className="space-x-2">
               <NavigationMenuItem>
                 <NavigationButton 
                   item={{
                     name: "Home",
                     path: "/",
                     bgColor: "bg-indigo-500",
                     hoverColor: "hover:bg-indigo-600",
                     shadowColor: "shadow-lg",
                     hoverShadow: "hover:shadow-xl",
                     textColor: "text-white",
                     customIcon: getIconUrl('ICO-HOM.png')
                   }}
                   isActive={false}
                 />
               </NavigationMenuItem>
               <NavigationMenuItem>
                  <NavigationButton 
                    item={{
                      name: "Stories",
                     path: "/library",
                     bgColor: "bg-blue-500",
                     hoverColor: "hover:bg-blue-600",
                     shadowColor: "shadow-lg",
                     hoverShadow: "hover:shadow-xl",
                     textColor: "text-white",
                     customIcon: getIconUrl('ICO_BK1.png')
                   }}
                  isActive={false}
                />
              </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationDropdown 
                    item={{
                      name: "About",
                      bgColor: "bg-green-500",
                      hoverColor: "hover:bg-green-600",
                      shadowColor: "shadow-lg",
                      hoverShadow: "hover:shadow-xl",
                      textColor: "text-white",
                      customIcon: getIconUrl('ICO-INF.png'),
                      subItems: [
                        { name: "About Grandpa John", path: "/about" },
                        { name: "About Buddy", path: "/about#about-buddy" },
                        { name: "About Authors", path: "/public-author-bios" },
                        { name: "A Special Thank You", path: "/about#special-thank-you" }
                      ]
                    }}
                  />
                </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationButton 
                  item={{
                    name: "Writing",
                    path: "/writing",
                    bgColor: "bg-purple-500",
                    hoverColor: "hover:bg-purple-600",
                    shadowColor: "shadow-lg",
                    hoverShadow: "hover:shadow-xl",
                    textColor: "text-white",
                    customIcon: getIconUrl('ICO-STY.png')
                  }}
                  isActive={false}
                />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationDropdown 
                  item={{
                    name: "Comments",
                    bgColor: "bg-orange-500",
                    hoverColor: "hover:bg-orange-600",
                    shadowColor: "shadow-lg",
                    hoverShadow: "hover:shadow-xl",
                    textColor: "text-white",
                    customIcon: getIconUrl('ICO-HIC.png'),
                    subItems: [
                      { name: "Make Comment", path: "/make-comment" },
                      { name: "View Comments", path: "/view-comments" }
                    ]
                  }}
                />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationButton 
                  item={{
                    name: "Help",
                    path: "/help-gpa",
                    bgColor: "bg-red-500",
                    hoverColor: "hover:bg-red-600",
                    shadowColor: "shadow-lg",
                    hoverShadow: "hover:shadow-xl",
                    textColor: "text-white"
                  }}
                  isActive={false}
                />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          {userRole && (userRole === 'admin' || userRole === 'viewer') && (
            <NavigationMenu>
              <NavigationMenuList className="space-x-2">
                <NavigationMenuItem>
                   <NavigationButton 
                     item={{
                       name: "Privacy",
                       path: "/privacy",
                       bgColor: "bg-gray-600",
                       hoverColor: "hover:bg-gray-700",
                       shadowColor: "shadow-lg",
                       hoverShadow: "hover:shadow-xl",
                       textColor: "text-white",
                       customIcon: getIconUrl('ICO-LKD.png')
                     }}
                    isActive={false}
                  />
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderContent;
