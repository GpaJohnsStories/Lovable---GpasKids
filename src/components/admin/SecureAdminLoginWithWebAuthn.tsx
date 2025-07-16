import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Shield, Key, Home, Smartphone, Usb, CheckCircle, AlertTriangle } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface SecureAdminLoginWithWebAuthnProps {
  onSuccess: () => void;
}

type LoginStep = 'credentials' | 'webauthn' | 'success';

const SecureAdminLoginWithWebAuthn = ({ onSuccess }: SecureAdminLoginWithWebAuthnProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<LoginStep>('credentials');
  const [userId, setUserId] = useState<string | null>(null);
  const [webauthnRequired, setWebauthnRequired] = useState(false);
  const [registeredTypes, setRegisteredTypes] = useState<string[]>([]);
  const [webauthnSupported, setWebauthnSupported] = useState(false);

  useEffect(() => {
    setWebauthnSupported(!!window.PublicKeyCredential);
  }, []);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Authenticate with password using Edge Function
      const { data, error } = await supabase.functions.invoke('secure-auth', {
        body: {
          email,
          password,
          action: 'signin'
        }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Set the session
      if (data.session) {
        await supabase.auth.setSession(data.session);
        const user = data.user || data.session.user;
        setUserId(user.id);

        // Check if user has WebAuthn enabled
        const { data: profile } = await supabase
          .from('profiles')
          .select('webauthn_enabled, webauthn_credentials, role')
          .eq('id', user.id)
          .maybeSingle();

        // Verify admin role
        if (profile?.role !== 'admin') {
          await supabase.auth.signOut();
          throw new Error('Access denied. Admin privileges required.');
        }

        // Check WebAuthn requirement
        if (profile?.webauthn_enabled && Array.isArray(profile?.webauthn_credentials) && profile.webauthn_credentials.length > 0) {
          setWebauthnRequired(true);
          
          // Analyze registered credential types
          const types = profile.webauthn_credentials.map((cred: any) => cred.authenticatorType || 'unknown');
          setRegisteredTypes([...new Set(types)] as string[]);
          
          setCurrentStep('webauthn');
          toast.success("Password verified. Please complete WebAuthn authentication.");
        } else {
          // No WebAuthn required, complete login
          setCurrentStep('success');
          toast.success("Login successful!");
          setTimeout(() => onSuccess(), 1000);
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "Login failed");
      
      // Clear form on error
      setPassword("");
      setCurrentStep('credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebAuthnAuthentication = async () => {
    if (!userId || !webauthnSupported) {
      toast.error('WebAuthn not available');
      return;
    }

    setIsLoading(true);
    try {
      // Get stored credentials
      const { data: profile } = await supabase
        .from('profiles')
        .select('webauthn_credentials')
        .eq('id', userId)
        .single();

      const credentials = profile?.webauthn_credentials;
      if (!credentials || !Array.isArray(credentials) || credentials.length === 0) {
        toast.error('No WebAuthn credentials found');
        return;
      }

      // Generate assertion options
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge: new TextEncoder().encode(`auth-challenge-${Date.now()}-${userId}`),
        allowCredentials: credentials.map((cred: any) => ({
          id: new Uint8Array(cred.rawId),
          type: 'public-key'
        })),
        timeout: 60000,
        userVerification: 'preferred'
      };

      // Get the assertion
      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      }) as PublicKeyCredential;

      if (!assertion) {
        throw new Error('WebAuthn authentication failed');
      }

      // Verify the assertion (basic client-side verification)
      const authResponse = assertion.response as AuthenticatorAssertionResponse;
      const clientDataJSON = JSON.parse(new TextDecoder().decode(authResponse.clientDataJSON));
      
      // Basic validation
      if (clientDataJSON.type !== 'webauthn.get') {
        throw new Error('Invalid WebAuthn response type');
      }

      // Complete login
      setCurrentStep('success');
      toast.success('WebAuthn authentication successful!');
      setTimeout(() => onSuccess(), 1000);

    } catch (error: any) {
      console.error('WebAuthn authentication failed:', error);
      
      let errorMessage = 'WebAuthn authentication failed';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Authentication was cancelled or timed out';
      } else if (error.name === 'InvalidStateError') {
        errorMessage = 'Invalid authenticator state';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      
      // Allow retry or fallback to logout
      setCurrentStep('credentials');
      await supabase.auth.signOut();
      setUserId(null);
      setWebauthnRequired(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  const handleCancel = async () => {
    if (currentStep === 'webauthn') {
      // Sign out and reset form
      await supabase.auth.signOut();
      setUserId(null);
      setWebauthnRequired(false);
      setCurrentStep('credentials');
      setPassword("");
      toast.info('Login cancelled. Please start over.');
    }
  };

  // Loading state
  if (isLoading && currentStep === 'success') {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {currentStep === 'credentials' && 'Secure Admin Access'}
            {currentStep === 'webauthn' && 'WebAuthn Authentication'}
            {currentStep === 'success' && 'Login Successful'}
          </CardTitle>
          <CardDescription>
            {currentStep === 'credentials' && 'Enter your admin credentials to continue'}
            {currentStep === 'webauthn' && 'Complete second-factor authentication'}
            {currentStep === 'success' && 'Redirecting to admin dashboard...'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Step 1: Password Authentication */}
          {currentStep === 'credentials' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleBackToHome}
                disabled={isLoading}
              >
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </form>
          )}

          {/* Step 2: WebAuthn Authentication */}
          {currentStep === 'webauthn' && (
            <div className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Enhanced security enabled. Please authenticate with your registered device.
                </AlertDescription>
              </Alert>

              {/* Show registered authenticator types */}
              {registeredTypes.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Available Authentication Methods:</Label>
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

              <Separator />

              {!webauthnSupported ? (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    WebAuthn is not supported on this browser. Please use a modern browser or contact your administrator.
                  </AlertDescription>
                </Alert>
              ) : (
                <Button
                  onClick={handleWebAuthnAuthentication}
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Authenticate with WebAuthn
                    </>
                  )}
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel & Start Over
              </Button>
            </div>
          )}

          {/* Step 3: Success */}
          {currentStep === 'success' && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground">
                Authentication complete. Redirecting to admin dashboard...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecureAdminLoginWithWebAuthn;