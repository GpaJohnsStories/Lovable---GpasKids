import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, CheckCircle, AlertCircle } from "lucide-react";
import { useSupabaseAdminAuth } from "./SupabaseAdminAuth";
import { toast } from "sonner";

const WebAuthnManager = () => {
  const { user, webauthnEnabled, enableWebAuthn, authenticateWithWebAuthn } = useSupabaseAdminAuth();
  const [isEnabling, setIsEnabling] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleEnableWebAuthn = async () => {
    setIsEnabling(true);
    try {
      await enableWebAuthn();
    } catch (error) {
      console.error('Failed to enable WebAuthn:', error);
    } finally {
      setIsEnabling(false);
    }
  };

  const handleTestWebAuthn = async () => {
    setIsAuthenticating(true);
    try {
      const success = await authenticateWithWebAuthn();
      if (success) {
        toast.success('WebAuthn test successful!');
      } else {
        toast.error('WebAuthn test failed');
      }
    } catch (error) {
      console.error('WebAuthn test failed:', error);
    } finally {
      setIsAuthenticating(false);
    }
  };

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
                disabled={isEnabling || !user}
                size="sm"
              >
                {isEnabling ? 'Setting up...' : 'Enable WebAuthn'}
              </Button>
            ) : (
              <Button 
                onClick={handleTestWebAuthn}
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
                Your admin account is protected with WebAuthn. Future logins may require your security key or biometric verification.
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