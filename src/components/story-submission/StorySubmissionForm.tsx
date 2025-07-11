import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { Upload, Download, Mail, FileText, RotateCcw } from 'lucide-react';
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
  story_tagline: string;
  story_excerpt: string;
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
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<StorySubmissionFormData | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const form = useForm<StorySubmissionFormData>({
    defaultValues: {
      story_title: '',
      story_tagline: '',
      story_excerpt: '',
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
      // 1. Save story to the database with correct category and story code
      const { error: storyError } = await supabase
        .from('stories')
        .insert({
          story_code: finalPersonalId, // Use personal ID as story code
          title: data.story_title,
          author: data.author_name,
          content: storyContent,
          category: 'STORY' as any, // Type assertion for new category
          published: 'N',
          excerpt: data.story_excerpt,
          tagline: data.story_tagline
        });

      if (storyError) {
        throw new Error('Failed to save story: ' + storyError.message);
      }

      // 2. Send email with form data
      const emailData = {
        personalId: finalPersonalId,
        storyCode: finalPersonalId, // Use personal ID as story code
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

      // Set success state and store submitted data for PDF generation
      setSubmittedData({
        ...data,
        personal_id_prefix: finalPersonalId
      });
      setSubmissionSuccess(true);
      
      toast.success('Story submitted successfully! You can now download or email your release form.');

    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit story');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePDF = async (sendEmail: boolean = false) => {
    if (!submittedData) return;

    setIsGeneratingPDF(true);
    
    try {
      const finalPersonalId = idMode === 'existing' ? existingPersonalId : personalId;
      const storyCode = finalPersonalId; // Use personal ID as story code
      
      const pdfData = {
        personalId: finalPersonalId,
        storyCode: storyCode,
        story_title: submittedData.story_title,
        story_tagline: submittedData.story_tagline,
        story_excerpt: submittedData.story_excerpt,
        story_content: storyContent,
        author_name: submittedData.author_name,
        author_pen_name: submittedData.author_pen_name,
        author_email: submittedData.author_email,
        author_phone: submittedData.author_phone,
        date_of_birth: submittedData.date_of_birth,
        author_signature: submittedData.author_signature,
        parent_name: submittedData.parent_name,
        parent_email: submittedData.parent_email,
        parent_phone: submittedData.parent_phone,
        parent_signature: submittedData.parent_signature,
        send_email: sendEmail
      };

      const { data: response, error } = await supabase.functions.invoke('generate-story-pdf', {
        body: pdfData
      });

      if (error) {
        throw new Error('Failed to generate PDF: ' + error.message);
      }

      if (sendEmail) {
        toast.success('PDF has been sent to your email address!');
      } else {
        // Open the HTML content in a new window for printing
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(response.htmlContent);
          newWindow.document.close();
          newWindow.print();
        }
        toast.success('PDF opened for printing!');
      }

    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const resetForm = () => {
    setSubmissionSuccess(false);
    setSubmittedData(null);
    form.reset();
    setStoryContent('');
    setPersonalIdState(null);
    setExistingPersonalId('');
    setExistingPersonalIdError(null);
    setSignatureError(null);
    setUserAge(null);
    setIsStep4Required(false);
  };

  // Show success screen if submission was successful
  if (submissionSuccess && submittedData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6" style={{ fontFamily: 'Georgia, serif' }}>
        {/* Success Header */}
        <div className="text-center bg-green-50 border-2 border-green-300 rounded-lg p-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-green-800 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Story Submitted Successfully!
          </h1>
          <p className="text-lg text-green-700 mb-2">
            Thank you for submitting "<strong>{submittedData.story_title}</strong>" to Gpa's Kids!
          </p>
          <p className="text-md text-green-600">
            Your story has been saved and will be reviewed for publication.
          </p>
        </div>

        {/* PDF Options */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
            <FileText className="w-6 h-6 mr-2" />
            Your Release Form
          </h2>
          <p className="text-blue-700 mb-6">
            Your complete story submission release form is ready. You can download it for your records or have it sent to your email.
          </p>
          
          <div className="space-y-4">
            {/* Print/Download Option */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center">
                <Download className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-blue-800">Print Release Form</h3>
                  <p className="text-sm text-blue-600">Open and print your complete release form document</p>
                </div>
              </div>
              <Button
                onClick={() => generatePDF(false)}
                disabled={isGeneratingPDF}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isGeneratingPDF ? 'Generating...' : 'Print PDF'}
              </Button>
            </div>

            {/* Email Option (only if email provided) */}
            {submittedData.author_email && (
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-blue-800">Email Release Form</h3>
                    <p className="text-sm text-blue-600">Send the complete release form to: {submittedData.author_email}</p>
                  </div>
                </div>
                <Button
                  onClick={() => generatePDF(true)}
                  disabled={isGeneratingPDF}
                  variant="outline"
                  className="border-blue-500 text-blue-500 hover:bg-blue-50"
                >
                  {isGeneratingPDF ? 'Sending...' : 'Email PDF'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Submit Another Story */}
        <div className="text-center">
          <Button
            onClick={resetForm}
            variant="outline"
            className="border-gray-400 text-gray-600 hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Submit Another Story
          </Button>
        </div>
      </div>
    );
  }

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