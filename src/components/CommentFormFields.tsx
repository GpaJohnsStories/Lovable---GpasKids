
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface CommentFormFieldsProps {
  form: UseFormReturn<any>;
  hideSubject?: boolean;
}

const CommentFormFields = ({ form, hideSubject = false }: CommentFormFieldsProps) => {
  return (
    <>
      {!hideSubject && (
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-orange-800 font-fun text-xl">
                Subject
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="What would you like to talk about?" 
                  {...field} 
                  className="font-fun text-xl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-orange-800 font-fun text-xl">
              {hideSubject ? "Your Reply" : "Your Comment"}
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder={hideSubject ? "Share your thoughts on this comment..." : "Share your thoughts, ask a question, or tell us about your experience..."}
                className="min-h-[120px] font-fun text-xl"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default CommentFormFields;
