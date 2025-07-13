import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Shield, ShieldCheck, AlertTriangle, Key, CheckCircle, AlertCircle, Smartphone, Usb, Info } from "lucide-react";
import type { User } from '@supabase/supabase-js';

type AuthenticatorType = 'passkey' | 'security-key';

const WebAuthnManager = () => {
  const [user, setUser] = useState<User | null>(null);
  const [webauthnEnabled, setWebauthnEnabled] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [selectedType, setSelectedType] = useState<AuthenticatorType>('passkey');
  const [showTypeSelection, setShowTypeSelection] = useState(false);
  const [registeredTypes, setRegisteredTypes] = useState<string[]>([]);

  useEffect(() => {
    setIsSupported(!!window.PublicKeyCredential);
    
    // Get current user and WebAuthn status
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('webauthn_enabled, webauthn_credentials')
          .eq('id', user.id)
          .maybeSingle();
        
        setWebauthnEnabled(profile?.webauthn_enabled || false);
        
        // Analyze registered credential types
        if (profile?.webauthn_credentials && Array.isArray(profile.webauthn_credentials)) {
          const types = profile.webauthn_credentials.map((cred: any) => cred.authenticatorType || 'unknown');
          setRegisteredTypes([...new Set(types)]);
        }
      }
    };
    
    getCurrentUser();
  }, []);

  const handleShowSetup = () => {
    setShowTypeSelection(true);
  };

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

      // Get existing credentials to append to
      const { data: profile } = await supabase
        .from('profiles')
        .select('webauthn_credentials')
        .eq('id', user.id)
        .maybeSingle();

      const existingCredentials = Array.isArray(profile?.webauthn_credentials) ? profile.webauthn_credentials : [];

      // Generate credential creation options based on selected type
      const authenticatorSelection: AuthenticatorSelectionCriteria = {
        userVerification: "required",
      };

      // Configure based on selected type
      if (selectedType === 'security-key') {
        authenticatorSelection.authenticatorAttachment = "cross-platform";
        authenticatorSelection.residentKey = "preferred";
      } else {
        // For passkeys, allow both platform and cross-platform authenticators
        // This enables 1Password, biometrics, and other password managers
        authenticatorSelection.residentKey = "preferred";
      }

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge: new TextEncoder().encode(`challenge-${Date.now()}-${selectedType}`),
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
        authenticatorSelection,
        timeout: 60000,
        attestation: "direct",
        excludeCredentials: existingCredentials.map((cred: any) => ({
          id: new Uint8Array(cred.rawId),
          type: "public-key"
        }))
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
        authenticatorType: selectedType,
        createdAt: new Date().toISOString(),
        response: {
          clientDataJSON: Array.from(new Uint8Array(credential.response.clientDataJSON)),
          attestationObject: Array.from(new Uint8Array((credential.response as AuthenticatorAttestationResponse).attestationObject))
        }
      };

      // Append to existing credentials
      const updatedCredentials = [...(existingCredentials as any[]), credentialData];

      const { error } = await supabase
        .from('profiles')
        .update({
          webauthn_enabled: true,
          webauthn_credentials: updatedCredentials
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setWebauthnEnabled(true);
      setShowTypeSelection(false);
      
      // Update registered types
      const types = updatedCredentials.map((cred: any) => cred.authenticatorType || 'unknown');
      setRegisteredTypes([...new Set(types)]);

      const typeLabel = selectedType === 'passkey' ? 'passkey authenticator' : 'physical security key';
      toast.success(`${typeLabel} registered successfully!`);
    } catch (error: any) {
      console.error('Failed to enable WebAuthn:', error);
      
      // Provide more helpful error messages
      let errorMessage = 'Failed to register authenticator';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Registration was cancelled or timed out';
      } else if (error.name === 'InvalidStateError') {
        errorMessage = 'This authenticator is already registered';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'This authenticator type is not supported';
      } else if (error.message) {
        errorMessage += ': ' + error.message;
      }
      
      toast.error(errorMessage);
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

      // Generate assertion options - works with both types
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge: new TextEncoder().encode(`auth-challenge-${Date.now()}`),
        allowCredentials: credentials.map((cred: any) => ({
          id: new Uint8Array(cred.rawId),
          type: 'public-key'
        })),
        timeout: 60000,
        userVerification: 'preferred' // More flexible for both types
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
      
      let errorMessage = 'Authentication failed';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Authentication was cancelled or timed out';
      } else if (error.name === 'InvalidStateError') {
        errorMessage = 'Invalid authenticator state';
      } else if (error.message) {
        errorMessage += ': ' + error.message;
      }
      
      toast.error(errorMessage);
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
            Enhanced security with passkeys, biometric authentication, or physical security keys
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
            
            {!webauthnEnabled || !showTypeSelection ? (
              <Button 
                onClick={webauthnEnabled ? handleShowSetup : handleShowSetup}
                disabled={isRegistering || !user}
                size="sm"
              >
                {webauthnEnabled ? 'Add Another' : 'Setup WebAuthn'}
              </Button>
            ) : null}
          </div>

          {/* Show registered authenticator types */}
          {webauthnEnabled && registeredTypes.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Registered Authenticators:</Label>
              <div className="flex gap-2 flex-wrap">
                {registeredTypes.map((type) => (
                  <Badge key={type} variant="outline" className="flex items-center gap-1">
                    {type === 'passkey' ? (
                      <>
                        <Smartphone className="h-3 w-3" />
                        Passkey
                      </>
                    ) : type === 'security-key' ? (
                      <>
                        <Usb className="h-3 w-3" />
                        Security Key
                      </>
                    ) : (
                      <>
                        <Key className="h-3 w-3" />
                        {type}
                      </>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Authenticator type selection */}
          {showTypeSelection && (
            <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" />
                <Label className="font-medium">Choose Your Authentication Method</Label>
              </div>
              
              <RadioGroup value={selectedType} onValueChange={(value) => setSelectedType(value as AuthenticatorType)}>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-white transition-colors">
                    <RadioGroupItem value="passkey" id="passkey" className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor="passkey" className="flex items-center gap-2 cursor-pointer">
                        <Smartphone className="h-4 w-4" />
                        <span className="font-medium">Passkey (Recommended)</span>
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Use 1Password, Touch ID, Face ID, Windows Hello, or other built-in authentication methods. 
                        Works seamlessly across your devices.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-white transition-colors">
                    <RadioGroupItem value="security-key" id="security-key" className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor="security-key" className="flex items-center gap-2 cursor-pointer">
                        <Usb className="h-4 w-4" />
                        <span className="font-medium">Physical Security Key</span>
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Use a USB, NFC, or Bluetooth security key like YubiKey, Titan Security Key, or similar hardware authenticators.
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>

              <Separator />

              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowTypeSelection(false)}
                  disabled={isRegistering}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleEnableWebAuthn}
                  disabled={isRegistering}
                >
                  {isRegistering ? 'Setting up...' : `Setup ${selectedType === 'passkey' ? 'Passkey' : 'Security Key'}`}
                </Button>
              </div>
            </div>
          )}

          {/* Test Authentication Button */}
          {webauthnEnabled && !showTypeSelection && (
            <Button 
              onClick={handleTestAuthentication}
              disabled={isAuthenticating}
              variant="outline"
              className="w-full"
            >
              {isAuthenticating ? 'Testing...' : 'Test WebAuthn Authentication'}
            </Button>
          )}
          
          {/* Status Messages */}
          {webauthnEnabled && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Enhanced Security Active</span>
              </div>
              <p className="mt-1 text-green-700">
                Your admin account is protected with WebAuthn. Future logins will require your registered authenticator.
              </p>
            </div>
          )}
          
          {!webauthnEnabled && !showTypeSelection && (
            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Security Enhancement Available</span>
              </div>
              <p className="mt-1 text-amber-700">
                Enable WebAuthn for mandatory additional security using passkeys, biometric authentication, or physical security keys.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WebAuthnManager;