import { useState, useEffect } from "react";
import { decryptSensitiveData, decryptPersonalId } from "@/utils/encryption";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DecryptedCommentContentProps {
  content: string;
  personalId: string;
  className?: string;
}

const DecryptedCommentContent = ({ content, personalId, className = "" }: DecryptedCommentContentProps) => {
  const [decryptedContent, setDecryptedContent] = useState<string>("");
  const [decryptedPersonalId, setDecryptedPersonalId] = useState<string>("");
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDecrypted, setShowDecrypted] = useState(false);

  useEffect(() => {
    const decryptData = async () => {
      try {
        // Check if data appears to be encrypted
        const contentEncrypted = content.includes('enc_') || (content.length > 50 && content.match(/^[A-Za-z0-9+/]*={0,2}$/));
        const personalIdEncrypted = personalId.startsWith('enc_');
        
        if (contentEncrypted || personalIdEncrypted) {
          setIsEncrypted(true);
          
          // Attempt to decrypt
          const [decContent, decPersonalId] = await Promise.all([
            decryptSensitiveData(content),
            decryptPersonalId(personalId)
          ]);
          
          setDecryptedContent(decContent);
          setDecryptedPersonalId(decPersonalId);
          setIsDecrypted(true);
        } else {
          // Data is not encrypted
          setDecryptedContent(content);
          setDecryptedPersonalId(personalId);
          setIsEncrypted(false);
          setIsDecrypted(true);
        }
      } catch (error) {
        console.error('Failed to decrypt comment data:', error);
        // Fallback to original data
        setDecryptedContent(content);
        setDecryptedPersonalId(personalId);
        setIsDecrypted(false);
      } finally {
        setLoading(false);
      }
    };

    decryptData();
  }, [content, personalId]);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="text-xs">
          Personal ID: {showDecrypted ? decryptedPersonalId : personalId}
        </Badge>
        
        {isEncrypted && (
          <>
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Encrypted
            </Badge>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDecrypted(!showDecrypted)}
              className="h-6 px-2 text-xs"
            >
              {showDecrypted ? (
                <>
                  <EyeOff className="h-3 w-3 mr-1" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3 mr-1" />
                  Decrypt
                </>
              )}
            </Button>
          </>
        )}
        
        {!isEncrypted && (
          <Badge variant="outline" className="text-xs text-amber-600">
            Unencrypted
          </Badge>
        )}
      </div>
      
      <div className="prose prose-sm max-w-none">
        {showDecrypted || !isEncrypted ? (
          <p className="whitespace-pre-wrap text-sm">{decryptedContent}</p>
        ) : (
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded p-3 text-center">
            <Shield className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Encrypted content - click "Decrypt" to view</p>
          </div>
        )}
      </div>
      
      {isEncrypted && isDecrypted && (
        <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
          <Shield className="h-3 w-3" />
          Content successfully decrypted for admin review
        </div>
      )}
    </div>
  );
};

export default DecryptedCommentContent;