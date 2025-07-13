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

      // MANDATORY WebAuthn for ALL admins - no exceptions
      if (!profile.webauthn_enabled) {
        // Force WebAuthn setup on first login
        setTempUser(authData.user);
        setAwaitingWebAuthn(true);
        toast.error('WebAuthn setup required - admin access requires physical security key');
        return;
      }

      // WebAuthn is enabled - require verification
      setTempUser(authData.user);
      setAwaitingWebAuthn(true);
      toast.info('Physical security key required for admin access');
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
      // Check if this is first-time setup
      const { data: profile } = await supabase
        .from('profiles')
        .select('webauthn_enabled, webauthn_credentials')
        .eq('id', tempUser.id)
        .single();

      // If WebAuthn not enabled, force setup first
      if (!profile?.webauthn_enabled) {
        await handleForceWebAuthnSetup();
        return;
      }

      // Proceed with normal verification
      const credentials = profile?.webauthn_credentials;
      if (!credentials || !Array.isArray(credentials) || credentials.length === 0) {
        toast.error('No WebAuthn credentials found - contact system administrator');
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
        toast.error('Physical security key verification failed');
        await supabase.auth.signOut();
        setAwaitingWebAuthn(false);
        setTempUser(null);
        return;
      }

      // Success - admin access granted
      toast.success('Admin access granted with physical security key!');
      setAwaitingWebAuthn(false);
      setTempUser(null);
      onSuccess();
    } catch (error: any) {
      console.error('WebAuthn verification failed:', error);
      toast.error('Physical security key verification failed');
      await supabase.auth.signOut();
      setAwaitingWebAuthn(false);
      setTempUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceWebAuthnSetup = async () => {
    if (!tempUser) return;

    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        toast.error('WebAuthn not supported - admin access requires compatible device');
        await supabase.auth.signOut();
        setAwaitingWebAuthn(false);
        setTempUser(null);
        return;
      }

      // Generate credential creation options
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge: new TextEncoder().encode(`challenge-${Date.now()}`),
        rp: {
          name: "Grandpa's Kids Stories Admin",
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(tempUser.id),
          name: tempUser.email!,
          displayName: tempUser.email!,
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" }, // ES256
          { alg: -257, type: "public-key" }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
        attestation: "direct"
      };

      // Create the credential
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('Failed to create security key credential');
      }

      // Store the credential
      const credentialData = {
        id: credential.id,
        rawId: Array.from(new Uint8Array(credential.rawId)),
        type: credential.type,
        response: {
          clientDataJSON: Array.from(new Uint8Array(credential.response.clientDataJSON)),
          attestationObject: Array.from(new Uint8Array((credential.response as AuthenticatorAttestationResponse).attestationObject))
        }
      };

      const { error } = await supabase
        .from('profiles')
        .update({
          webauthn_enabled: true,
          webauthn_credentials: [credentialData]
        })
        .eq('id', tempUser.id);

      if (error) {
        throw error;
      }

      toast.success('Security key registered! Admin access granted.');
      setAwaitingWebAuthn(false);
      setTempUser(null);
      onSuccess();
    } catch (error: any) {
      console.error('Failed to setup WebAuthn:', error);
      toast.error('Failed to setup security key - admin access denied');
      await supabase.auth.signOut();
      setAwaitingWebAuthn(false);
      setTempUser(null);
    }
  };

  const handleCancelWebAuthn = async () => {
    await supabase.auth.signOut();
    setAwaitingWebAuthn(false);
    setTempUser(null);
    toast.error('Admin access denied - physical security key required');
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
              <Shield className="h-6 w-6 text-red-600" />
              Security Key Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-red-200 bg-red-50">
              <Key className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>MANDATORY:</strong> Physical security key required for admin access. No exceptions.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Button onClick={handleWebAuthnVerification} className="w-full bg-red-600 hover:bg-red-700" size="lg" disabled={isLoading}>
                {isLoading ? 'Verifying Security Key...' : 'Use Physical Security Key'}
              </Button>
              <Button onClick={handleCancelWebAuthn} variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-50" size="lg">
                Cancel - Access Denied
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