import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { publicClient, logDatabaseOperation } from "@/integrations/supabase/clients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { containsBadWord } from "@/utils/profanity";
import { setPersonalId } from "@/utils/personalId";

import { detectXssAttempt, logSecurityIncident, sanitizeCommentContent, sanitizeCommentSubject } from "@/utils/xssProtection";
import PersonalIdSection from "./PersonalIdSection";
import StoryCodeField from "./StoryCodeField";
import CommentFormFields from "./CommentFormFields";

const formSchema = z.object({
  story_code: z.string().optional(),
  personal_id_prefix: z.string().optional(),
  subject: z.string().min(2, {
    message: "Subject must be at least 2 characters.",
  }),
  content: z.string().min(10, {
    message: "Your comment must be at least 10 characters.",
  }),
});

interface CommentFormProps {
  prefilledSubject?: string;
  prefilledStoryCode?: string;
}

const CommentForm = ({ prefilledSubject = "", prefilledStoryCode = "" }: CommentFormProps) => {
  const queryClient = useQueryClient();
  const [personalId, setPersonalId] = useState<string | null>(null);
  const [existingPersonalId, setExistingPersonalId] = useState("");
  const [existingPersonalIdError, setExistingPersonalIdError] = useState<string | null>(null);
  const [idMode, setIdMode] = useState("existing");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      story_code: prefilledStoryCode,
      personal_id_prefix: "",
      subject: prefilledSubject,
      content: "",
    },
  });

  // Update subject when prefilledSubject changes
  useEffect(() => {
    if (prefilledSubject) {
      form.setValue("subject", prefilledSubject);
    }
  }, [prefilledSubject, form]);

  // Auto-lookup story when prefilledStoryCode is provided
  useEffect(() => {
    if (prefilledStoryCode) {
      form.setValue("story_code", prefilledStoryCode);
      setTimeout(() => {
        handleStoryCodeLookup();
      }, 100);
    }
  }, [prefilledStoryCode]);

  const prefix = form.watch("personal_id_prefix");

  useEffect(() => {
    if (personalId && !personalId.startsWith(prefix || '')) {
      setPersonalId(null);
    }
  }, [prefix, personalId]);

  const addCommentMutation = useMutation({
    mutationFn: async (newComment: { personal_id: string; subject: string; content: string }) => {
      console.log("🚀 Starting comment submission process");
      console.log("📊 Comment data being submitted:", {
        personal_id: newComment.personal_id,
        subject: newComment.subject,
        content_length: newComment.content.length,
        status: 'pending'
      });
      
      // Test database connection first with detailed logging
      console.log("🔍 Testing database connection...");
      await logDatabaseOperation('connection_test', 'comments', 'public');
      try {
        const { data: testData, error: testError } = await publicClient
          .from("comments")
          .select("count")
          .limit(1);
          
        console.log("📊 Database connection test result:", {
          success: !testError,
          data: testData,
          error: testError
        });
        
        if (testError) {
          console.error("❌ Database connection test failed:", testError);
          throw new Error(`Database connection failed: ${testError.message}`);
        }
        
        console.log("✅ Database connection successful");
      } catch (connError) {
        console.error("💥 Database connection error:", connError);
        throw connError;
      }

      // Now attempt the insert with detailed logging
      console.log("📝 Attempting to insert comment into database...");
      const insertPayload = {
        personal_id: newComment.personal_id,
        subject: newComment.subject,
        content: newComment.content,
        status: 'pending' as const
      };
      console.log("📝 Insert payload prepared");
      
      await logDatabaseOperation('insert', 'comments', 'public', insertPayload);
      
      try {
        const { data, error } = await publicClient.from("comments").insert([insertPayload]).select();

        console.log("📊 Insert operation result:", {
          success: !error,
          data: data,
          error: error
        });

        if (error) {
          console.error("❌ Error submitting comment:", error);
          console.error("❌ Error details:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw new Error(`Failed to submit comment: ${error.message}`);
        }
        
        console.log("✅ Comment submitted successfully:", data);
        return data;
      } catch (insertError) {
        console.error("💥 Insert operation failed:", insertError);
        throw insertError;
      }
    },
    onSuccess: (data) => {
      console.log("🎉 Comment submission successful, invalidating queries");
      
      // Store the personal ID in localStorage for future use
      const finalPersonalId = idMode === 'existing' ? existingPersonalId : personalId;
      if (finalPersonalId) {
        setPersonalId(finalPersonalId);
      }
      
      toast({
        title: "Comment Submitted Successfully!",
        description: "Your comment has been submitted and is awaiting approval by Grandpa John. You won't see your comment in the list until it's approved, which usually takes 1-2 days. Thank you for your patience!",
      });
      form.reset();
      setPersonalId(null);
      setExistingPersonalId("");
      setExistingPersonalIdError(null);
      setIdMode("existing");
      
      // Invalidate both public and admin comment queries
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["admin_comments"] });
    },
    onError: (error) => {
      console.error("💥 Comment submission failed:", error);
      toast({
        title: "Error submitting comment",
        description: `Please try again. Error: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleStoryCodeLookup = async () => {
    const storyCode = form.getValues("story_code");
    if (!storyCode || storyCode.trim() === "") {
      return;
    }

    try {
      await logDatabaseOperation('select', 'stories', 'public', { story_code: storyCode.trim() });
      const { data: story, error } = await publicClient
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("🚀 Form submission started with values:", values);
    form.clearErrors();
    setExistingPersonalIdError(null);
    let hasError = false;

    // XSS Protection checks
    if (detectXssAttempt(values.subject)) {
      logSecurityIncident('xss_attempt_subject', values.subject);
      form.setError("subject", { type: 'manual', message: 'Invalid characters detected in subject.' });
      hasError = true;
    }
    if (detectXssAttempt(values.content)) {
      logSecurityIncident('xss_attempt_content', values.content);
      form.setError("content", { type: 'manual', message: 'Invalid characters detected in content.' });
      hasError = true;
    }

    // Bad word checks
    if (containsBadWord(values.subject)) {
      form.setError("subject", { type: 'manual', message: 'Please use kinder words in the subject.' });
      hasError = true;
    }
    if (containsBadWord(values.content)) {
      form.setError("content", { type: 'manual', message: 'Please use kinder words in your comment.' });
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

    console.log("📊 Form validation result:", {
      hasError,
      finalPersonalId,
      idMode,
      existingPersonalId,
      personalId
    });

    if (hasError || !finalPersonalId) {
      console.log("❌ Form validation failed");
      return;
    }

    console.log("✅ Form validation passed, submitting comment with personal_id:", finalPersonalId);
    
    // Sanitize data before submission
    const sanitizedData = {
      personal_id: finalPersonalId,
      subject: sanitizeCommentSubject(values.subject),
      content: sanitizeCommentContent(values.content),
    };
    
    addCommentMutation.mutate(sanitizedData);
  }

  const isSubmittable = (idMode === 'existing' && existingPersonalId.length === 6) || (idMode === 'create' && !!personalId);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-center text-orange-800 mb-4 font-fun">
        Leave a Comment or Question
      </h2>
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

          <StoryCodeField form={form} />

          <CommentFormFields form={form} />

          <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold" disabled={addCommentMutation.isPending || !isSubmittable}>
            {addCommentMutation.isPending ? "Submitting..." : "Submit Comment"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CommentForm;
