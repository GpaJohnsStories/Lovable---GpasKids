import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

interface StepFourProps {
  form: UseFormReturn<StorySubmissionFormData>;
  isStep4Required: boolean;
  userAge: number | null;
}

const StepFour: React.FC<StepFourProps> = ({ form, isStep4Required, userAge }) => {
  return (
    <div className={`border-2 rounded-lg p-6 transition-all duration-300 ${
      isStep4Required 
        ? 'bg-purple-50 border-purple-300' 
        : 'bg-gray-100 border-gray-300 opacity-60'
    }`}>
      <h3 className={`text-lg font-bold mb-4 ${
        isStep4Required 
          ? 'text-purple-800' 
          : 'text-gray-500'
      }`} style={{ fontFamily: 'Georgia, serif' }}>
        Step 4: Parent/Guardian Information 
        {!isStep4Required && userAge !== null && (
          <span className="text-sm font-normal"> (Not required - Author is {userAge} years old)</span>
        )}
        {isStep4Required && userAge !== null && (
          <span className="bg-red-200 px-2 py-1 rounded font-bold italic text-sm ml-2">Required - Author is {userAge} years old</span>
        )}
      </h3>
      
      <p className={`text-sm mb-4 leading-relaxed ${
        isStep4Required ? 'text-purple-800' : 'text-gray-500'
      }`} style={{ fontFamily: 'Georgia, serif' }}>
        If the author is under 21 years of age, a parent or legal guardian must complete this section. By typing their name, the parent/guardian electronically signs and agrees to the terms.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="parent_name" className={`text-sm font-bold ${isStep4Required ? 'text-purple-800' : 'text-gray-500'}`} style={{ fontFamily: 'Georgia, serif' }}>Parent/Guardian Name</Label>
          <Input
            id="parent_name"
            {...form.register('parent_name')}
            className="mt-1"
            placeholder="Full name"
            disabled={!isStep4Required}
          />
        </div>
        
        <div>
          <Label htmlFor="parent_email" className={`text-sm font-bold ${isStep4Required ? 'text-purple-800' : 'text-gray-500'}`} style={{ fontFamily: 'Georgia, serif' }}>Parent/Guardian Email</Label>
          <Input
            id="parent_email"
            type="email"
            {...form.register('parent_email')}
            className="mt-1"
            placeholder="email@example.com"
            disabled={!isStep4Required}
          />
        </div>
        
        <div>
          <Label htmlFor="parent_signature" className={`text-sm font-bold ${isStep4Required ? 'text-purple-800' : 'text-gray-500'}`} style={{ fontFamily: 'Georgia, serif' }}>Electronic Signature (Parent/Guardian)</Label>
          <Input
            id="parent_signature"
            {...form.register('parent_signature')}
            className="mt-1"
            placeholder="Type full name as electronic signature"
            disabled={!isStep4Required}
          />
        </div>
      </div>
    </div>
  );
};

export default StepFour;