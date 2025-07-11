
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
import { ArrowLeft } from "lucide-react";

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
  
  const handleClearId = () => {
    setPersonalId(null);
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

  return (
    <Tabs value={idMode} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="existing" className="font-bold bg-green-100 data-[state=active]:bg-green-200">I have an ID</TabsTrigger>
        <TabsTrigger value="create" className="font-bold bg-yellow-100 data-[state=active]:bg-yellow-200">Create New ID</TabsTrigger>
      </TabsList>
      <TabsContent value="existing" className="pt-4">
        <div className="flex flex-col gap-2">
          <Label className="text-orange-800 font-fun text-lg">Personal ID</Label>
          <div>
            <Input
              placeholder="6-character ID"
              value={existingPersonalId}
              onChange={(e) => {
                setExistingPersonalId(e.target.value);
                if (existingPersonalIdError) setExistingPersonalIdError(null);
              }}
              maxLength={6}
              className="w-24 text-center font-bold text-base md:text-sm"
            />
            {existingPersonalIdError && <p className="text-sm font-bold text-destructive mt-2">{existingPersonalIdError}</p>}
          </div>
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
                  <div className="mt-4 p-4 bg-amber-50 rounded-lg border-2 border-amber-300">
                    <p className="text-orange-800 font-fun text-lg font-bold mb-2">
                      Your Complete Personal ID:
                    </p>
                    <div className="flex justify-center mb-3">
                      <div className="bg-amber-200 px-3 py-2 rounded-lg">
                        <span className="font-bold text-xl text-orange-900">{personalId}</span>
                      </div>
                    </div>
                    <div className="flex justify-center mb-3">
                      <button
                        type="button"
                        onClick={handleClearId}
                        className="h-9 px-3 rounded-md text-sm font-bold inline-flex items-center justify-center gap-2"
                        style={{ 
                          backgroundColor: '#DC143C',
                          color: '#FFFF00',
                          border: '1px solid #DC143C'
                        }}
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Clear
                      </button>
                    </div>
                    <p className="text-sm text-orange-700 font-fun">
                      Make a note of this code! This is your secure 6-character Personal ID (4 chars + random letter + check digit).
                    </p>
                    <p className="text-sm text-orange-600 mt-2 font-fun font-bold">
                      Please clear this ID from the screen after you've written it down safely.
                    </p>
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
