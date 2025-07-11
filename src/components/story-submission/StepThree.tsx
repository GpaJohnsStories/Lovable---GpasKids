import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

interface StepThreeProps {
  form: UseFormReturn<StorySubmissionFormData>;
  signatureError: string | null;
}

const StepThree: React.FC<StepThreeProps> = ({ form, signatureError }) => {
  return (
    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
      <h3 className="text-lg font-bold text-green-800 mb-4">Step 3: Author Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="author_name" className="text-green-800 text-sm font-bold" style={{ fontFamily: 'Georgia, serif' }}>Author's Real Name <span className="bg-yellow-200 px-2 py-1 rounded font-bold italic">Required</span></Label>
          <Input
            id="author_name"
            {...form.register('author_name')}
            className="mt-1"
            placeholder="e.g., Mark Twain, J.K. Rowling, or your real name"
          />
          <p className="text-xs text-green-600 mt-1">Author's real name will not be made available to the public but is for legal copyright and story ownership only.</p>
        </div>
        
        <div>
          <Label htmlFor="author_pen_name" className="text-green-800 text-sm font-bold" style={{ fontFamily: 'Georgia, serif' }}>Author's Pen Name <span className="bg-yellow-200 px-2 py-1 rounded font-bold italic">Required</span></Label>
          <Input
            id="author_pen_name"
            {...form.register('author_pen_name')}
            className="mt-1"
            placeholder="Enter the name you want shown publicly"
          />
          <p className="text-xs text-green-600 mt-1" style={{ fontFamily: 'Georgia, serif' }}>This is the name that will be attached to your story when it is displayed in public on Gpa's Kids Website.</p>
        </div>
        
        <div>
          <Label htmlFor="author_email" className="text-green-800 text-sm font-bold" style={{ fontFamily: 'Georgia, serif' }}>Author's Email <span className="bg-green-200 px-2 py-1 rounded font-bold italic text-yellow-800">Not Required</span></Label>
          <Input
            id="author_email"
            type="email"
            {...form.register('author_email', { required: 'Author email is required' })}
            className="mt-1"
            placeholder="email@example.com"
          />
          <p className="text-xs text-green-600 mt-1" style={{ fontFamily: 'Georgia, serif' }}>An email address is only required if you'd rather communicate through email instead of using Comments on this web with your Personal ID. If you provide your email address, it will not be made available to the public.</p>
        </div>
        
        <div>
          <Label htmlFor="date_of_birth" className="text-green-800 text-sm font-bold" style={{ fontFamily: 'Georgia, serif' }}>Author's Date of Birth <span className="bg-yellow-200 px-2 py-1 rounded font-bold italic">Required</span></Label>
          <Input
            id="date_of_birth"
            type="date"
            {...form.register('date_of_birth')}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="electronic_signature" className="text-green-800 text-sm font-bold" style={{ fontFamily: 'Georgia, serif' }}>Electronic Signature (Author's Real Name) <span className="bg-yellow-200 px-2 py-1 rounded font-bold italic">Required</span></Label>
          <p className="text-xs text-green-600 mt-1 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            By typing my full name below, I electronically sign and agree to the terms of this Story Submission Release Form.
          </p>
          <Input
            id="electronic_signature"
            {...form.register('author_signature', { required: 'Author signature is required' })}
            className="mt-1"
            placeholder="Type your full name as electronic signature"
          />
          {signatureError && (
            <p className="text-red-600 text-xs mt-1" style={{ fontFamily: 'Georgia, serif' }}>{signatureError}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepThree;