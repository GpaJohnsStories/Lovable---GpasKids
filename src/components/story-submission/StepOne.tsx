import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import PersonalIdSection from '@/components/PersonalIdSection';

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

interface StepOneProps {
  form: UseFormReturn<StorySubmissionFormData>;
  idMode: string;
  setIdMode: (mode: string) => void;
  personalId: string | null;
  setPersonalId: (id: string | null) => void;
  existingPersonalId: string;
  setExistingPersonalId: (id: string) => void;
  existingPersonalIdError: string | null;
  setExistingPersonalIdError: (error: string | null) => void;
}

const StepOne: React.FC<StepOneProps> = ({
  form,
  idMode,
  setIdMode,
  personalId,
  setPersonalId,
  existingPersonalId,
  setExistingPersonalId,
  existingPersonalIdError,
  setExistingPersonalIdError,
}) => {
  return (
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
        setPersonalId={setPersonalId}
        existingPersonalId={existingPersonalId}
        setExistingPersonalId={setExistingPersonalId}
        existingPersonalIdError={existingPersonalIdError}
        setExistingPersonalIdError={setExistingPersonalIdError}
      />
    </div>
  );
};

export default StepOne;