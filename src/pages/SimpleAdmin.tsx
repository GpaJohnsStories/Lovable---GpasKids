import WelcomeHeader from "@/components/WelcomeHeader";
import SimpleAdminLogin from "@/components/admin/SimpleAdminLogin";

const SimpleAdmin = () => {
  const handleLoginSuccess = () => {
    // Redirect to the full admin dashboard
    window.location.href = '/buddys_admin';
  };

  return (
    <div className="min-h-screen bg-background">
      <WelcomeHeader />
      <SimpleAdminLogin onSuccess={handleLoginSuccess} />
    </div>
  );
};

export default SimpleAdmin;