import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import PersonalIdSection from '@/components/PersonalIdSection';
import { getPersonalId, setPersonalId } from '@/utils/personalId';
import { supabase } from '@/integrations/supabase/client';

interface StorySubmissionFormData {
  story_title: string;
  author_name: string;
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

  const form = useForm<StorySubmissionFormData>({
    defaultValues: {
      story_title: '',
      author_name: '',
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


  const onSubmit = async (data: StorySubmissionFormData) => {
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
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" style={{ fontFamily: 'Georgia, serif' }}>
        
        {/* Personal ID Section */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-orange-800 mb-4">Step 1: Your Personal ID <span className="bg-yellow-200 px-2 py-1 rounded font-semibold italic">This is required!</span></h3>
          <div className="mb-4 p-4 bg-orange-100 border border-orange-300 rounded">
            <p className="text-orange-800 text-sm">
              Your Personal ID is needed so that later, you can use your same Personal ID to view Grandpa John's comments about your story.
            </p>
          </div>
          <PersonalIdSection
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
        </div>

        {/* Story Information */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-800 mb-4">Step 2: Story Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="story_title" className="text-blue-800 text-sm font-bold" style={{ fontFamily: 'Georgia, serif' }}>Story Title <span className="bg-yellow-200 px-2 py-1 rounded font-bold italic">Required</span></Label>
              <Input
                id="story_title"
                {...form.register('story_title', { required: 'Story title is required' })}
                className="mt-1"
                placeholder="Enter your story title"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="story_content" className="text-blue-800 text-sm font-bold" style={{ fontFamily: 'Georgia, serif' }}>Copy and paste your story here <span className="bg-yellow-200 px-2 py-1 rounded font-bold italic">Required</span></Label>
              <Textarea
                id="story_content"
                value={storyContent}
                onChange={(e) => setStoryContent(e.target.value)}
                className="mt-1 min-h-[300px] resize-y"
                placeholder="Paste your story content here..."
              />
              
            </div>
          </div>
        </div>

        {/* Author Information */}
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-green-800 mb-4">Step 3: Author Information</h3>
          
          <div className="space-y-4 mb-4">
            <div className="bg-yellow-50 border border-yellow-300 rounded p-4">
              <p className="text-sm text-yellow-800 leading-relaxed">
                <strong>Legal Notice:</strong> By submitting this story, you represent and warrant that: (1) you are the original author or have proper authorization to submit this work, (2) the story does not infringe upon any copyright, trademark, or other intellectual property rights, (3) the content is appropriate for children and does not contain harmful, offensive, or inappropriate material, and (4) you grant Gpa's Kids permission to review, edit, and potentially publish your story on our website. All submissions become part of our story collection and may be used for educational and entertainment purposes.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="author_name" className="text-green-800 text-sm" style={{ fontFamily: 'Georgia, serif' }}>Author's Name (Real name or pen name)</Label>
              <Input
                id="author_name"
                {...form.register('author_name')}
                className="mt-1"
                placeholder="e.g., Mark Twain, J.K. Rowling, or your real name"
              />
              <p className="text-xs text-green-600 mt-1">Optional - You may use a pseudonym if you prefer</p>
            </div>
            
            <div>
              <Label htmlFor="author_email" className="text-green-800 text-sm" style={{ fontFamily: 'Georgia, serif' }}>Author's Email *</Label>
              <Input
                id="author_email"
                type="email"
                {...form.register('author_email', { required: 'Author email is required' })}
                className="mt-1"
                placeholder="email@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="author_phone" className="text-green-800 text-sm" style={{ fontFamily: 'Georgia, serif' }}>Author's Phone</Label>
              <Input
                id="author_phone"
                {...form.register('author_phone')}
                className="mt-1"
                placeholder="Phone number"
              />
            </div>
            
            <div>
              <Label htmlFor="date_of_birth" className="text-green-800 text-sm" style={{ fontFamily: 'Georgia, serif' }}>Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                {...form.register('date_of_birth')}
                className="mt-1"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="author_signature" className="text-green-800 text-sm" style={{ fontFamily: 'Georgia, serif' }}>Electronic Signature (Author) *</Label>
              <Input
                id="author_signature"
                {...form.register('author_signature', { required: 'Author signature is required' })}
                className="mt-1"
                placeholder="Type your full name as electronic signature"
              />
            </div>
          </div>
        </div>

        {/* Parent/Guardian Information */}
        <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-purple-800 mb-4">Step 4: Parent/Guardian Information (if applicable)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="parent_name" className="text-purple-800 text-sm" style={{ fontFamily: 'Georgia, serif' }}>Parent/Guardian Name</Label>
              <Input
                id="parent_name"
                {...form.register('parent_name')}
                className="mt-1"
                placeholder="Full name"
              />
            </div>
            
            <div>
              <Label htmlFor="parent_email" className="text-purple-800 text-sm" style={{ fontFamily: 'Georgia, serif' }}>Parent/Guardian Email</Label>
              <Input
                id="parent_email"
                type="email"
                {...form.register('parent_email')}
                className="mt-1"
                placeholder="email@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="parent_phone" className="text-purple-800 text-sm" style={{ fontFamily: 'Georgia, serif' }}>Parent/Guardian Phone</Label>
              <Input
                id="parent_phone"
                {...form.register('parent_phone')}
                className="mt-1"
                placeholder="Phone number"
              />
            </div>
            
            <div>
              <Label htmlFor="parent_signature" className="text-purple-800 text-sm" style={{ fontFamily: 'Georgia, serif' }}>Electronic Signature (Parent/Guardian)</Label>
              <Input
                id="parent_signature"
                {...form.register('parent_signature')}
                className="mt-1"
                placeholder="Type full name as electronic signature"
              />
            </div>
          </div>
        </div>

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