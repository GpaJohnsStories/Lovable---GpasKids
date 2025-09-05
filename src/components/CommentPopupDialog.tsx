import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WordLimitedTextarea } from "@/components/ui/word-limited-textarea";
import ThankYouModal from './ThankYouModal';
import { containsBadWord } from '@/utils/profanity';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { WebTextBox } from './WebTextBox';

interface CommentPopupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledSubject?: string;
}

export const CommentPopupDialog: React.FC<CommentPopupDialogProps> = ({
  isOpen,
  onClose,
  prefilledSubject
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: prefilledSubject || '',
    message: '',
    pageUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [profanityError, setProfanityError] = useState('');
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setStartTime(Date.now());
      setFormData(prev => ({
        ...prev,
        subject: prefilledSubject || '',
        pageUrl: window.location.href
      }));
    }
  }, [isOpen, prefilledSubject]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Check for profanity in text fields
    if (['name', 'email', 'subject', 'message'].includes(field) && value) {
      if (containsBadWord(value)) {
        setProfanityError('Oops! It looks like your message used words not allowed here. Please say it a little more kindly? Thanks, Buddy!');
      } else {
        setProfanityError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    // Validation
    if (!formData.subject.trim() || formData.subject.length < 2) {
      toast({
        title: "Subject Required",
        description: "Please enter a subject of at least 2 characters.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.message.trim() || formData.message.length < 10) {
      toast({
        title: "Message Required", 
        description: "Please enter a message of at least 10 characters.",
        variant: "destructive"
      });
      return;
    }

    // Final profanity check
    const allText = [formData.name, formData.email, formData.subject, formData.message]
      .filter(Boolean)
      .join(' ');
    
    if (containsBadWord(allText)) {
      setProfanityError('Oops! It looks like your message used words not allowed here. Please say it a little more kindly? Thanks, Buddy!');
      return;
    }

    const interactionTime = Date.now() - startTime;
    if (interactionTime < 3000) {
      toast({
        title: "Please Wait",
        description: "Please take a moment to compose your message thoughtfully.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-comment', {
        body: {
          name: formData.name.trim() || undefined,
          email: formData.email.trim() || undefined,
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          pageUrl: formData.pageUrl,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
          interactionTime
        }
      });

      if (error) {
        console.error('Error sending comment:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to send comment. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Clear form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        pageUrl: ''
      });
      
      setShowThankYou(true);

    } catch (error) {
      console.error('Error sending comment:', error);
      toast({
        title: "Error",
        description: "Failed to send comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      pageUrl: ''
    });
    setProfanityError('');
    setStartTime(0);
    onClose();
  };

  if (showThankYou) {
    return (
      <Dialog open={showThankYou} onOpenChange={() => {
        setShowThankYou(false);
        handleClose();
      }}>
        <DialogContent className="max-w-md mx-auto bg-gradient-to-b from-yellow-50 to-orange-50 border-2 border-orange-200">
          <DialogHeader className="text-center space-y-4">
            <DialogTitle className="text-2xl font-bold text-orange-800">
              Comment Sent!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p className="text-lg text-orange-700">
              Thank you for your comment! Grandpa John will read it soon.
            </p>
            <Button 
              onClick={() => {
                setShowThankYou(false);
                handleClose();
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-fun text-[21px] px-6 py-3"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-fun text-orange-800">
            Send a Comment to Grandpa John
          </DialogTitle>
        </DialogHeader>

        {/* Buddy's introduction */}
        <div className="mb-6">
          <WebTextBox 
            webtextCode="BUDDY-COMMENT-INTRO"
            borderColor="border-orange-300"
            backgroundColor="bg-orange-50"
            title="From Buddy"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-[21px] font-fun text-orange-800">
                Your Name (optional)
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="What should we call you?"
                className="font-fun text-[21px]"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-[21px] font-fun text-orange-800">
                Your Email (optional)
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                className="font-fun text-[21px]"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="subject" className="text-[21px] font-fun text-orange-800">
              Subject *
            </Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="What would you like to talk about?"
              required
              className="font-fun text-[21px]"
            />
          </div>

          <div>
            <Label htmlFor="message" className="text-[21px] font-fun text-orange-800">
              Your Message *
            </Label>
            <WordLimitedTextarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Share your thoughts, ask a question, or tell us about your experience..."
              wordLimit={200}
              showWordCount={true}
              required
              className="min-h-[120px] font-fun text-[21px]"
            />
          </div>

          {profanityError && (
            <div className="text-red-600 text-sm font-medium">
              {profanityError}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="font-fun text-[21px] px-6 py-3"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !!profanityError}
              className="font-fun text-[21px] px-6 py-3"
            >
              {isSubmitting ? 'Sending...' : 'Send Comment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CommentPopupDialog;