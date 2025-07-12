import { useNavigate } from "react-router-dom";
import WelcomeHeader from "@/components/WelcomeHeader";
import SimpleAdminLogin from "@/components/admin/SimpleAdminLogin";

const SimpleAdmin = () => {
  const navigate = useNavigate();
  
  const handleLoginSuccess = () => {
    // Use React Router navigation instead of window.location
    navigate('/buddys_admin');
  };

  return (
    <div className="min-h-screen bg-background">
      <WelcomeHeader />
      <SimpleAdminLogin onSuccess={handleLoginSuccess} />
    </div>
  );
};

export default SimpleAdmin;