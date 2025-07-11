import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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

interface StepTwoProps {
  form: UseFormReturn<StorySubmissionFormData>;
  storyContent: string;
  setStoryContent: (content: string) => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ form, storyContent, setStoryContent }) => {
  return (
    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
      <h3 className="text-lg font-bold text-blue-800 mb-4">Step 2: Story Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
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
  );
};

export default StepTwo;