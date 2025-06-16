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
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { containsBadWord, getHighlightedParts } from "@/utils/profanity";

const formSchema = z.object({
  story_code: z.string().optional(),
  personal_id_prefix: z.string().optional(),
  subject: z.string().min(2, {
    message: "Subject must be at least 2 characters.",
  }),
  content: z.string().min(10, {
    message: "Your comment must be at least 10 characters.",
  }),
  author_email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
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
      author_email: "",
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
      handleStoryCodeLookup();
    }
  }, [prefilledStoryCode]);

  const prefix = form.watch("personal_id_prefix");

  useEffect(() => {
    if (personalId && !personalId.startsWith(prefix || '')) {
      setPersonalId(null);
    }
  }, [prefix, personalId]);

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
      setPersonalId(null);
      setExistingPersonalId("");
      setExistingPersonalIdError(null);
      setIdMode("existing");
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
  
  const handleCreateId = () => {
    const currentPrefix = form.getValues("personal_id_prefix") || "";
    form.clearErrors("personal_id_prefix");
    setPersonalId(null); // Reset ID first

    if (containsBadWord(currentPrefix)) {
        form.setError("personal_id_prefix", { type: "manual", message: "Please use kinder words." });
    } else if (currentPrefix.length !== 4 || !/^[a-zA-Z0-9]{4}$/.test(currentPrefix)) {
        form.setError("personal_id_prefix", { type: "manual", message: "Your code must be exactly 4 letters or numbers." });
    } else {
        const suffix = generateIdSuffix();
        setPersonalId(currentPrefix + suffix);
    }
  };

  const handleTabChange = (value: string) => {
    setIdMode(value);
    // Reset state when switching tabs
    if (value === 'existing') {
        setPersonalId(null);
        form.setValue('personal_id_prefix', '');
        form.clearErrors('personal_id_prefix');
    } else {
        setExistingPersonalId('');
        setExistingPersonalIdError(null);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    form.clearErrors();
    setExistingPersonalIdError(null);
    let hasError = false;

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

    if (hasError || !finalPersonalId) {
      return;
    }

    addCommentMutation.mutate({
        personal_id: finalPersonalId,
        subject: values.subject,
        content: values.content,
        author_email: values.author_email,
    });
  }

  const isSubmittable = (idMode === 'existing' && existingPersonalId.length === 6) || (idMode === 'create' && !!personalId);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-center text-orange-800 mb-4 font-fun">
        Leave a Comment
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Tabs value={idMode} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing" className="font-bold bg-green-100 data-[state=active]:bg-green-200">I have an ID</TabsTrigger>
              <TabsTrigger value="create" className="font-bold bg-yellow-100 data-[state=active]:bg-yellow-200">Create New ID</TabsTrigger>
            </TabsList>
            <TabsContent value="existing" className="pt-4">
              <div className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-2">
                <Label className="text-orange-800 font-fun text-lg sm:text-left">Personal ID</Label>
                <div className="sm:col-span-2">
                  <Input
                    placeholder="6-character ID"
                    value={existingPersonalId}
                    onChange={(e) => {
                      setExistingPersonalId(e.target.value);
                      if (existingPersonalIdError) setExistingPersonalIdError(null);
                    }}
                    maxLength={6}
                    className="w-full sm:w-40 text-base md:text-sm"
                  />
                  {existingPersonalIdError && <p className="text-sm font-bold text-destructive mt-2">{existingPersonalIdError}</p>}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="create" className="pt-4">
              <FormField
                control={form.control}
                name="personal_id_prefix"
                render={({ field }) => (
                  <FormItem className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2">
                    <FormLabel className="text-orange-800 font-fun text-lg sm:text-left">Enter any 4 letters or numbers to create your Personal ID</FormLabel>
                    <div className="sm:col-span-2">
                      <div className="flex flex-wrap items-start gap-2">
                        <div className="flex flex-col">
                          <FormControl>
                            <div className="relative has-highlighting">
                              <div className="absolute inset-0 px-3 py-2 text-base md:text-sm pointer-events-none whitespace-pre" aria-hidden="true">
                                {getHighlightedParts(field.value).map((part, i) => (
                                  <span key={i} className={part.isBad ? 'text-destructive' : 'text-foreground'}>
                                    {part.text}
                                  </span>
                                ))}
                              </div>
                              <Input placeholder="4-character code" {...field} maxLength={4} className="w-full sm:w-36 text-base md:text-sm"/>
                            </div>
                          </FormControl>
                          <p className="text-sm text-orange-700 mt-1 font-fun">
                            No bad words please!
                          </p>
                        </div>
                        <Button
                          type="button"
                          onClick={handleCreateId}
                          className="bg-orange-500 hover:bg-orange-600 text-white font-bold"
                        >
                          Click to create your Personal ID
                        </Button>
                      </div>
                      <FormMessage />
                      {personalId && (
                        <div className="!mt-4">
                          <p className="text-orange-800 font-fun text-base">
                            Your Complete Personal ID: <span className="font-bold bg-amber-200 px-2 py-1 rounded">{personalId}</span>
                          </p>
                          <p className="text-sm text-orange-700 !mt-2 font-fun">
                            Make a note of this code! This is how we'll show your comments.
                          </p>
                        </div>
                      )}
                    </div>
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>

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

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-2">
                <FormLabel className="text-orange-800 font-fun text-lg sm:text-left">Subject</FormLabel>
                <div className="sm:col-span-2">
                  <FormControl>
                    <div className="relative has-highlighting">
                      <div className="absolute inset-0 px-3 py-2 text-base md:text-sm pointer-events-none whitespace-pre" aria-hidden="true">
                        {getHighlightedParts(field.value).map((part, i) => (
                          <span key={i} className={part.isBad ? 'text-destructive' : 'text-foreground'}>
                            {part.text}
                          </span>
                        ))}
                      </div>
                      <Input placeholder="A short title for your comment" {...field} className="w-full text-base md:text-sm"/>
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
                <FormLabel className="text-orange-800 font-fun text-lg sm:text-left">Your Comment</FormLabel>
                <div className="sm:col-span-2">
                  <FormControl>
                    <div className="relative has-highlighting">
                      <div className="absolute inset-0 px-3 py-2 text-base md:text-sm pointer-events-none whitespace-pre-wrap break-words" aria-hidden="true">
                        {getHighlightedParts(field.value).map((part, i) => (
                          <span key={i} className={part.isBad ? 'text-destructive' : 'text-foreground'}>
                            {part.text}
                          </span>
                        ))}
                      </div>
                      <Textarea
                        placeholder="Tell us what you think..."
                        className="resize-y"
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
                <FormLabel className="text-orange-800 font-fun text-lg sm:text-left">Email (Optional)</FormLabel>
                <div className="sm:col-span-2">
                  <FormControl>
                    <Input type="email" placeholder="Your grown-up's email (not shown publicly)" {...field} className="w-full text-base md:text-sm"/>
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold" disabled={addCommentMutation.isPending || !isSubmittable}>
            {addCommentMutation.isPending ? "Submitting..." : "Submit Comment"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CommentForm;
