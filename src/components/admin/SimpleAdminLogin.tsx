import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Shield, Key } from "lucide-react";

interface SimpleAdminLoginProps {
  onSuccess: () => void;
}

const SimpleAdminLogin = ({ onSuccess }: SimpleAdminLoginProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [awaitingWebAuthn, setAwaitingWebAuthn] = useState(false);
  const [tempUser, setTempUser] = useState<any>(null);

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

      // Check admin role and WebAuthn status
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, webauthn_enabled')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile || profile.role !== 'admin') {
        toast.error('Access denied - admin role required');
        await supabase.auth.signOut();
        return;
      }

      // Check if WebAuthn is enabled
      if (profile.webauthn_enabled) {
        setTempUser(authData.user);
        setAwaitingWebAuthn(true);
        toast.info('Please complete WebAuthn verification');
        return;
      }

      // Success - proceed without WebAuthn
      toast.success('Login successful!');
      onSuccess();
    } catch (error: any) {
      toast.error('Login failed');
      await supabase.auth.signOut();
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebAuthnVerification = async () => {
    if (!tempUser) return;

    setIsLoading(true);
    try {
      // Get stored credentials
      const { data: profile } = await supabase
        .from('profiles')
        .select('webauthn_credentials')
        .eq('id', tempUser.id)
        .single();

      const credentials = profile?.webauthn_credentials;
      if (!credentials || !Array.isArray(credentials) || credentials.length === 0) {
        toast.error('No WebAuthn credentials found');
        await supabase.auth.signOut();
        setAwaitingWebAuthn(false);
        setTempUser(null);
        return;
      }

      // Generate assertion options
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge: new TextEncoder().encode(`auth-challenge-${Date.now()}`),
        allowCredentials: credentials.map((cred: any) => ({
          id: new Uint8Array(cred.rawId),
          type: 'public-key'
        })),
        timeout: 60000,
        userVerification: 'required'
      };

      // Get the assertion
      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      }) as PublicKeyCredential;

      if (!assertion) {
        toast.error('WebAuthn verification failed');
        await supabase.auth.signOut();
        setAwaitingWebAuthn(false);
        setTempUser(null);
        return;
      }

      // Success - both email/password and WebAuthn verified
      toast.success('Login successful with WebAuthn!');
      setAwaitingWebAuthn(false);
      setTempUser(null);
      onSuccess();
    } catch (error: any) {
      console.error('WebAuthn verification failed:', error);
      toast.error('WebAuthn verification failed');
      await supabase.auth.signOut();
      setAwaitingWebAuthn(false);
      setTempUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelWebAuthn = async () => {
    await supabase.auth.signOut();
    setAwaitingWebAuthn(false);
    setTempUser(null);
    toast.info('Login cancelled');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (awaitingWebAuthn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-primary flex items-center justify-center gap-2">
              <Shield className="h-6 w-6" />
              WebAuthn Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50">
              <Key className="h-4 w-4" />
              <AlertDescription>
                Please use your security key or biometric authentication to complete the login process.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Button onClick={handleWebAuthnVerification} className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Complete WebAuthn Verification'}
              </Button>
              <Button onClick={handleCancelWebAuthn} variant="outline" className="w-full" size="lg">
                Cancel
              </Button>
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