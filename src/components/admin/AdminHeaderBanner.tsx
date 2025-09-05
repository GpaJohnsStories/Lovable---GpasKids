
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, FileText, MessageSquare, LayoutDashboard, Volume2, Globe, ChevronDown, Users, Plus, BookOpen, Unlock, Home } from "lucide-react";
import { toast } from "sonner";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { useCachedIcon } from "@/hooks/useCachedIcon";

interface AdminNavButton {
  name: string;
  path: string;
  icon: any;
  bgColor: string;
  hoverColor: string;
  shadowColor: string;
  hoverShadow: string;
  textColor: string;
  description: string;
  openInNewTab?: boolean;
}

const AdminHeaderBanner = () => {
  const { isViewer } = useUserRole();
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  
  // Determine if the system is secure (placeholder logic - adjust as needed)
  const isSecure = window.location.protocol === 'https:';
  
  // Load the secure icon, logout icon, dashboard icon, libraries icon, comments icon, and story creation icon
  const { iconUrl: secureIconUrl } = useCachedIcon(isSecure ? 'ICO-ADS.jpg' : null);
  const { iconUrl: logoutIconUrl } = useCachedIcon('ICO-ADX.png');
  const { iconUrl: dashboardIconUrl } = useCachedIcon('ICO-AD1.gif');
  const { iconUrl: librariesIconUrl } = useCachedIcon('!CO-MM3.gif');
  const { iconUrl: commentsIconUrl } = useCachedIcon('!CO-MM5.gif');
  const { iconUrl: storyCreateIconUrl } = useCachedIcon('!CO-MM6.gif');
  const { iconUrl: biosIconUrl } = useCachedIcon('!CO-MM7.jpg');


  const handleLogout = async () => {
    try {
      console.log('🔓 AdminHeaderBanner: Starting logout process...');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('🔓 AdminHeaderBanner: Logout error:', error);
        toast.error('Logout failed');
        return;
      }
      
      console.log('🔓 AdminHeaderBanner: Successfully signed out from Supabase');
      
      // Clear any cached data
      localStorage.clear();
      sessionStorage.clear();
      
      // Redirect to Google
      window.location.href = 'https://www.google.com/';
      toast.success("Successfully logged out");
    } catch (error) {
      console.error('🔓 AdminHeaderBanner: Logout exception:', error);
      toast.error('Logout failed');
    }
  };

  const navButtons: AdminNavButton[] = [
    {
      name: 'Dashboard',
      path: '/buddys_admin',
      icon: LayoutDashboard,
      bgColor: 'bg-gradient-to-b from-green-400 via-green-500 to-green-600',
      hoverColor: 'hover:from-green-500 hover:via-green-600 hover:to-green-700',
      shadowColor: 'shadow-[0_6px_0_#16a34a,0_8px_15px_rgba(0,0,0,0.3)]',
      hoverShadow: 'hover:shadow-[0_4px_0_#16a34a,0_6px_12px_rgba(0,0,0,0.4)]',
      textColor: 'text-white',
      description: 'Website Dashboard with stats and security info'
    },
    {
      name: 'Libraries',
      path: '/buddys_admin/stories',
      icon: FileText,
      bgColor: 'bg-gradient-to-b from-orange-500 via-orange-600 to-orange-700',
      hoverColor: 'hover:from-orange-600 hover:via-orange-700 hover:to-orange-800',
      shadowColor: 'shadow-[0_6px_0_#c2410c,0_8px_15px_rgba(0,0,0,0.3)]',
      hoverShadow: 'hover:shadow-[0_4px_0_#c2410c,0_6px_12px_rgba(0,0,0,0.4)]',
      textColor: 'text-white',
      description: 'Full story list with add/update, sorting and viewing services'
    },
    {
      name: 'Super Text',
      path: '/buddys_admin/super-text',
      icon: FileText,
      bgColor: 'bg-gradient-to-b from-purple-500 via-purple-600 to-purple-700',
      hoverColor: 'hover:from-purple-600 hover:via-purple-700 hover:to-purple-800',
      shadowColor: 'shadow-[0_6px_0_#9333ea,0_8px_15px_rgba(0,0,0,0.3)]',
      hoverShadow: 'hover:shadow-[0_4px_0_#9333ea,0_6px_12px_rgba(0,0,0,0.4)]',
      textColor: 'text-white',
      description: 'Super Text editor for advanced text management'
    },
    {
      name: 'Reference',
      path: '/buddys_admin/reference',
      icon: BookOpen,
      bgColor: 'bg-gradient-to-b from-cyan-400 via-cyan-500 to-cyan-600',
      hoverColor: 'hover:from-cyan-500 hover:via-cyan-600 hover:to-cyan-700',
      shadowColor: 'shadow-[0_6px_0_#0891b2,0_8px_15px_rgba(0,0,0,0.3)]',
      hoverShadow: 'hover:shadow-[0_4px_0_#0891b2,0_6px_12px_rgba(0,0,0,0.4)]',
      textColor: 'text-white',
      description: 'Reference materials and resources for administration'
    },
    {
      name: 'Site Map',
      path: '/buddys_admin/sitemap',
      icon: Globe,
      bgColor: 'bg-gradient-to-b from-teal-400 via-teal-500 to-teal-600',
      hoverColor: 'hover:from-teal-500 hover:via-teal-600 hover:to-teal-700',
      shadowColor: 'shadow-[0_6px_0_#0d9488,0_8px_15px_rgba(0,0,0,0.3)]',
      hoverShadow: 'hover:shadow-[0_4px_0_#0d9488,0_6px_12px_rgba(0,0,0,0.4)]',
      textColor: 'text-white',
      description: 'Visual map of all site pages and structure'
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 border-b border-blue-800 shadow-lg">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center relative">
          {/* Buddy's Photo - Fixed position aligned with left edge */}
          <div className="absolute left-0 top-0 bottom-0 flex items-center z-10">
            <Link to="/" onClick={scrollToTop}>
              <img 
                src="/lovable-uploads/27c4298b-582d-4de3-94d9-c1b9b177f6d0.png" 
                alt="Grandpa's beloved companion"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover object-center"
              />
            </Link>
          </div>

          {/* Left section: Title, Secure notice, and Logout button */}
          <div className="flex items-center gap-3 pl-14 sm:pl-16">
            <h1 className="text-2xl font-bold font-system" style={{ color: '#FFFF00' }}>
              Buddy's Admin
            </h1>
            <div className="relative">
              <div
                className="w-[55px] h-[55px] flex items-center justify-center rounded-md border-2 border-white/20 hover:scale-105 transition-transform cursor-pointer"
                style={{ 
                  backgroundColor: isSecure ? '#16a34a' : '#DC2626',
                  minWidth: '55px',
                  minHeight: '55px'
                }}
                onMouseEnter={() => setHoveredButton('security')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                {isSecure ? (
                  secureIconUrl ? (
                    <img 
                      src={secureIconUrl} 
                      alt="Secure"
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-white/20 rounded"></div>
                  )
                ) : (
                  <Unlock className="w-8 h-8 text-white" />
                )}
              </div>
              {hoveredButton === 'security' && (
                <div className="nav-bubble opacity-100 visible">
                  <b>{isSecure ? 'Secure' : 'OPEN'}</b>
                </div>
              )}
            </div>
            <div className="relative">
              <div
                onClick={handleLogout}
                className="w-[55px] h-[55px] flex items-center justify-center rounded-md border-2 border-orange-300/50 hover:scale-105 transition-transform cursor-pointer"
                style={{ 
                  backgroundColor: '#ff8c00',
                  minWidth: '55px',
                  minHeight: '55px'
                }}
                onMouseEnter={() => setHoveredButton('logout')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                {logoutIconUrl ? (
                  <img 
                    src={logoutIconUrl} 
                    alt="Logout"
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <LogOut className="w-12 h-12 text-white" />
                )}
              </div>
              {hoveredButton === 'logout' && (
                <div className="nav-bubble opacity-100 visible" style={{ color: '#4A7C59' }}>
                  <b>LOGOUT</b>
                </div>
              )}
            </div>
          </div>
          
          {/* Center section: Navigation buttons starting from center */}
          <nav className="absolute left-1/2 flex gap-3">
            {navButtons.map((button, index) => {
              const isActive = location.pathname === button.path || 
                (button.name === 'Libraries' && (location.pathname === '/buddys_admin/stories' || location.pathname.includes('/buddys_admin/stories')));
              const Icon = button.icon;
              
              const handleButtonClick = () => {
                if (button.openInNewTab) {
                  window.open(button.path, '_blank');
                } else {
                  scrollToTop();
                }
              };

              // Render Library button as square icon button
              const librariesButton = (
                <div 
                  key={button.name}
                  className="relative"
                  onMouseEnter={() => setHoveredButton(button.name)}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <Link to={button.path} onClick={scrollToTop}>
                    <div
                      className="w-[55px] h-[55px] flex items-center justify-center rounded-md border-2 border-yellow-300/50 hover:scale-105 transition-transform cursor-pointer"
                      style={{ 
                        backgroundColor: '#FFD700',
                        minWidth: '55px',
                        minHeight: '55px'
                      }}
                    >
                      {librariesIconUrl ? (
                        <img 
                          src={librariesIconUrl} 
                          alt="Libraries"
                          className="w-12 h-12 object-contain"
                        />
                      ) : (
                        <FileText className="w-12 h-12 text-white" />
                      )}
                    </div>
                  </Link>
                  {hoveredButton === button.name && (
                    <div className="nav-bubble opacity-100 visible">
                      <b>Library</b>
                    </div>
                  )}
                </div>
              );


              // Render Dashboard button as square icon button
              const dashboardButton = (
                <div 
                  key={button.name}
                  className="relative"
                  onMouseEnter={() => setHoveredButton(button.name)}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <Link to={button.path} onClick={scrollToTop}>
                    <div
                      className="w-[55px] h-[55px] flex items-center justify-center rounded-md border-2 border-blue-300/50 hover:scale-105 transition-transform cursor-pointer"
                      style={{ 
                        backgroundColor: '#00BFFF',
                        minWidth: '55px',
                        minHeight: '55px'
                      }}
                    >
                      {dashboardIconUrl ? (
                        <img 
                          src={dashboardIconUrl} 
                          alt="Dashboard"
                          className="w-16 h-16"
                        />
                      ) : (
                        <LayoutDashboard className="w-12 h-12 text-white" />
                      )}
                    </div>
                  </Link>
                  {hoveredButton === button.name && (
                    <div className="nav-bubble opacity-100 visible">
                      <b>Dashboard</b>
                    </div>
                  )}
                </div>
              );

              // Special handling for Dashboard button
              if (button.name === 'Dashboard') {
                return dashboardButton;
              }


              // Special handling for Library button with dropdown
              if (button.name === 'Libraries') {
                const biosButton = (
                  <div 
                    key="bios"
                    className="relative"
                    onMouseEnter={() => setHoveredButton('bios')}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    <Link to="/buddys_admin/stories?view=bios" onClick={scrollToTop}>
                      <div
                        className="w-[55px] h-[55px] flex items-center justify-center rounded-md border-2 border-brown-300/50 hover:scale-105 transition-transform cursor-pointer"
                        style={{ 
                          backgroundColor: '#814d2e',
                          minWidth: '55px',
                          minHeight: '55px'
                        }}
                      >
                        {biosIconUrl ? (
                          <img 
                            src={biosIconUrl} 
                            alt="BIO's"
                            className="w-12 h-12 object-contain"
                          />
                        ) : (
                          <span className="text-sm font-bold text-white">BIO's</span>
                        )}
                      </div>
                    </Link>
                    {hoveredButton === 'bios' && (
                      <div className="nav-bubble opacity-100 visible">
                        <b>BIO's</b>
                      </div>
                    )}
                  </div>
                );
                
                return [librariesButton];
              }

              // Special handling for Super Text button as square icon button
              if (button.name === 'Super Text') {
                const superTextButton = (
                  <div 
                    key={button.name}
                    className="relative"
                    onMouseEnter={() => setHoveredButton(button.name)}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    <Link to={button.path} onClick={scrollToTop}>
                      <div
                        className="w-[55px] h-[55px] flex items-center justify-center rounded-md border-2 border-purple-300/50 hover:scale-105 transition-transform cursor-pointer"
                        style={{ 
                          backgroundColor: '#9333ea',
                          minWidth: '55px',
                          minHeight: '55px'
                        }}
                      >
                        {storyCreateIconUrl ? (
                          <img 
                            src={storyCreateIconUrl} 
                            alt="Super Text"
                            className="w-12 h-12 object-contain"
                          />
                        ) : (
                          <FileText className="w-12 h-12 text-white" />
                        )}
                      </div>
                    </Link>
                    {hoveredButton === button.name && (
                      <div className="nav-bubble opacity-100 visible">
                        <b>Super Text</b>
                      </div>
                    )}
                  </div>
                );
                
                return superTextButton;
              }

              // Special handling for Reference button as square icon button
              if (button.name === 'Reference') {
                const { iconUrl: refIconUrl, isLoading: refLoading, error: refError } = useCachedIcon('ICO-LTB.gif');
                
                const referenceButton = (
                  <div 
                    key={button.name}
                    className="relative"
                    onMouseEnter={() => setHoveredButton(button.name)}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    <Link to={button.path} onClick={scrollToTop}>
                      <div
                        className="w-[55px] h-[55px] flex items-center justify-center rounded-md border-2 border-orange-300/50 hover:scale-105 transition-transform cursor-pointer"
                        style={{ 
                          backgroundColor: '#9c441a',
                          minWidth: '55px',
                          minHeight: '55px'
                        }}
                      >
                         {refIconUrl && !refLoading && !refError ? (
                           <img 
                             src={refIconUrl}
                             alt="Reference"
                             className="w-12 h-12 object-contain"
                             onError={(e) => {
                               console.warn('Failed to load ICO-LTB.gif icon');
                               e.currentTarget.style.display = 'none';
                             }}
                           />
                         ) : refLoading ? (
                           <div className="w-10 h-10 bg-orange-300 animate-pulse rounded" />
                         ) : (
                           <BookOpen className="w-12 h-12 text-white" />
                         )}
                      </div>
                    </Link>
                    {hoveredButton === button.name && (
                      <div className="nav-bubble opacity-100 visible">
                        <b>Reference</b>
                      </div>
                    )}
                  </div>
                );
                
                return referenceButton;
              }

              // Special handling for Site Map button as square icon button
              if (button.name === 'Site Map') {
                const siteMapButton = (
                  <div 
                    key={button.name}
                    className="relative"
                    onMouseEnter={() => setHoveredButton(button.name)}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    <Link to={button.path} onClick={scrollToTop}>
                      <div
                        className="w-[55px] h-[55px] flex items-center justify-center rounded-md border-2 border-orange-300/50 hover:scale-105 transition-transform cursor-pointer"
                        style={{ 
                          backgroundColor: '#814d2e',
                          minWidth: '55px',
                          minHeight: '55px'
                        }}
                      >
                        <Globe className="w-8 h-8 text-white" />
                      </div>
                    </Link>
                    {hoveredButton === button.name && (
                      <div className="nav-bubble opacity-100 visible">
                        <b>Site Map</b>
                      </div>
                    )}
                  </div>
                );
                
                return siteMapButton;
              }

              return (
                <div 
                  key={button.name}
                  className="relative"
                  onMouseEnter={() => setHoveredButton(button.name)}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  {button.openInNewTab ? (
                    <Button
                      onClick={handleButtonClick}
                      className={`
                        transition-all duration-200 border font-fun
                        ${button.bgColor} ${button.textColor} ${button.shadowColor} ${button.hoverShadow}
                        hover:transform hover:translate-y-1 active:translate-y-2 
                        active:shadow-[0_2px_0_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.3)]
                        ${button.hoverColor}
                      `}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {button.name}
                    </Button>
                  ) : (
                    <Link to={button.path} onClick={scrollToTop}>
                      <Button
                        className={`
                          transition-all duration-200 border font-fun
                          ${button.bgColor} ${button.textColor} ${button.shadowColor} ${button.hoverShadow}
                          hover:transform hover:translate-y-1 active:translate-y-2 
                          active:shadow-[0_2px_0_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.3)]
                          ${isActive 
                            ? 'ring-4 ring-white ring-opacity-50 transform translate-y-1' 
                            : button.hoverColor
                          }
                        `}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {button.name}
                      </Button>
                    </Link>
                  )}
                  {hoveredButton === button.name && (
                    <div className="nav-bubble opacity-100 visible">
                      {button.description}
                    </div>
                  )}
                </div>
               );
             })}
           </nav>
           
           {/* Right section: Home button */}
           <div className="absolute right-0 flex items-center">
             <div 
               className="relative"
               onMouseEnter={() => setHoveredButton('home')}
               onMouseLeave={() => setHoveredButton(null)}
             >
               <Link to="/" onClick={scrollToTop}>
                 <div
                   className="w-[55px] h-[55px] flex items-center justify-center rounded-md border-2 border-green-300/50 hover:scale-105 transition-transform cursor-pointer"
                   style={{ 
                     backgroundColor: '#16a34a',
                     minWidth: '55px',
                     minHeight: '55px'
                   }}
                 >
                   <Home className="w-8 h-8 text-white" />
                 </div>
               </Link>
               {hoveredButton === 'home' && (
                 <div className="nav-bubble opacity-100 visible">
                   <b>Home</b>
                 </div>
               )}
             </div>
           </div>
         </div>
      </div>
    </div>
  );
};

export default AdminHeaderBanner;
