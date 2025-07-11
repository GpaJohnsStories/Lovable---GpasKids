import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { getPersonalId, setPersonalId } from '@/utils/personalId';
import { supabase } from '@/integrations/supabase/client';
import { differenceInYears } from 'date-fns';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';
import LegalNotice from './LegalNotice';

interface StorySubmissionFormData {
  story_title: string;
  author_name: string;
  author_pen_name: string;
  author_email: string;
  author_phone: string;
  date_of_birth: string;
  author_signature: string;
  parent_name?: string;
  parent_email?: string;
  parent_phone?: string;
  parent_signature?: string;
  personal_id_prefix?: string;
}

const StorySubmissionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storyContent, setStoryContent] = useState('');
  const [idMode, setIdMode] = useState('existing');
  const [personalId, setPersonalIdState] = useState<string | null>(getPersonalId());
  const [existingPersonalId, setExistingPersonalId] = useState('');
  const [existingPersonalIdError, setExistingPersonalIdError] = useState<string | null>(null);
  const [signatureError, setSignatureError] = useState<string | null>(null);
  const [userAge, setUserAge] = useState<number | null>(null);
  const [isStep4Required, setIsStep4Required] = useState(false);

  const form = useForm<StorySubmissionFormData>({
    defaultValues: {
      story_title: '',
      author_name: '',
      author_pen_name: '',
      author_email: '',
      author_phone: '',
      date_of_birth: '',
      author_signature: '',
      parent_name: '',
      parent_email: '',
      parent_phone: '',
      parent_signature: '',
    }
  });

  // Watch form values for validation
  const watchedValues = form.watch(['author_name', 'author_signature', 'date_of_birth']);

  useEffect(() => {
    const [authorName, signature, dateOfBirth] = watchedValues;
    
    // Validate signature matches author name
    if (signature && authorName) {
      const normalizedSignature = signature.toLowerCase().trim();
      const normalizedAuthorName = authorName.toLowerCase().trim();
      
      if (normalizedSignature !== normalizedAuthorName) {
        setSignatureError('Electronic signature must match the author\'s real name exactly');
      } else {
        setSignatureError(null);
      }
    } else {
      setSignatureError(null);
    }

    // Calculate age and determine if Step 4 is required
    if (dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      const age = differenceInYears(today, birthDate);
      
      setUserAge(age);
      setIsStep4Required(age < 21);
    } else {
      setUserAge(null);
      setIsStep4Required(false);
    }
  }, [watchedValues]);

  const onSubmit = async (data: StorySubmissionFormData) => {
    // Validate signature before submission
    if (signatureError) {
      toast.error('Please fix the electronic signature error before submitting');
      return;
    }

    // Validate personal ID
    const finalPersonalId = idMode === 'existing' ? existingPersonalId : personalId;
    
    if (!finalPersonalId || finalPersonalId.length !== 6) {
      if (idMode === 'existing') {
        setExistingPersonalIdError('Please enter a valid 6-character Personal ID');
      } else {
        toast.error('Please create your Personal ID first');
      }
      return;
    }

    if (!storyContent.trim()) {
      toast.error('Please enter your story content');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save story to the database
      const storyCode = `SUB-${finalPersonalId}`;
      
      const { error: storyError } = await supabase
        .from('stories')
        .insert({
          story_code: storyCode,
          title: data.story_title,
          author: data.author_name,
          content: storyContent,
          category: 'System',
          published: 'N',
          excerpt: `Story submission from ${data.author_name}`,
          tagline: 'User Submitted Story'
        });

      if (storyError) {
        throw new Error('Failed to save story: ' + storyError.message);
      }

      // 2. Send email with form data
      const emailData = {
        personalId: finalPersonalId,
        storyCode: storyCode,
        fileName: 'Story Content (Copy/Paste)',
        ...data
      };

      const { error: emailError } = await supabase.functions.invoke('send-story-submission-email', {
        body: emailData
      });

      if (emailError) {
        throw new Error('Failed to send email: ' + emailError.message);
      }

      // Save personal ID if it was created
      if (idMode === 'create' && personalId) {
        setPersonalId(personalId);
      }

      toast.success('Story submitted successfully! Thank you for sharing your story.');
      
      // Reset form
      form.reset();
      setStoryContent('');
      setPersonalIdState(null);
      setExistingPersonalId('');

    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit story');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8" style={{ fontFamily: 'Georgia, serif' }}>
        Story Submission Release Form
      </h1>
      
      {/* Legal Notice */}
      <LegalNotice />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" style={{ fontFamily: 'Georgia, serif' }}>
          
          {/* Step 1: Personal ID */}
          <StepOne
            form={form}
            idMode={idMode}
            setIdMode={setIdMode}
            personalId={personalId}
            setPersonalId={setPersonalIdState}
            existingPersonalId={existingPersonalId}
            setExistingPersonalId={setExistingPersonalId}
            existingPersonalIdError={existingPersonalIdError}
            setExistingPersonalIdError={setExistingPersonalIdError}
          />

          {/* Step 2: Story Information */}
          <StepTwo
            form={form}
            storyContent={storyContent}
            setStoryContent={setStoryContent}
          />

          {/* Step 3: Author Information */}
          <StepThree
            form={form}
            signatureError={signatureError}
          />

          {/* Step 4: Parent/Guardian Information */}
          <StepFour
            form={form}
            isStep4Required={isStep4Required}
            userAge={userAge}
          />

          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 text-base"
            >
              {isSubmitting ? (
                <>
                  <Upload className="w-5 h-5 mr-2 animate-spin" />
                  Submitting Story...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Submit My Story
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StorySubmissionForm;