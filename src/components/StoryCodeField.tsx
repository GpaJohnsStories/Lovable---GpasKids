
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Props for React Hook Form usage
interface FormStoryCodeFieldProps {
  form: UseFormReturn<any>;
}

// Props for controlled component usage
interface ControlledStoryCodeFieldProps {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}

type StoryCodeFieldProps = FormStoryCodeFieldProps | ControlledStoryCodeFieldProps;

const StoryCodeField = (props: StoryCodeFieldProps) => {
  // Check if this is a form-based usage
  const isFormBased = 'form' in props;

  const handleStoryCodeLookup = async (storyCode: string) => {
    if (!storyCode || storyCode.trim() === "") {
      return;
    }

    try {
      const { data: story, error } = await supabase
        .from("stories")
        .select("title")
        .ilike("story_code", storyCode.trim())
        .maybeSingle();

      if (error) {
        toast({
          title: "Error looking up story",
          description: "Could not fetch story details. Please check the code.",
          variant: "destructive",
        });
        console.error("Error fetching story:", error);
        return;
      }

      if (story && story.title) {
        const newSubject = `${storyCode.trim()} - ${story.title}`;
        if (isFormBased) {
          props.form.setValue("subject", newSubject, { shouldValidate: true });
        }
        toast({
          title: "Story Found!",
          description: `Subject has been filled with "${newSubject}".`,
        });
      } else {
        toast({
          title: "Story Not Found",
          description: "We couldn't find a story with that code. Please check and try again.",
        });
      }
    } catch (error) {
      console.error("An unexpected error occurred during story lookup:", error);
      toast({
        title: "An unexpected error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Render for React Hook Form usage
  if (isFormBased) {
    return (
      <FormField
        control={props.form.control}
        name="story_code"
        render={({ field }) => (
           <FormItem className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-2">
            <FormLabel className="font-fun text-xl sm:text-left" style={{ color: '#F97316' }}>Enter Current or New Unique Story / Webtext Code</FormLabel>
            <div className="sm:col-span-2">
              <FormControl>
                <Input
                  placeholder="e.g., A1B2"
                  {...field}
                  onBlur={() => handleStoryCodeLookup(field.value)}
                  className="w-full sm:w-40 text-xl font-bold"
                  style={{ color: '#2563eb' }}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    );
  }

  // Render for controlled component usage
  const { value, onChange, compact = false } = props as ControlledStoryCodeFieldProps;
  const labelSize = compact ? "text-lg" : "text-xl";

  return (
    <div className="space-y-2">
      <Label htmlFor="story_code" className={`font-bold ${labelSize}`} style={{ color: '#F97316' }}>
        Enter Current or New Unique Story / Webtext Code
      </Label>
      <Input
        id="story_code"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => handleStoryCodeLookup(value)}
        placeholder="e.g., A1B2"
        className={`${labelSize} font-bold`}
        style={{ color: '#2563eb' }}
      />
    </div>
  );
};

export default StoryCodeField;
