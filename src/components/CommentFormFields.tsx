
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getHighlightedParts } from "@/utils/profanity";

interface CommentFormFieldsProps {
  form: UseFormReturn<any>;
}

const CommentFormFields = ({ form }: CommentFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="subject"
        render={({ field }) => (
          <FormItem className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-2">
            <FormLabel className="text-orange-800 font-fun text-lg sm:text-left">Subject</FormLabel>
            <div className="sm:col-span-2">
              <FormControl>
                <div className="relative has-highlighting">
                  <div className="absolute inset-0 px-3 py-2 text-base md:text-sm pointer-events-none whitespace-pre-wrap break-words font-sans bg-transparent text-transparent" style={{ fontFamily: 'Arial, sans-serif', fontStyle: 'normal' }} aria-hidden="true">
                    {getHighlightedParts(field.value).map((part, i) => (
                      <span key={i} className={part.isBad ? 'text-destructive' : 'text-transparent'}>
                        {part.text}
                      </span>
                    ))}
                  </div>
                  <Input placeholder="A short title for your comment" {...field} className="w-full text-base md:text-sm relative z-10 bg-white"/>
                </div>
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2">
            <FormLabel className="text-orange-800 font-fun text-lg sm:text-left">Your Comment or Question</FormLabel>
            <div className="sm:col-span-2">
              <FormControl>
                <div className="relative has-highlighting">
                  <div className="absolute inset-0 px-3 py-2 text-base md:text-sm pointer-events-none whitespace-pre-wrap break-words font-sans bg-transparent text-transparent" style={{ fontFamily: 'Arial, sans-serif', fontStyle: 'normal' }} aria-hidden="true">
                    {getHighlightedParts(field.value).map((part, i) => (
                      <span key={i} className={part.isBad ? 'text-destructive' : 'text-transparent'}>
                        {part.text}
                      </span>
                    ))}
                  </div>
                  <Textarea
                    placeholder="Write your comment or question here"
                    className="resize-y relative z-10 bg-white"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="author_email"
        render={({ field }) => (
          <FormItem className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-2">
            <FormLabel className="text-orange-800 font-fun text-lg sm:text-left">Your grown-up's email</FormLabel>
            <div className="sm:col-span-2">
              <FormControl>
                <Input type="email" placeholder="Your grown-up's email (not shown publicly)" {...field} className="w-full text-base md:text-sm"/>
              </FormControl>
              <p className="text-sm text-orange-700 mt-1 font-fun">
                Email address will NEVER be displayed publicly but will be stored in a secure location and is only accessible by Grandpa John in an emergency.
              </p>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </>
  );
};

export default CommentFormFields;
