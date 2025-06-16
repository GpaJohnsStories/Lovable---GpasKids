
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
import { generateIdSuffix } from "@/utils/personalId";

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
  const handleCreateId = () => {
    const currentPrefix = form.getValues("personal_id_prefix") || "";
    form.clearErrors("personal_id_prefix");
    setPersonalId(null);

    if (containsBadWord(currentPrefix)) {
      form.setError("personal_id_prefix", { type: "manual", message: "Please use kinder words." });
    } else if (currentPrefix.length !== 4 || !/^[a-zA-Z0-9]{4}$/.test(currentPrefix)) {
      form.setError("personal_id_prefix", { type: "manual", message: "Your code must be exactly 4 letters or numbers." });
    } else {
      const suffix = generateIdSuffix();
      setPersonalId(currentPrefix + suffix);
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
        <div className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-2">
          <Label className="text-orange-800 font-fun text-lg sm:text-left">Personal ID</Label>
          <div className="sm:col-span-2">
            <Input
              placeholder="6-character ID"
              value={existingPersonalId}
              onChange={(e) => {
                setExistingPersonalId(e.target.value);
                if (existingPersonalIdError) setExistingPersonalIdError(null);
              }}
              maxLength={6}
              className="w-full sm:w-40 text-base md:text-sm"
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
                      <div className="relative has-highlighting">
                        <div className="absolute inset-0 px-3 py-2 text-base md:text-sm pointer-events-none whitespace-pre" aria-hidden="true">
                          {getHighlightedParts(field.value).map((part, i) => (
                            <span key={i} className={part.isBad ? 'text-destructive' : 'text-foreground'}>
                              {part.text}
                            </span>
                          ))}
                        </div>
                        <Input placeholder="4-character code" {...field} maxLength={4} className="w-full sm:w-36 text-base md:text-sm"/>
                      </div>
                    </FormControl>
                    <p className="text-sm text-orange-700 mt-1 font-fun">
                      No bad words please!
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleCreateId}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold"
                  >
                    Click to create your Personal ID
                  </Button>
                </div>
                <FormMessage />
                {personalId && (
                  <div className="!mt-4">
                    <p className="text-orange-800 font-fun text-base">
                      Your Complete Personal ID: <span className="font-bold bg-amber-200 px-2 py-1 rounded">{personalId}</span>
                    </p>
                    <p className="text-sm text-orange-700 !mt-2 font-fun">
                      Make a note of this code! This is how we'll show your comments.
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
