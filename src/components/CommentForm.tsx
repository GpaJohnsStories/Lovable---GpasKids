
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ClubPersonalIdSection from './ClubPersonalIdSection';
import PhotoAttachmentSection from './PhotoAttachmentSection';

interface CommentFormProps {
  prefilledStoryCode?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ prefilledStoryCode = '' }) => {
  const [personalId, setPersonalId] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePersonalIdGenerated = (id: string) => {
    setPersonalId(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!personalId || personalId.length !== 6) {
      toast({
        title: "Personal ID Required",
        description: "Please enter your 6-character Personal ID",
        variant: "destructive",
      });
      return;
    }

    if (!subject.trim() || subject.length < 2) {
      toast({
        title: "Subject Required",
        description: "Please enter a subject (at least 2 characters)",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim() || content.length < 10) {
      toast({
        title: "Content Required",
        description: "Please enter your comment (at least 10 characters)",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (file) {
        // Use edge function for file uploads
        const formData = new FormData();
        formData.append('personalId', personalId.toUpperCase());
        formData.append('subject', subject.trim());
        formData.append('content', content.trim());
        formData.append('attachment', file);
        if (caption.trim()) {
          formData.append('caption', caption.trim());
        }

        const { data, error } = await supabase.functions.invoke('submit-comment-attachment', {
          body: formData,
        });

        if (error) throw error;

        toast({
          title: "Success!",
          description: data.message || "Comment with photo submitted successfully!",
        });
      } else {
        // Regular comment submission without file
        const { error } = await supabase
          .from('comments')
          .insert({
            personal_id: personalId.toUpperCase(),
            subject: subject.trim(),
            content: content.trim(),
            status: 'pending'
          });

        if (error) throw error;

        toast({
          title: "Success!",
          description: "Comment submitted successfully!",
        });
      }

      // Reset form
      setPersonalId('');
      setSubject('');
      setContent('');
      setFile(null);
      setCaption('');
      
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-amber-200">
      <h2 className="text-2xl font-bold text-amber-800 mb-6">Share Your Thoughts</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <ClubPersonalIdSection
          onPersonalIdGenerated={handlePersonalIdGenerated}
          showExplanation={true}
        />

        <div>
          <Label htmlFor="subject" className="text-[21px] font-fun text-orange-800">
            Subject *
          </Label>
          <Input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="What's your comment about?"
            maxLength={100}
            disabled={isSubmitting}
            className="mt-1 font-fun text-[21px] md:text-[21px]"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {subject.length}/100 characters (minimum 2)
          </p>
        </div>

        <div>
          <Label htmlFor="content" className="text-[21px] font-fun text-orange-800">
            Your Comment *
          </Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, questions, or stories..."
            maxLength={1000}
            disabled={isSubmitting}
            className="mt-1 font-fun text-[21px] md:text-[21px]"
            rows={6}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {content.length}/1000 characters (minimum 10)
          </p>
        </div>

        <PhotoAttachmentSection
          file={file}
          caption={caption}
          onFileChange={setFile}
          onCaptionChange={setCaption}
          disabled={isSubmitting}
        />

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Comment'}
        </Button>

        <p className="text-xs text-gray-600 text-center">
          All comments are reviewed before being posted. Photos will be considered for the Orange Shirt Gang gallery!
        </p>
      </form>
    </div>
  );
};

export default CommentForm;
