
import React from 'react';
import StoryFormContainer from './story-form/StoryFormContainer';

interface Story {
  id?: string;
  title: string;
  author: string;
  category: "Fun" | "Life" | "North Pole" | "World Changers";
  content: string;
  tagline: string;
  excerpt: string;
  story_code: string;
  google_drive_link: string;
  photo_link_1: string;
  photo_link_2: string;
  photo_link_3: string;
  published: string;
}

interface StoryFormProps {
  story?: Story;
  onSave: () => void;
  onCancel: () => void;
}

const StoryForm: React.FC<StoryFormProps> = ({ story, onSave, onCancel }) => {
  return (
    <StoryFormContainer
      story={story}
      onSave={onSave}
      onCancel={onCancel}
    />
  );
};

export default StoryForm;
