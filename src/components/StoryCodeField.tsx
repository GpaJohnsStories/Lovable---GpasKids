import React, { useState } from 'react';
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
}

// Props for controlled component usage
interface ControlledStoryCodeFieldProps {
  control?: never;
  compact?: boolean;
  onCodeLookup?: (storyCode: string) => void;
  onStoryFound?: (story: Story) => void;
  value: string;
  onChange: (value: string) => void;
}

// Union type for props
type StoryCodeFieldProps = FormStoryCodeFieldProps | ControlledStoryCodeFieldProps;

const StoryCodeField: React.FC<StoryCodeFieldProps> = ({ 
  control, 
  compact = false, 
  onCodeLookup,
  onStoryFound,
  value,
  onChange 
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [foundStory, setFoundStory] = useState<Story | null>(null);
  const [currentCode, setCurrentCode] = useState('');
  const { lookupStoryByCode } = useStoryCodeLookup();
  
  const handleStoryCodeLookup = async (storyCode: string) => {
    if (!storyCode?.trim()) return;
    
    const result = await lookupStoryByCode(storyCode, true);
    
    if (result.error) {
      return; // Error was already handled in the hook
    }
    
    if (result.found && result.story) {
      // Story found - show dialog
      setFoundStory(result.story);
      setCurrentCode(storyCode);
      setDialogOpen(true);
    }
    // If not found, do nothing (user can continue with new story)
  };

  const handleEditExisting = () => {
    if (foundStory && onStoryFound) {
      onStoryFound(foundStory);
    }
    setDialogOpen(false);
    setFoundStory(null);
  };

  const handleCreateNew = () => {
    // Clear the story code to let user enter a different one
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
              <FormLabel className="font-fun text-xl sm:text-left" style={{ color: '#F97316' }}>Enter Current or New Unique Story / Webtext Code *</FormLabel>
              <div className="sm:col-span-2">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter story code..."
                    className="w-full px-3 py-2 text-base border rounded-md font-bold"
                    style={{ borderColor: '#F97316' }}
                    onBlur={(e) => {
                      field.onBlur();
                      handleStoryCodeLookup(e.target.value);
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
          storyTitle={foundStory?.title || ''}
          onEditExisting={handleEditExisting}
          onCreateNew={handleCreateNew}
        />
      </>
    );
  }

  // Controlled component rendering
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="story_code" className={`font-bold ${labelSize}`} style={{ color: '#F97316' }}>
          Enter Current or New Unique Story / Webtext Code *
        </Label>
        <Input
          id="story_code"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter story code..."
          className="w-full px-3 py-2 text-base border rounded-md font-bold"
          style={{ borderColor: '#F97316' }}
          onBlur={(e) => {
            handleStoryCodeLookup(e.target.value);
            if (onCodeLookup) {
              onCodeLookup(e.target.value);
            }
          }}
        />
      </div>
      <StoryCodeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        storyCode={currentCode}
        storyTitle={foundStory?.title || ''}
        onEditExisting={handleEditExisting}
        onCreateNew={handleCreateNew}
      />
    </>
  );
};

export default StoryCodeField;