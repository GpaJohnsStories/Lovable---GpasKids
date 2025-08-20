import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export default function Register() {
  // Redirect to login immediately since registration is disabled
  useEffect(() => {
    console.log('Registration is disabled - redirecting to login');
  }, []);

  return <Navigate to="/auth/login" replace />;
}