import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { containsBadWord, getHighlightedParts } from "@/utils/profanity";
import { generateCompletePersonalId } from "@/utils/personalId";
import { ArrowLeft, Copy, CheckCheck } from "lucide-react";
import { toast } from "sonner";

interface PersonalIdSectionProps {
  form: UseFormReturn<any>;
  idMode: string;
  setIdMode: (mode: string) => void;
  personalId: string | null;
  setPersonalId: (id: string | null) => void;
  existingPersonalId: string;
  setExistingPersonalId: (id: string) => void;
  existingPersonalIdError: string | null;
  setExistingPersonalIdError: (error: string | null) => void;
}

const PersonalIdSection = ({
  form,
  idMode,
  setIdMode,
  personalId,
  setPersonalId,
  existingPersonalId,
  setExistingPersonalId,
  existingPersonalIdError,
  setExistingPersonalIdError,
}: PersonalIdSectionProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  
  const handleClearId = () => {
    setPersonalId(null);
    setShowCopied(false);
    form.setValue("personalId", "");
    toast.success("Personal ID cleared");
  };
  
  const handleCreateId = async () => {
    const currentPrefix = form.getValues("personal_id_prefix") || "";
    form.clearErrors("personal_id_prefix");
    setPersonalId(null);

    if (containsBadWord(currentPrefix)) {
      form.setError("personal_id_prefix", { type: "manual", message: "Please use kinder words." });
    } else if (currentPrefix.length !== 4 || !/^[a-zA-Z0-9]{4}$/.test(currentPrefix)) {
      form.setError("personal_id_prefix", { type: "manual", message: "Your code must be exactly 4 letters or numbers." });
    } else {
      setIsGenerating(true);
      try {
        const completeId = await generateCompletePersonalId(currentPrefix);
        if (completeId) {
          setPersonalId(completeId);
          form.setValue("personalId", completeId);
          toast.success("Personal ID created successfully! Please copy and save it now - you cannot recover it if lost!");
        } else {
          form.setError("personal_id_prefix", { 
            type: "manual", 
            message: "Unable to generate a unique ID. Please try a different code." 
          });
        }
      } catch (error) {
        console.error('Error generating Personal ID:', error);
        form.setError("personal_id_prefix", { 
          type: "manual", 
          message: "Error generating ID. Please try again." 
        });
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleTabChange = (value: string) => {
    setIdMode(value);
    if (value === 'existing') {
      setPersonalId(null);
      form.setValue('personal_id_prefix', '');
      form.clearErrors('personal_id_prefix');
    } else {
      setExistingPersonalId('');
      setExistingPersonalIdError(null);
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

  const [isValidating, setIsValidating] = useState(false);

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
    
    // Check if ID exists in database
    setIsValidating(true);
    try {
      const { checkPersonalIdExists } = await import("@/utils/personalId");
      const exists = await checkPersonalIdExists(value);
      
      if (!exists) {
        setExistingPersonalIdError("Personal ID not found. Please check your ID or create a new one.");
      } else {
        setExistingPersonalIdError(null);
      }
    } catch (error) {
      console.error("Error validating Personal ID:", error);
      setExistingPersonalIdError("Error checking Personal ID. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Tabs value={idMode} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="existing" className="font-bold bg-green-100 data-[state=active]:bg-green-200">I have an ID</TabsTrigger>
        <TabsTrigger value="create" className="font-bold bg-yellow-100 data-[state=active]:bg-yellow-200">Create New ID</TabsTrigger>
      </TabsList>
      <TabsContent value="existing" className="pt-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Label className="text-orange-800 font-fun text-lg">Personal ID</Label>
            <Input
              placeholder="6-character ID"
              value={existingPersonalId}
              onChange={(e) => {
                const value = e.target.value;
                setExistingPersonalId(value);
                if (existingPersonalIdError) setExistingPersonalIdError(null);
              }}
              onBlur={(e) => {
                validateExistingPersonalId(e.target.value.toUpperCase());
              }}
              maxLength={6}
              className="w-36 text-center font-bold text-base md:text-sm"
            />
          </div>
          {isValidating && (
            <p className="text-sm text-blue-600 mt-1">Checking Personal ID...</p>
          )}
          {existingPersonalIdError && <p className="text-sm font-bold text-destructive mt-2">{existingPersonalIdError}</p>}
        </div>
      </TabsContent>
      <TabsContent value="create" className="pt-4">
        <FormField
          control={form.control}
          name="personal_id_prefix"
          render={({ field }) => (
            <FormItem className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2">
              <FormLabel className="text-orange-800 font-fun text-lg sm:text-left">Enter any 4 letters or numbers to create your Personal ID</FormLabel>
              <div className="sm:col-span-2">
                <div className="flex flex-wrap items-start gap-2">
                  <div className="flex flex-col">
                    <FormControl>
                      <Input 
                        placeholder="4-character code" 
                        {...field} 
                        maxLength={4} 
                        className="w-full sm:w-36 text-base md:text-sm"
                      />
                    </FormControl>
                    <p className="text-sm text-orange-700 mt-1 font-fun">
                      No bad words please!
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleCreateId}
                    disabled={isGenerating}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold disabled:opacity-50"
                  >
                    {isGenerating ? "Generating..." : "Click to create your Personal ID"}
                  </Button>
                </div>
                <FormMessage />
                {personalId && (
                  <div className="mt-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-green-800 font-medium">
                        ✅ Your Personal ID: <span className="font-mono font-bold text-lg">{personalId}</span>
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="flex items-center gap-1"
                      >
                        {showCopied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {showCopied ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <p className="text-amber-700 font-medium text-sm mb-3 bg-amber-50 p-2 rounded border">
                      ⚠️ <strong>IMPORTANT:</strong> Write this down somewhere safe! This is the ONLY way to view your comments and replies. We cannot recover it if lost.
                    </p>
                    <p className="text-blue-700 text-sm mb-3">
                      💡 From now on, only the first 4 characters will be shown publicly (like {personalId.substring(0, 4)}**) to protect your privacy.
                    </p>
                    <Button
                      type="button"
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
            </FormItem>
          )}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PersonalIdSection;