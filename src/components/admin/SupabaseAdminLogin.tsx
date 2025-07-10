import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Mail, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useSupabaseAdminAuth } from "./SupabaseAdminAuth";
import { adminClient } from "@/integrations/supabase/clients";

const SupabaseAdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const { login } = useSupabaseAdminAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('🔐 Admin Login Attempt:', { email, timestamp: new Date().toISOString() });

    try {
      const { success, error } = await login(email, password);
      
      console.log('🔐 Login Result:', { success, error, email });
      
      if (success) {
        toast.success("Successfully logged in! Redirecting to admin dashboard...");
        console.log('✅ Admin login successful');
      } else {
        console.error('❌ Admin login failed:', error);
        
        // Enhanced error messages for better user experience
        if (error?.includes('Invalid credentials')) {
          toast.error("Invalid email or password. Please check your credentials and try again.");
        } else if (error?.includes('Account temporarily locked')) {
          toast.error("Account is temporarily locked due to multiple failed attempts. Please wait 15 minutes.");
        } else if (error?.includes('too_many_requests')) {
          toast.error("Too many login attempts. Please wait a few minutes and try again.");
        } else if (error?.includes('email_not_confirmed')) {
          toast.error("Please confirm your email address before logging in.");
        } else if (error?.includes('Session creation failed')) {
          toast.error("Authentication succeeded but session creation failed. Please try again.");
        } else {
          toast.error(error || "Login failed. Please check your credentials and try again.");
        }
      }
    } catch (error: any) {
      console.error('💥 Login exception:', error);
      toast.error(`Login error: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setIsResetting(true);
    try {
      const { error } = await adminClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password reset email sent! Check your inbox.");
        setShowResetForm(false);
      }
    } catch (error) {
      toast.error("Failed to send reset email");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-black text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2" />
            {showResetForm ? "Reset Password" : "Buddy's Admin Login"}
          </CardTitle>
          <p className="text-sm text-gray-600 text-center">
            {showResetForm 
              ? "Enter your email to receive a password reset link" 
              : "Sign in with your admin credentials"
            }
          </p>
        </CardHeader>
        <CardContent>
          {showResetForm ? (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="email"
                  placeholder="Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-lg py-3 pl-10"
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowResetForm(false)}
                  className="flex-1 text-lg py-3"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 cozy-button text-lg py-3"
                  disabled={isResetting}
                >
                  {isResetting ? "Sending..." : "Send Reset Email"}
                </Button>
              </div>
            </form>
          ) : (
            <>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="email"
                    placeholder="Admin Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-lg py-3 pl-10"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="text-lg py-3 pl-10"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full cozy-button text-lg py-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              <div className="mt-4 text-center">
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowResetForm(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 underline block"
                  >
                    Forgot your password?
                  </button>
                  <a
                    href="/buddys_admin/password-sync"
                    className="text-sm text-orange-600 hover:text-orange-800 underline block"
                  >
                    Password Sync Tool
                  </a>
                  <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
                    <strong>Debug Info:</strong> Login attempts will be logged to console. 
                    Check browser dev tools if login fails. Use "SecureAdmin2025!" as the password.
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseAdminLogin;