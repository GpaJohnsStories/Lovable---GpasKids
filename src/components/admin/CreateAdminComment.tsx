import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminClient } from "@/integrations/supabase/clients";
import { toast } from "sonner";

interface CreateAdminCommentProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateAdminComment = ({ isOpen, onClose }: CreateAdminCommentProps) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: async (commentData: { subject: string; content: string }) => {
      const { data, error } = await adminClient
        .from("comments")
        .insert({
          personal_id: "0000FF", // GpaJohn's official admin ID
          subject: commentData.subject,
          content: commentData.content,
          status: "approved" // Admin comments are auto-approved
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create comment: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Admin comment created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin_comments"] });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      handleClose();
    },
    onError: (error) => {
      toast.error(`Failed to create comment: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !content.trim()) {
      toast.error("Please fill in both subject and content");
      return;
    }

    setIsSubmitting(true);
    try {
      await createCommentMutation.mutateAsync({ subject: subject.trim(), content: content.trim() });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubject("");
    setContent("");
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-800">
            Create New Admin Comment (GpaJohn)
          </DialogTitle>
          <DialogDescription>
            Create an official announcement that will be posted as GpaJohn
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 font-medium">
              📢 This comment will be posted as an official announcement from GpaJohn 
              with personal ID: <span className="font-mono text-blue-800">0000FF</span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium">
              Subject *
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter the comment subject..."
              className="w-full"
              maxLength={100}
            />
            <p className="text-xs text-gray-500">
              {subject.length}/100 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Content *
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the comment content..."
              className="w-full min-h-[200px] resize-y"
              maxLength={2000}
            />
            <p className="text-xs text-gray-500">
              {content.length}/2000 characters
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !subject.trim() || !content.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? "Creating..." : "Create Comment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdminComment;