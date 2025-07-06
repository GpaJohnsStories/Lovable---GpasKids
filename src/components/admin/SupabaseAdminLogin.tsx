import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Shield, Key } from "lucide-react";
import { toast } from "sonner";
import { useSupabaseAdminAuth } from "./SupabaseAdminAuthProvider";
import { supabase } from "@/integrations/supabase/client";

const SupabaseAdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signUpMode, setSignUpMode] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  
  const { login, signUp, isAuthenticated, isAdmin } = useSupabaseAdminAuth();
  
  // Check if this is a password reset flow
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    // Check both URL params and hash params for the tokens
    const accessToken = urlParams.get('access_token') || hashParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token') || hashParams.get('refresh_token');
    const type = urlParams.get('type') || hashParams.get('type');
    
    console.log('Password reset check:', { type, hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });
    
    if (type === 'recovery' && accessToken && refreshToken) {
      console.log('Setting password reset mode');
      setIsPasswordReset(true);
      // Set the session from the URL tokens
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });
    }
  }, []);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password updated successfully! You can now log in.");
        setIsPasswordReset(false);
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (err) {
      toast.error("Failed to update password");
    }
    setIsLoading(false);
  };
  
  const handlePasswordReset = async () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/buddys_admin/stories`
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password reset email sent! Check your inbox.");
      }
    } catch (err) {
      toast.error("Failed to send reset email");
    }
    setIsLoading(false);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('SupabaseAdminLogin: Starting auth process', { signUpMode, email });
    setIsLoading(true);

    try {
      if (signUpMode) {
        console.log('SupabaseAdminLogin: Attempting sign up');
        const { success, error } = await signUp(email, password);
        console.log('SupabaseAdminLogin: Sign up result', { success, error });
        
        if (success) {
          toast.success("Account created! Check your email to verify your account. Contact admin to get admin privileges.");
        } else {
          toast.error(error || "Failed to create account");
        }
      } else {
        console.log('SupabaseAdminLogin: Attempting login');
        const { success, error } = await login(email, password);
        console.log('SupabaseAdminLogin: Login result', { success, error });
        
        if (success) {
          console.log('SupabaseAdminLogin: Login successful');
          toast.success("Login successful!");
        } else {
          toast.error(error || "Invalid credentials");
        }
      }
    } catch (err) {
      console.error('SupabaseAdminLogin: Exception during auth', err);
      toast.error("An unexpected error occurred");
    }
    
    setIsLoading(false);
  };

  // Show status if already authenticated
  if (isAuthenticated && isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-black text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
              Admin Access Active
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              You are logged in as an admin via Supabase Authentication
            </p>
            <div className="px-3 py-1 rounded bg-green-100 text-green-800 text-sm">
              Secure Authentication: Active
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-black text-center">
            {isPasswordReset ? (
              <>
                <Key className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                Reset Your Password
              </>
            ) : (
              <>
                <BookOpen className="h-8 w-8 mx-auto mb-2" />
                Buddy's Admin Login
              </>
            )}
          </CardTitle>
          <p className="text-sm text-gray-600 text-center">
            {isPasswordReset ? "Enter your new password" : "Secure Supabase Authentication"}
          </p>
        </CardHeader>
        <CardContent>
          {isPasswordReset ? (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Password Reset:</strong> Please enter your new password below.
                </p>
              </div>
              
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full cozy-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-800">
                  <strong>Secure System:</strong> Using Supabase authentication with admin role verification.
                  {!signUpMode && " Need an account? "}
                  <button 
                    onClick={() => setSignUpMode(!signUpMode)}
                    className="underline text-green-700 hover:text-green-900"
                  >
                    {signUpMode ? 'Back to Login' : 'Sign up here'}
                  </button>
                </p>
              </div>
              
              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full cozy-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : signUpMode ? "Create Admin Account" : "Login"}
                </Button>
              </form>
              
              <div className="mt-4 text-center space-y-2">
                {!signUpMode && (
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    className="text-sm text-blue-600 hover:text-blue-800 underline block w-full py-2"
                    disabled={isLoading}
                  >
                    🔑 Forgot your password? Click here to reset
                  </button>
                )}
                
                {signUpMode && email && (
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    className="text-sm text-blue-600 hover:text-blue-800 underline block w-full py-2"
                    disabled={isLoading}
                  >
                    🔑 Already have an account? Reset password
                  </button>
                )}
              </div>
              
              {signUpMode && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 text-sm text-blue-800">
                  <strong>Note:</strong> After creating your account, you'll need admin privileges. 
                  Contact the system administrator to promote your account to admin status.
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseAdminLogin;