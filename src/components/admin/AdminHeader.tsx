
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "./AdminAuthProvider";
import { SidebarTrigger } from "@/components/ui/sidebar";

const AdminHeader = () => {
  const { logout } = useAdminAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Buddy's Admin Dashboard
        </h1>
      </div>
      <Button onClick={handleLogout} variant="outline" className="cozy-button">
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  );
};

export default AdminHeader;
