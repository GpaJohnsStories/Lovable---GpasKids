import { useState } from 'react';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'login' | 'webauthn'>('login');

  const handleEmailLogin = async () => {
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    console.log('🔐 Starting login for:', email);

    try {
      // Step 1: Email/password login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('❌ Login error:', authError);
        toast.error(authError.message);
        return;
      }

      if (!authData.user) {
        toast.error('Login failed - no user data');
        return;
      }

      console.log('✅ Email login successful, checking admin role...');

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, webauthn_enabled')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('❌ Profile check error:', profileError);
        toast.error('Failed to verify admin access');
        return;
      }

      if (!profile || profile.role !== 'admin') {
        console.log('❌ User is not admin:', profile?.role);
        toast.error('Access denied - admin role required');
        await supabase.auth.signOut();
        return;
      }

      console.log('✅ Admin role verified');

      // Check if WebAuthn is enabled for this user
      if (profile.webauthn_enabled) {
        console.log('🔑 WebAuthn required, moving to step 2');
        setStep('webauthn');
      } else {
        console.log('✅ No WebAuthn required, login complete');
        toast.success('Login successful!');
        onSuccess();
      }
    } catch (error: any) {
      console.error('💥 Login exception:', error);
      toast.error('Login failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebAuthn = async () => {
    setIsLoading(true);
    
    try {
      console.log('🔑 Starting WebAuthn authentication...');
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('User session lost');
        setStep('login');
        return;
      }

      // Get stored credentials
      const { data: profile } = await supabase
        .from('profiles')
        .select('webauthn_credentials')
        .eq('id', user.id)
        .single();

      const credentials = profile?.webauthn_credentials;
      if (!credentials || !Array.isArray(credentials) || credentials.length === 0) {
        toast.error('No WebAuthn credentials found');
        return;
      }

      // Generate assertion options
      const challenge = new TextEncoder().encode(`auth-challenge-${Date.now()}`);
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge,
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
        toast.error('WebAuthn authentication failed');
        return;
      }

      console.log('✅ WebAuthn authentication successful');
      toast.success('Login successful!');
      onSuccess();
    } catch (error: any) {
      console.error('❌ WebAuthn error:', error);
      toast.error('WebAuthn authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep('login');
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
            {step === 'login' ? 'Admin Login' : 'Security Key Required'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'login' ? (
            <>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
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
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
                />
              </div>
              <Button onClick={handleEmailLogin} className="w-full" size="lg">
                Login
              </Button>
            </>
          ) : (
            <>
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Please authenticate with your security key to complete login.
                </p>
                <Button onClick={handleWebAuthn} className="w-full" size="lg">
                  Authenticate with Security Key
                </Button>
                <Button onClick={handleBack} variant="outline" className="w-full">
                  Back to Login
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleAdminLogin;