
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, FileText, MessageSquare, LayoutDashboard, Volume2, Globe, ChevronDown, Users, Plus } from "lucide-react";
import { toast } from "sonner";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";


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


  const handleCreateStory = () => {
    navigate('/buddys_admin/stories?action=create');
  };

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
      path: '/buddys_admin/dashboard',
      icon: LayoutDashboard,
      bgColor: 'bg-gradient-to-b from-green-400 via-green-500 to-green-600',
      hoverColor: 'hover:from-green-500 hover:via-green-600 hover:to-green-700',
      shadowColor: 'shadow-[0_6px_0_#16a34a,0_8px_15px_rgba(0,0,0,0.3)]',
      hoverShadow: 'hover:shadow-[0_4px_0_#16a34a,0_6px_12px_rgba(0,0,0,0.4)]',
      textColor: 'text-white',
      description: 'Website Dashboard with stats and security info'
    },
    {
      name: 'Stories',
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
      name: 'Comments',
      path: '/buddys_admin/comments',
      icon: MessageSquare,
      bgColor: 'bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500',
      hoverColor: 'hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-600',
      shadowColor: 'shadow-[0_6px_0_#ca8a04,0_8px_15px_rgba(0,0,0,0.3)]',
      hoverShadow: 'hover:shadow-[0_4px_0_#ca8a04,0_6px_12px_rgba(0,0,0,0.4)]',
      textColor: 'text-green-800',
      description: 'Full comment list with edit and approval services'
    },
    {
      name: 'Voices',
      path: '/buddys_admin/voice-preview',
      icon: Volume2,
      bgColor: 'bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-500 hover:via-purple-600 hover:to-purple-700',
      shadowColor: 'shadow-[0_6px_0_#7c3aed,0_8px_15px_rgba(0,0,0,0.3)]',
      hoverShadow: 'hover:shadow-[0_4px_0_#7c3aed,0_6px_12px_rgba(0,0,0,0.4)]',
      textColor: 'text-white',
      description: 'Preview stories with various voices (opens in new tab)',
      openInNewTab: true
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-orange-500 to-orange-600 border-b border-orange-700 shadow-lg">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Buddy's Admin
              </h1>
              <div className="text-xs bg-green-500 rounded px-2 py-1 text-white font-semibold">
                🔒 Secure
              </div>
            </div>
            <nav className="flex gap-2">
              {navButtons.map((button, index) => {
                const isActive = location.pathname === button.path || 
                  (button.name === 'Stories' && (location.pathname === '/buddys_admin/stories' || location.pathname.includes('/buddys_admin/stories')));
                const Icon = button.icon;
                
                const handleButtonClick = () => {
                  if (button.openInNewTab) {
                    window.open(button.path, '_blank');
                  } else {
                    scrollToTop();
                  }
                };

                // Render Stories button
                const storiesButton = (
                  <div 
                    key={button.name}
                    className="relative"
                    onMouseEnter={() => setHoveredButton(button.name)}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
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
                          <ChevronDown className="h-3 w-3 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg">
                        <DropdownMenuItem asChild>
                          <Link 
                            to="/buddys_admin/stories?view=stories" 
                            onClick={scrollToTop}
                            className="flex items-center w-full px-3 py-2 text-sm hover:bg-orange-50 cursor-pointer"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Stories
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link 
                            to="/buddys_admin/stories?view=bios" 
                            onClick={scrollToTop}
                            className="flex items-center w-full px-3 py-2 text-sm hover:bg-orange-50 cursor-pointer"
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Bios
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {hoveredButton === button.name && (
                      <div className="nav-bubble opacity-100 visible">
                        {button.description}
                      </div>
                    )}
                  </div>
                );

                // Render + Story button after Stories button
                const createStoryButton = (
                  <Button
                    key="create-story"
                    onClick={handleCreateStory}
                    variant="ghost"
                    className="
                      transition-all duration-200 border font-fun
                      bg-gradient-to-b from-green-400 via-green-500 to-green-600 text-white
                      shadow-[0_6px_0_#16a34a,0_8px_15px_rgba(0,0,0,0.3)]
                      hover:shadow-[0_4px_0_#16a34a,0_6px_12px_rgba(0,0,0,0.4)]
                      hover:transform hover:translate-y-1 active:translate-y-2 
                      active:shadow-[0_2px_0_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.3)]
                      hover:from-green-500 hover:via-green-600 hover:to-green-700
                    "
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Story
                  </Button>
                );

                // Special handling for Stories button with dropdown
                if (button.name === 'Stories') {
                  return [storiesButton, ...(isViewer ? [] : [createStoryButton])];
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
                        variant="ghost"
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
                          variant="ghost"
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
          </div>
          <Button 
            onClick={handleLogout} 
            variant="ghost" 
            className="text-white hover:bg-orange-400/20 border border-orange-300/30"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeaderBanner;
