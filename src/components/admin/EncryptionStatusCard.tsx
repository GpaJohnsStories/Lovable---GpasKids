import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getEncryptionStatus, initializeEncryption } from "@/utils/encryption";
import { Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const EncryptionStatusCard = () => {
  const [encryptionStatus, setEncryptionStatus] = useState({
    initialized: false,
    browserSupport: false,
    securityLevel: 'low' as 'high' | 'medium' | 'low'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkEncryption = async () => {
      try {
        // Try to initialize encryption
        await initializeEncryption();
        const status = getEncryptionStatus();
        setEncryptionStatus(status);
      } catch (error) {
        console.error('Encryption check failed:', error);
        setEncryptionStatus({
          initialized: false,
          browserSupport: false,
          securityLevel: 'low'
        });
      } finally {
        setLoading(false);
      }
    };

    checkEncryption();
  }, []);

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSecurityIcon = (level: string) => {
    switch (level) {
      case 'high': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <XCircle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Application Encryption Status
          </CardTitle>
          <CardDescription>
            Checking encryption capabilities...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Application Encryption Status
        </CardTitle>
        <CardDescription>
          Client-side encryption for sensitive data protection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Security Level</span>
          <Badge className={`flex items-center gap-1 ${getSecurityLevelColor(encryptionStatus.securityLevel)}`}>
            {getSecurityIcon(encryptionStatus.securityLevel)}
            {encryptionStatus.securityLevel.toUpperCase()}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Browser Support</span>
            <div className="flex items-center gap-1">
              {encryptionStatus.browserSupport ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-medium">Available</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-red-600 font-medium">Unavailable</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>Encryption Service</span>
            <div className="flex items-center gap-1">
              {encryptionStatus.initialized ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-medium">Active</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-red-600 font-medium">Inactive</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>Secure Context</span>
            <div className="flex items-center gap-1">
              {window.isSecureContext ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-medium">HTTPS</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-yellow-600 font-medium">HTTP</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Enhanced Security Features</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>✓ Personal IDs encrypted before database storage</li>
            <li>✓ Comment content encrypted using AES-GCM</li>
            <li>✓ Browser-specific key derivation</li>
            <li>✓ Automatic fallback for unsupported browsers</li>
            <li>✓ Backward compatibility with existing data</li>
          </ul>
        </div>

        {encryptionStatus.securityLevel === 'low' && (
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="text-sm font-medium text-amber-800 mb-2">⚠️ Security Notice</h4>
            <p className="text-xs text-amber-700">
              Encryption is not available in this environment. Data is still protected by Supabase's 
              built-in encryption at rest and secure transmission protocols.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EncryptionStatusCard;