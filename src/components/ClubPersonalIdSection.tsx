import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { containsBadWord } from '@/utils/profanity';
import { generateCompletePersonalId, checkPersonalIdExists } from '@/utils/personalId';
import { Copy, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';

interface ClubPersonalIdSectionProps {
  onPersonalIdGenerated?: (personalId: string) => void;
  showExplanation?: boolean;
  className?: string;
}

const ClubPersonalIdSection: React.FC<ClubPersonalIdSectionProps> = ({
  onPersonalIdGenerated,
  showExplanation = false,
  className = ''
}) => {
  const [idMode, setIdMode] = useState('existing');
  const [personalId, setPersonalId] = useState<string | null>(null);
  const [existingPersonalId, setExistingPersonalId] = useState('');
  const [existingPersonalIdError, setExistingPersonalIdError] = useState<string | null>(null);
  const [prefixCode, setPrefixCode] = useState('');
  const [prefixError, setPrefixError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const handleTabChange = (value: string) => {
    setIdMode(value);
    if (value === 'existing') {
      setPersonalId(null);
      setPrefixCode('');
      setPrefixError(null);
    } else {
      setExistingPersonalId('');
      setExistingPersonalIdError(null);
    }
  };

  const validateExistingPersonalId = async (value: string) => {
    if (!value) {
      setExistingPersonalIdError(null);
      return;
    }
    
    if (value.length !== 6) {
      setExistingPersonalIdError("Personal ID must be exactly 6 characters.");
      return;
    }
    
    if (!/^[a-zA-Z0-9]{6}$/.test(value)) {
      setExistingPersonalIdError("Personal ID can only contain letters and numbers.");
      return;
    }
    
    setIsValidating(true);
    try {
      const exists = await checkPersonalIdExists(value);
      
      if (!exists) {
        setExistingPersonalIdError("Personal ID not found. Please check your ID or create a new one.");
      } else {
        setExistingPersonalIdError(null);
        onPersonalIdGenerated?.(value.toUpperCase());
      }
    } catch (error) {
      console.error("Error validating Personal ID:", error);
      setExistingPersonalIdError("Error checking Personal ID. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleCreateId = async () => {
    setPrefixError(null);
    setPersonalId(null);

    if (containsBadWord(prefixCode)) {
      setPrefixError("Please use kinder words.");
    } else if (prefixCode.length !== 4 || !/^[a-zA-Z0-9]{4}$/.test(prefixCode)) {
      setPrefixError("Your code must be exactly 4 letters or numbers.");
    } else {
      setIsGenerating(true);
      try {
        const completeId = await generateCompletePersonalId(prefixCode);
        if (completeId) {
          setPersonalId(completeId);
          onPersonalIdGenerated?.(completeId);
          toast.success("Personal ID created successfully! Please copy and save it now - you cannot recover it if lost!");
        } else {
          setPrefixError("Unable to generate a unique ID. Please try a different code.");
        }
      } catch (error) {
        console.error('Error generating Personal ID:', error);
        setPrefixError("Error generating ID. Please try again.");
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const copyToClipboard = async () => {
    if (personalId) {
      try {
        await navigator.clipboard.writeText(personalId);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
        toast.success("Personal ID copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy to clipboard");
      }
    }
  };

  const handleClearId = () => {
    setPersonalId(null);
    setShowCopied(false);
    toast.success("Personal ID cleared");
  };

  return (
    <div className={className}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Your Personal ID
        </h3>
        {showExplanation && (
          <p className="text-sm text-gray-600">
            A Personal ID helps keep your comments safe and private. You can create a new one or use an existing one.
          </p>
        )}
      </div>

      <Tabs value={idMode} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="existing" className="font-bold">I have an ID</TabsTrigger>
          <TabsTrigger value="create" className="font-bold">Create New ID</TabsTrigger>
        </TabsList>
        
        <TabsContent value="existing" className="pt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="existing-id" className="text-sm font-medium text-gray-700">
                Enter your 6-character Personal ID
              </Label>
              <Input
                id="existing-id"
                placeholder="ABC123"
                value={existingPersonalId}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  setExistingPersonalId(value);
                  if (existingPersonalIdError) setExistingPersonalIdError(null);
                }}
                onBlur={(e) => {
                  validateExistingPersonalId(e.target.value.toUpperCase());
                }}
                maxLength={6}
                className="mt-1 text-center font-mono text-lg"
                disabled={isValidating}
              />
              {isValidating && (
                <p className="text-sm text-blue-600 mt-1">Checking Personal ID...</p>
              )}
              {existingPersonalIdError && (
                <p className="text-sm text-red-600 mt-1">{existingPersonalIdError}</p>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="create" className="pt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="prefix-code" className="text-sm font-medium text-gray-700">
                Enter any 4 letters or numbers
              </Label>
              <Input
                id="prefix-code"
                placeholder="ABCD"
                value={prefixCode}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  setPrefixCode(value);
                  if (prefixError) setPrefixError(null);
                }}
                maxLength={4}
                className="mt-1 text-center font-mono text-lg"
                disabled={isGenerating}
              />
              <p className="text-xs text-gray-500 mt-1">
                No bad words please! We'll add 2 more characters to make it unique.
              </p>
              {prefixError && (
                <p className="text-sm text-red-600 mt-1">{prefixError}</p>
              )}
            </div>

            <Button
              onClick={handleCreateId}
              disabled={isGenerating || prefixCode.length !== 4}
              className="w-full"
            >
              {isGenerating ? "Creating..." : "Create Personal ID"}
            </Button>

            {personalId && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-green-700 font-medium">Your Personal ID:</p>
                    <p className="text-xl font-mono font-bold text-green-800">{personalId}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="flex items-center gap-1"
                  >
                    {showCopied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {showCopied ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <p className="text-amber-700 text-sm mb-3 bg-amber-50 p-2 rounded border">
                  ⚠️ <strong>IMPORTANT:</strong> Write this down somewhere safe! This is the ONLY way to identify your comments. We cannot recover it if lost.
                </p>
                <p className="text-blue-700 text-xs mb-3">
                  💡 When viewing comments, only the first 4 characters will be shown (like {personalId.substring(0, 4)}**) to protect your privacy.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearId}
                  className="mt-2"
                >
                  Clear & Create New
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClubPersonalIdSection;