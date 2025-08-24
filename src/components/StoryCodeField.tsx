import React, { useState, useCallback, useRef } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Control } from "react-hook-form";
import { useStoryCodeLookup } from "@/hooks/useStoryCodeLookup";
import { StoryCodeDialog } from "@/components/StoryCodeDialog";
import type { Story } from "@/hooks/useStoryFormState";

// Props for form-based usage (React Hook Form)
interface FormStoryCodeFieldProps {
  control: Control<any>;
  compact?: boolean;
  onCodeLookup?: never;
  onStoryFound?: never;
  value?: never;
  onChange?: never;
  currentStoryId?: string;
}

// Props for controlled component usage
interface ControlledStoryCodeFieldProps {
  control?: never;
  compact?: boolean;
  onCodeLookup?: (storyCode: string) => void;
  onStoryFound?: (story: Story) => void;
  value: string;
  onChange: (value: string) => void;
  currentStoryId?: string;
}

// Union type for props
type StoryCodeFieldProps = FormStoryCodeFieldProps | ControlledStoryCodeFieldProps;

const StoryCodeField: React.FC<StoryCodeFieldProps> = ({ 
  control, 
  compact = false, 
  onCodeLookup,
  onStoryFound,
  value,
  onChange,
  currentStoryId
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [foundStory, setFoundStory] = useState<Story | null>(null);
  const [currentCode, setCurrentCode] = useState('');
  const [lastLookupCode, setLastLookupCode] = useState(''); // Track last looked up code
  const { lookupStoryByCode } = useStoryCodeLookup();
  
  const handleStoryCodeLookup = useCallback(async (storyCode: string) => {
    if (!storyCode?.trim()) return;
    
    // Prevent duplicate lookups for the same code
    if (storyCode === lastLookupCode) {
      console.log('Skipping duplicate lookup for code:', storyCode);
      return;
    }
    
    setLastLookupCode(storyCode);
    console.log('Looking up story code:', storyCode);
    const result = await lookupStoryByCode(storyCode, true);
    
    if (result.error) {
      return; // Error was already handled in the hook
    }
    
    if (result.found && result.story) {
      // Skip dialog if the found story is the current story being edited
      if (currentStoryId && result.story.id === currentStoryId) {
        console.log('Found story is the current story being edited, skipping dialog');
        return;
      }
      
      console.log('Story found, opening dialog');
      setFoundStory(result.story);
      setCurrentCode(storyCode);
      setDialogOpen(true);
    } else {
      console.log('No story found, opening not-found dialog');
      setFoundStory(null);
      setCurrentCode(storyCode);
      setDialogOpen(true);
    }
  }, [lookupStoryByCode, currentStoryId, lastLookupCode]);

  const handleEditExisting = () => {
    if (foundStory && onStoryFound) {
      onStoryFound(foundStory);
    }
    setDialogOpen(false);
    setFoundStory(null);
  };

  const handleYes = () => {
    // For new content - just continue with current code and close dialog
    // Reset the last lookup code so future changes can trigger lookups again
    setLastLookupCode('');
    setDialogOpen(false);
    setFoundStory(null);
  };

  const handleNo = () => {
    // Clear the story code and close dialog
    // Reset the last lookup code
    setLastLookupCode('');
    if (onChange) {
      onChange('');
    }
    setDialogOpen(false);
    setFoundStory(null);
  };

  const labelSize = compact ? "text-lg" : "text-xl";

  // Form-based rendering (React Hook Form)
  if (control) {
    return (
      <>
        <FormField
          control={control}
          name="story_code"
          render={({ field }) => (
            <FormItem className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-2">
              <FormLabel className="font-fun text-xl sm:text-left text-orange-accent">Enter Current or New Unique Story / Webtext Code *</FormLabel>
              <div className="sm:col-span-2">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter story code..."
                    className="w-full px-3 py-2 text-base border rounded-md font-bold border-orange-accent border-2"
                    autoComplete="off"
                    onBlur={(e) => {
                      field.onBlur();
                      handleStoryCodeLookup(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleStoryCodeLookup(e.currentTarget.value);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <StoryCodeDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          storyCode={currentCode}
          storyTitle={foundStory?.title}
          mode={foundStory ? 'found' : 'not-found'}
          onEditExisting={handleEditExisting}
          onYes={handleYes}
          onNo={handleNo}
        />
      </>
    );
  }

  // Controlled component rendering
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="story_code" className={`font-bold ${labelSize} text-orange-accent`}>
          Enter Current or New Unique Story / Webtext Code *
        </Label>
        <Input
          id="story_code"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter story code..."
          className="w-full px-3 py-2 text-base border rounded-md font-bold border-orange-accent border-2"
          autoComplete="off"
          onBlur={(e) => {
            handleStoryCodeLookup(e.target.value);
            if (onCodeLookup) {
              onCodeLookup(e.target.value);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleStoryCodeLookup(e.currentTarget.value);
              if (onCodeLookup) {
                onCodeLookup(e.currentTarget.value);
              }
            }
          }}
        />
      </div>
      <StoryCodeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        storyCode={currentCode}
        storyTitle={foundStory?.title}
        mode={foundStory ? 'found' : 'not-found'}
        onEditExisting={handleEditExisting}
        onYes={handleYes}
        onNo={handleNo}
      />
    </>
  );
};

export default StoryCodeField;