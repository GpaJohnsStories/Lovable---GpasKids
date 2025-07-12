import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";

interface SimpleAdminLoginProps {
  onSuccess: () => void;
}

const SimpleAdminLogin = ({ onSuccess }: SimpleAdminLoginProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      // Simple email/password check
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        toast.error('Invalid email or password');
        return;
      }

      if (!authData.user) {
        toast.error('Login failed');
        return;
      }

      // Check admin role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile || profile.role !== 'admin') {
        toast.error('Access denied - admin role required');
        await supabase.auth.signOut();
        return;
      }

      // Success - call the success callback immediately
      toast.success('Login successful!');
      onSuccess();
    } catch (error: any) {
      toast.error('Login failed');
      await supabase.auth.signOut();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-primary">
            Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <Button onClick={handleLogin} className="w-full" size="lg">
            Login
          </Button>
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-sm text-muted-foreground hover:text-primary underline"
            >
              Back to Home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleAdminLogin;