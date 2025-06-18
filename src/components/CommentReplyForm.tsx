import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { containsBadWord } from "@/utils/profanity";
import { setPersonalId } from "@/utils/personalId";
import PersonalIdSection from "./PersonalIdSection";
import CommentFormFields from "./CommentFormFields";

const formSchema = z.object({
  personal_id_prefix: z.string().optional(),
  content: z.string().min(10, {
    message: "Your reply must be at least 10 characters.",
  }),
});

interface CommentReplyFormProps {
  parentId: string;
  parentSubject: string;
}

const CommentReplyForm = ({ parentId, parentSubject }: CommentReplyFormProps) => {
  const queryClient = useQueryClient();
  const [personalId, setPersonalId] = useState<string | null>(null);
  const [existingPersonalId, setExistingPersonalId] = useState("");
  const [existingPersonalIdError, setExistingPersonalIdError] = useState<string | null>(null);
  const [idMode, setIdMode] = useState("existing");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personal_id_prefix: "",
      content: "",
    },
  });

  const prefix = form.watch("personal_id_prefix");

  const addReplyMutation = useMutation({
    mutationFn: async (newReply: { personal_id: string; content: string }) => {
      console.log("🚀 Starting reply submission process");
      console.log("📊 Reply data being submitted:", {
        personal_id: newReply.personal_id,
        parent_id: parentId,
        subject: `Re: ${parentSubject}`,
        content_length: newReply.content.length,
        status: 'pending'
      });
      
      const { data, error } = await supabase.from("comments").insert([
        {
          personal_id: newReply.personal_id,
          subject: `Re: ${parentSubject}`,
          content: newReply.content,
          parent_id: parentId,
          status: 'pending' as const
        },
      ]).select();

      if (error) {
        console.error("❌ Error submitting reply:", error);
        throw new Error(`Failed to submit reply: ${error.message}`);
      }
      
      console.log("✅ Reply submitted successfully:", data);
      return data;
    },
    onSuccess: (data) => {
      console.log("🎉 Reply submission successful, invalidating queries");
      
      // Store the personal ID in localStorage for future use
      const finalPersonalId = idMode === 'existing' ? existingPersonalId : personalId;
      if (finalPersonalId) {
        setPersonalId(finalPersonalId);
      }
      
      toast({
        title: "Reply Submitted Successfully!",
        description: "Your reply has been submitted and is awaiting approval by Grandpa John. You won't see your reply until it's approved, which usually takes 1-2 days. Thank you for your patience!",
      });
      form.reset();
      setPersonalId(null);
      setExistingPersonalId("");
      setExistingPersonalIdError(null);
      setIdMode("existing");
      
      // Invalidate queries to refresh the replies list
      queryClient.invalidateQueries({ queryKey: ["comment_replies", parentId] });
      queryClient.invalidateQueries({ queryKey: ["admin_comments"] });
    },
    onError: (error) => {
      console.error("💥 Reply submission failed:", error);
      toast({
        title: "Error submitting reply",
        description: `Please try again. Error: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("🚀 Reply form submission started with values:", values);
    form.clearErrors();
    setExistingPersonalIdError(null);
    let hasError = false;

    // Bad word check
    if (containsBadWord(values.content)) {
      form.setError("content", { type: 'manual', message: 'Please use kinder words in your reply.' });
      hasError = true;
    }

    let finalPersonalId: string | null = null;

    if (idMode === 'existing') {
      if (!/^[a-zA-Z0-9]{6}$/.test(existingPersonalId)) {
        setExistingPersonalIdError("Your Personal ID must be exactly 6 letters or numbers.");
        hasError = true;
      } else {
        finalPersonalId = existingPersonalId;
      }
    } else { // 'create' mode
      const prefixValue = values.personal_id_prefix || '';
      if (containsBadWord(prefixValue)) {
        form.setError("personal_id_prefix", { type: "manual", message: "Please use kinder words." });
        hasError = true;
      } else if (!/^[a-zA-Z0-9]{4}$/.test(prefixValue)) {
        form.setError("personal_id_prefix", { type: "manual", message: "Your code must be exactly 4 letters or numbers." });
        hasError = true;
      } else if (!personalId) {
        form.setError("personal_id_prefix", { type: "manual", message: "Please click the button to create your Personal ID after entering your code." });
        hasError = true;
      } else if (!personalId.startsWith(prefixValue)) {
        form.setError("personal_id_prefix", { type: "manual", message: "The code you entered doesn't match your generated ID. Please create a new one." });
        setPersonalId(null);
        hasError = true;
      } else {
        finalPersonalId = personalId;
      }
    }

    if (hasError || !finalPersonalId) {
      console.log("❌ Reply form validation failed");
      return;
    }

    console.log("✅ Reply form validation passed, submitting reply with personal_id:", finalPersonalId);
    addReplyMutation.mutate({
        personal_id: finalPersonalId,
        content: values.content,
    });
  }

  const isSubmittable = (idMode === 'existing' && existingPersonalId.length === 6) || (idMode === 'create' && !!personalId);

  return (
    <div className="bg-amber-50/50 p-6 rounded-lg border border-orange-200">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <PersonalIdSection
            form={form}
            idMode={idMode}
            setIdMode={setIdMode}
            personalId={personalId}
            setPersonalId={setPersonalId}
            existingPersonalId={existingPersonalId}
            setExistingPersonalId={setExistingPersonalId}
            existingPersonalIdError={existingPersonalIdError}
            setExistingPersonalIdError={setExistingPersonalIdError}
          />

          <CommentFormFields form={form} hideSubject={true} />

          <Button 
            type="submit" 
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold" 
            disabled={addReplyMutation.isPending || !isSubmittable}
          >
            {addReplyMutation.isPending ? "Submitting..." : "Post Reply"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CommentReplyForm;
