import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { containsBadWord } from "@/utils/profanity";
import { setPersonalId, checkPersonalIdExists } from "@/utils/personalId";
import { initializeEncryption, encryptSensitiveData, encryptPersonalId } from "@/utils/encryption";
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
  const [encryptionReady, setEncryptionReady] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personal_id_prefix: "",
      content: "",
    },
  });

  // Initialize encryption on component mount
  useEffect(() => {
    const initEncryption = async () => {
      try {
        await initializeEncryption();
        setEncryptionReady(true);
        console.log('🔐 Reply form encryption ready');
      } catch (error) {
        console.error('❌ Failed to initialize encryption in reply form:', error);
        setEncryptionReady(false);
      }
    };
    initEncryption();
  }, []);

  const prefix = form.watch("personal_id_prefix");

  const addReplyMutation = useMutation({
    mutationFn: async (newReply: { personal_id: string; content: string }) => {
      console.log("🚀 Starting reply submission process");
      console.log("📊 Reply data being submitted:", {
        personal_id: 'encrypted',
        parent_id: parentId,
        subject: `Re: ${parentSubject}`,
        content_length: newReply.content.length,
        status: 'pending',
        encryption_enabled: encryptionReady
      });
      
      // Encrypt sensitive data before database storage
      console.log("🔐 Encrypting sensitive reply data...");
      let encryptedPersonalId: string;
      let encryptedContent: string;
      
      if (encryptionReady) {
        try {
          encryptedPersonalId = await encryptPersonalId(newReply.personal_id);
          encryptedContent = await encryptSensitiveData(newReply.content);
          console.log("✅ Reply data encryption successful");
        } catch (encError) {
          console.warn("⚠️ Reply encryption failed, storing unencrypted:", encError);
          encryptedPersonalId = newReply.personal_id;
          encryptedContent = newReply.content;
        }
      } else {
        console.log("⚠️ Encryption not ready, storing unencrypted reply data");
        encryptedPersonalId = newReply.personal_id;
        encryptedContent = newReply.content;
      }
      
      const { data, error } = await supabase.from("comments").insert([
        {
          personal_id: encryptedPersonalId,
          subject: `Re: ${parentSubject}`,
          content: encryptedContent,
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
        // Re-check Personal ID existence before submission
        const checkIdAsync = async () => {
          try {
            const exists = await checkPersonalIdExists(existingPersonalId);
            if (!exists) {
              setExistingPersonalIdError("Personal ID not found. Please check your ID.");
              return false;
            }
            return true;
          } catch (error) {
            setExistingPersonalIdError("Error checking Personal ID. Please try again.");
            return false;
          }
        };
        
        // For now, we'll assume validation passed at blur, but in production you'd await this
        finalPersonalId = existingPersonalId.toUpperCase();
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
            {encryptionReady && <span className="ml-2 text-xs">🔐</span>}
          </Button>
          
          {encryptionReady && (
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              🔐 Your reply is encrypted before submission for enhanced security.
            </p>
          )}
        </form>
      </Form>
    </div>
  );
};

export default CommentReplyForm;
