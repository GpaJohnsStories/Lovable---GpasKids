import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminAccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Directly redirect to admin dashboard
    navigate('/buddys_admin/dashboard');
  }, [navigate]);

  return <div>Redirecting to admin...</div>;
};

export default AdminAccess;