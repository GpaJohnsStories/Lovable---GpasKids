import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Shield, ShieldCheck, AlertTriangle, Key, CheckCircle, AlertCircle } from "lucide-react";
import type { User } from '@supabase/supabase-js';

const WebAuthnManager = () => {
  const [user, setUser] = useState<User | null>(null);
  const [webauthnEnabled, setWebauthnEnabled] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    setIsSupported(!!window.PublicKeyCredential);
    
    // Get current user and WebAuthn status
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('webauthn_enabled')
          .eq('id', user.id)
          .maybeSingle();
        
        setWebauthnEnabled(profile?.webauthn_enabled || false);
      }
    };
    
    getCurrentUser();
  }, []);

  const handleEnableWebAuthn = async () => {
    if (!user) {
      toast.error('Must be logged in to enable WebAuthn');
      return;
    }

    setIsRegistering(true);
    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        toast.error('WebAuthn is not supported on this device');
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
          id: new TextEncoder().encode(user.id),
          name: user.email!,
          displayName: user.email!,
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
        throw new Error('Failed to create credential');
      }

      // Store the credential in the user's profile
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
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setWebauthnEnabled(true);
      toast.success('WebAuthn enabled successfully!');
    } catch (error: any) {
      console.error('Failed to enable WebAuthn:', error);
      toast.error('Failed to enable WebAuthn: ' + error.message);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleTestAuthentication = async () => {
    if (!user || !webauthnEnabled) {
      return;
    }

    setIsAuthenticating(true);
    try {
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
        toast.error('WebAuthn authentication failed');
        return;
      }

      toast.success('WebAuthn test successful!');
    } catch (error: any) {
      console.error('WebAuthn authentication failed:', error);
      toast.error('WebAuthn authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (!isSupported) {
    return (
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          WebAuthn is not supported on this browser. Please use a modern browser for enhanced security features.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            WebAuthn Security
          </CardTitle>
          <CardDescription>
            Enhanced security with physical security keys or biometric authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <span>WebAuthn Status:</span>
              {webauthnEnabled ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Enabled
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Disabled
                </Badge>
              )}
            </div>
            
            {!webauthnEnabled ? (
              <Button 
                onClick={handleEnableWebAuthn}
                disabled={isRegistering || !user}
                size="sm"
              >
                {isRegistering ? 'Setting up...' : 'Enable WebAuthn'}
              </Button>
            ) : (
              <Button 
                onClick={handleTestAuthentication}
                disabled={isAuthenticating}
                variant="outline"
                size="sm"
              >
                {isAuthenticating ? 'Testing...' : 'Test WebAuthn'}
              </Button>
            )}
          </div>
          
          {webauthnEnabled && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Enhanced Security Active</span>
              </div>
              <p className="mt-1 text-green-700">
                Your admin account is protected with WebAuthn. Future logins will require your security key or biometric verification.
              </p>
            </div>
          )}
          
          {!webauthnEnabled && (
            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Security Enhancement Available</span>
              </div>
              <p className="mt-1 text-amber-700">
                Enable WebAuthn for an additional layer of security using security keys or biometric authentication.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WebAuthnManager;