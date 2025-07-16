import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";

interface SecureAdminLoginProps {
  onSuccess: () => void;
}

const SecureAdminLogin = ({ onSuccess }: SecureAdminLoginProps) => {
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
      // Use the secure-auth Edge Function
      const { data, error } = await supabase.functions.invoke('secure-auth', {
        body: {
          action: 'signin',
          email,
          password
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        toast.error('Login failed - please try again');
        return;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      if (data.session && data.user) {
        toast.success('Login successful!');
        onSuccess();
      } else {
        toast.error('Login failed - invalid response');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed - please try again');
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
            Secure Admin Login
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
          <Button onClick={handleLogin} className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Login'}
          </Button>
          
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-primary underline w-full text-center"
          >
            Back to Home
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecureAdminLogin;