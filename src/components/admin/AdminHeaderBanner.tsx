
import { Button } from "@/components/ui/button";
import { LogOut, FileText, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "./AdminAuthProvider";
import { Link, useLocation } from "react-router-dom";

const AdminHeaderBanner = () => {
  const { logout } = useAdminAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
  };

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 border-b border-orange-700 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Buddy's Admin
            </h1>
            <nav className="flex gap-2">
              <Link to="/buddys_admin">
                <Button
                  variant="ghost"
                  className={`text-white hover:bg-orange-400/20 border border-transparent hover:border-orange-300/30 ${
                    location.pathname === '/buddys_admin' 
                      ? 'bg-orange-400/30 border-orange-300/50' 
                      : ''
                  }`}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Stories
                </Button>
              </Link>
              <Link to="/admin/comments">
                <Button
                  variant="ghost"
                  className={`text-white hover:bg-orange-400/20 border border-transparent hover:border-orange-300/30 ${
                    location.pathname === '/admin/comments' 
                      ? 'bg-orange-400/30 border-orange-300/50' 
                      : ''
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
