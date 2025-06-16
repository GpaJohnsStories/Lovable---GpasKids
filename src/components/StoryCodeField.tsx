
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StoryCodeFieldProps {
  form: UseFormReturn<any>;
}

const StoryCodeField = ({ form }: StoryCodeFieldProps) => {
  const handleStoryCodeLookup = async () => {
    const storyCode = form.getValues("story_code");
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
        form.setValue("subject", newSubject, { shouldValidate: true });
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

  return (
    <FormField
      control={form.control}
      name="story_code"
      render={({ field }) => (
        <FormItem className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-2">
          <FormLabel className="text-orange-800 font-fun text-lg sm:text-left">Story Code (Optional)</FormLabel>
          <div className="sm:col-span-2">
            <FormControl>
              <Input
                placeholder="e.g., A1B2"
                {...field}
                onBlur={handleStoryCodeLookup}
                className="w-full sm:w-40 text-base md:text-sm"
              />
            </FormControl>
            <p className="text-sm text-orange-700 mt-1 font-fun">
              Commenting on a specific story? Enter its code here.
            </p>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default StoryCodeField;
