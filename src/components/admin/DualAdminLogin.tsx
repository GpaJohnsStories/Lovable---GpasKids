import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Shield, User } from "lucide-react";
import { toast } from "sonner";
import { useDualAdminAuth } from "./DualAdminAuthProvider";

const DualAdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signUpMode, setSignUpMode] = useState(false);
  
  const { 
    legacyLogin, 
    supabaseLogin, 
    supabaseSignUp, 
    authMode, 
    isSupabaseAuthenticated,
    isLegacyAuthenticated 
  } = useDualAdminAuth();

  const handleLegacyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { success, error } = await legacyLogin(email, password);
    if (success) {
      toast.success("Successfully logged in with legacy credentials!");
    } else {
      toast.error(error || "Invalid credentials");
    }
    
    setIsLoading(false);
  };

  const handleSupabaseAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login: Starting Supabase auth process', { signUpMode, email });
    setIsLoading(true);

    try {
      if (signUpMode) {
        console.log('Login: Attempting sign up');
        const { success, error } = await supabaseSignUp(email, password);
        console.log('Login: Sign up result', { success, error });
        
        if (success) {
          toast.success("Account created! Check your email to verify your account.");
        } else {
          toast.error(error || "Failed to create account");
        }
      } else {
        console.log('Login: Attempting login');
        const { success, error } = await supabaseLogin(email, password);
        console.log('Login: Login result', { success, error });
        
        if (success) {
          console.log('Login: Login successful, waiting for auth state update');
          toast.success("Successfully logged in with Supabase!");
        } else {
          toast.error(error || "Invalid credentials");
        }
      }
    } catch (err) {
      console.error('Login: Exception during auth', err);
      toast.error("An unexpected error occurred");
    }
    
    console.log('Login: Setting loading to false');
    setIsLoading(false);
  };

  // Show status if already authenticated
  if (isSupabaseAuthenticated || isLegacyAuthenticated) {
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
              You are logged in via: <strong>{authMode === 'supabase' ? 'Secure Supabase Auth' : 'Legacy System'}</strong>
            </p>
            <div className="flex gap-2 text-sm">
              <div className={`px-3 py-1 rounded ${isSupabaseAuthenticated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                Supabase: {isSupabaseAuthenticated ? 'Active' : 'Inactive'}
              </div>
              <div className={`px-3 py-1 rounded ${isLegacyAuthenticated ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'}`}>
                Legacy: {isLegacyAuthenticated ? 'Active' : 'Inactive'}
              </div>
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
            Transition to secure authentication system
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="supabase" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="supabase" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Secure
              </TabsTrigger>
              <TabsTrigger value="legacy" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Legacy
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="supabase" className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-800">
                  <strong>Recommended:</strong> Use this secure authentication system. 
                  {!signUpMode && " Need an account? "}
                  <button 
                    onClick={() => setSignUpMode(!signUpMode)}
                    className="underline text-green-700 hover:text-green-900"
                  >
                    {signUpMode ? 'Back to Login' : 'Sign up here'}
                  </button>
                </p>
              </div>
              
              <form onSubmit={handleSupabaseAuth} className="space-y-4">
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                  <strong>Note:</strong> After creating your account, you'll need to be promoted to admin status. 
                  Contact the system administrator or use the emergency admin function.
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="legacy" className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-orange-800">
                  <strong>Legacy System:</strong> Use your existing credentials. 
                  This system will be phased out for security.
                </p>
              </div>
              
              <form onSubmit={handleLegacyLogin} className="space-y-4">
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
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login (Legacy)"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DualAdminLogin;