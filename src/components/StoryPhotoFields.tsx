
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
}

interface StoryPhotoFieldsProps {
  formData: Story;
  onInputChange: (field: keyof Story, value: string) => void;
}

const StoryPhotoFields: React.FC<StoryPhotoFieldsProps> = ({ formData, onInputChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="photo_link_1">Photo Link 1</Label>
        <Input
          id="photo_link_1"
          value={formData.photo_link_1}
          onChange={(e) => onInputChange('photo_link_1', e.target.value)}
          placeholder="Photo URL"
        />
      </div>

      <div>
        <Label htmlFor="photo_link_2">Photo Link 2</Label>
        <Input
          id="photo_link_2"
          value={formData.photo_link_2}
          onChange={(e) => onInputChange('photo_link_2', e.target.value)}
          placeholder="Photo URL"
        />
      </div>

      <div>
        <Label htmlFor="photo_link_3">Photo Link 3</Label>
        <Input
          id="photo_link_3"
          value={formData.photo_link_3}
          onChange={(e) => onInputChange('photo_link_3', e.target.value)}
          placeholder="Photo URL"
        />
      </div>
    </div>
  );
};

export default StoryPhotoFields;
