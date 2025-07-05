import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Shield } from "lucide-react";
import { toast } from "sonner";
import { useSupabaseAdminAuth } from "./SupabaseAdminAuthProvider";

const SupabaseAdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signUpMode, setSignUpMode] = useState(false);
  
  const { login, signUp, isAuthenticated, isAdmin } = useSupabaseAdminAuth();

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
            <BookOpen className="h-8 w-8 mx-auto mb-2" />
            Buddy's Admin Login
          </CardTitle>
          <p className="text-sm text-gray-600 text-center">
            Secure Supabase Authentication
          </p>
        </CardHeader>
        <CardContent>
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
          
          {signUpMode && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 text-sm text-blue-800">
              <strong>Note:</strong> After creating your account, you'll need admin privileges. 
              Contact the system administrator to promote your account to admin status.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseAdminLogin;