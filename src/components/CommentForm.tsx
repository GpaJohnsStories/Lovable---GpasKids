
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
import { getOrSetPersonalId } from "@/utils/personalId";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const formSchema = z.object({
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
  const [personalId] = useState(getOrSetPersonalId());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      content: "",
      author_email: "",
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (newComment: { subject: string; content: string; author_email?: string }) => {
      const { data, error } = await supabase.from("comments").insert([
        {
          personal_id: personalId,
          subject: newComment.subject,
          content: newComment.content,
          author_email: newComment.author_email || null,
        },
      ]);

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
    addCommentMutation.mutate(values);
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-center text-orange-800 mb-4 font-fun">
        Leave a Comment
      </h2>
      <p className="text-center text-orange-800 font-fun text-lg mb-4">
        Your Personal ID is: <span className="font-bold bg-amber-200 px-2 py-1 rounded">{personalId}</span>. This is how we'll show your comments.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold" disabled={addCommentMutation.isPending}>
            {addCommentMutation.isPending ? "Submitting..." : "Submit Comment"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CommentForm;
