
import { Button } from "@/components/ui/button";
import { LogOut, FileText, MessageSquare, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { useDualAdminAuth } from "./DualAdminAuthProvider";
import { Link, useLocation } from "react-router-dom";

const AdminHeaderBanner = () => {
  const { legacyLogout, supabaseLogout, authMode, isLegacyAuthenticated, isSupabaseAuthenticated } = useDualAdminAuth();
  const location = useLocation();

  const handleLogout = async () => {
    if (isSupabaseAuthenticated) {
      await supabaseLogout();
    }
    if (isLegacyAuthenticated) {
      await legacyLogout();
    }
    toast.success("Logged out successfully");
  };

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-orange-500 to-orange-600 border-b border-orange-700 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Buddy's Admin
              </h1>
              <div className="text-xs bg-white/20 rounded px-2 py-1 text-white">
                {authMode === 'supabase' ? '🔒 Secure' : authMode === 'legacy' ? '⚠️ Legacy' : 'Unknown'}
              </div>
            </div>
            <nav className="flex gap-2">
              <Link to="/admin/dashboard">
                <Button
                  variant="ghost"
                  className={`transition-all duration-200 border shadow-[0_6px_0_#16a34a,0_8px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_0_#16a34a,0_6px_12px_rgba(0,0,0,0.4)] hover:transform hover:translate-y-1 active:translate-y-2 active:shadow-[0_2px_0_#16a34a,0_4px_8px_rgba(0,0,0,0.3)] ${
                    location.pathname === '/admin/dashboard' 
                      ? 'bg-gradient-to-b from-green-400 via-green-500 to-green-600 text-white border-green-700 ring-4 ring-white ring-opacity-50 transform translate-y-1' 
                      : 'bg-gradient-to-b from-green-400 via-green-500 to-green-600 text-white border-green-700 hover:from-green-500 hover:via-green-600 hover:to-green-700'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/buddys_admin">
                <Button
                  variant="ghost"
                  className={`transition-all duration-200 border shadow-[0_6px_0_#c2410c,0_8px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_0_#c2410c,0_6px_12px_rgba(0,0,0,0.4)] hover:transform hover:translate-y-1 active:translate-y-2 active:shadow-[0_2px_0_#c2410c,0_4px_8px_rgba(0,0,0,0.3)] ${
                    location.pathname === '/buddys_admin' 
                      ? 'bg-gradient-to-b from-orange-500 via-orange-600 to-orange-700 text-white border-orange-800 ring-4 ring-white ring-opacity-50 transform translate-y-1' 
                      : 'bg-gradient-to-b from-orange-500 via-orange-600 to-orange-700 text-white border-orange-800 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800'
                  }`}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Stories
                </Button>
              </Link>
              <Link to="/admin/comments">
                <Button
                  variant="ghost"
                  className={`transition-all duration-200 border shadow-[0_6px_0_#ca8a04,0_8px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_0_#ca8a04,0_6px_12px_rgba(0,0,0,0.4)] hover:transform hover:translate-y-1 active:translate-y-2 active:shadow-[0_2px_0_#ca8a04,0_4px_8px_rgba(0,0,0,0.3)] ${
                    location.pathname === '/admin/comments' 
                      ? 'bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 text-green-800 border-yellow-600 ring-4 ring-white ring-opacity-50 transform translate-y-1' 
                      : 'bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 text-green-800 border-yellow-600 hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-600'
                  }`}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Comments
                </Button>
              </Link>
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
