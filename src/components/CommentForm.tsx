
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateIdSuffix } from "@/utils/personalId";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const formSchema = z.object({
  personal_id_prefix: z.string()
    .length(4, { message: "Your code must be exactly 4 characters." })
    .regex(/^[a-zA-Z0-9]{4}$/, { message: "Your code must be 4 letters or numbers." }),
  subject: z.string().min(2, {
    message: "Subject must be at least 2 characters.",
  }),
  content: z.string().min(10, {
    message: "Your comment must be at least 10 characters.",
  }),
  author_email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
});

const CommentForm = () => {
  const queryClient = useQueryClient();
  const [idSuffix, setIdSuffix] = useState('');
  const [personalId, setPersonalId] = useState<string | null>(null);

  useEffect(() => {
    setIdSuffix(generateIdSuffix());
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personal_id_prefix: "",
      subject: "",
      content: "",
      author_email: "",
    },
  });

  const prefix = form.watch("personal_id_prefix");

  useEffect(() => {
    if (prefix && /^[a-zA-Z0-9]{4}$/.test(prefix) && idSuffix) {
      setPersonalId(prefix + idSuffix);
    } else {
      setPersonalId(null);
    }
  }, [prefix, idSuffix]);

  const addCommentMutation = useMutation({
    mutationFn: async (newComment: { personal_id: string; subject: string; content: string; author_email?: string }) => {
      const { data, error } = await supabase.from("comments").insert([
        {
          personal_id: newComment.personal_id,
          subject: newComment.subject,
          content: newComment.content,
          author_email: newComment.author_email || null,
        },
      ] as any);

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your comment has been submitted and is awaiting approval.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error) => {
      toast({
        title: "Error submitting comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!personalId) {
        form.setError("personal_id_prefix", { type: "manual", message: "A valid 4 character code is required." });
        return;
    }
    addCommentMutation.mutate({
        personal_id: personalId,
        subject: values.subject,
        content: values.content,
        author_email: values.author_email,
    });
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-center text-orange-800 mb-4 font-fun">
        Leave a Comment
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="personal_id_prefix"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-orange-800 font-fun text-lg">Create Your Personal ID</FormLabel>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                  <FormControl>
                    <Input placeholder="4 letters or numbers" {...field} maxLength={4} className="w-full sm:w-48 text-base md:text-sm"/>
                  </FormControl>
                  {personalId && (
                    <div className="mt-2 sm:mt-0">
                      <p className="text-orange-800 font-fun text-base">
                        Your Complete Personal ID: <span className="font-bold bg-amber-200 px-2 py-1 rounded">{personalId}</span>
                      </p>
                    </div>
                  )}
                </div>
                 {personalId && (
                    <p className="text-sm text-orange-700 !mt-2 font-fun">
                      Make a note of this code! This is how we'll show your comments.
                    </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-orange-800 font-fun text-lg">Subject</FormLabel>
                <FormControl>
                  <Input placeholder="A short title for your comment" {...field} className="text-base md:text-sm"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-orange-800 font-fun text-lg">Your Comment</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us what you think..."
                    className="resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="author_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-orange-800 font-fun text-lg">Email (Optional)</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Your grown-up's email (not shown publicly)" {...field} className="text-base md:text-sm"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold" disabled={addCommentMutation.isPending || !personalId}>
            {addCommentMutation.isPending ? "Submitting..." : "Submit Comment"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CommentForm;
