
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface StoryFormFieldsProps {
  formData: Story;
  onInputChange: (field: keyof Story, value: string) => void;
}

const StoryFormFields: React.FC<StoryFormFieldsProps> = ({ formData, onInputChange }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onInputChange('title', e.target.value)}
            required
            placeholder="Enter story title"
          />
        </div>
        
        <div>
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => onInputChange('author', e.target.value)}
            placeholder="Author name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => onInputChange('category', value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fun">Fun</SelectItem>
              <SelectItem value="Life">Life</SelectItem>
              <SelectItem value="North Pole">North Pole</SelectItem>
              <SelectItem value="World Changers">World Changers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="story_code">Story Code</Label>
          <Input
            id="story_code"
            value={formData.story_code}
            onChange={(e) => onInputChange('story_code', e.target.value)}
            placeholder="Optional story code"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="tagline">Tagline</Label>
        <Input
          id="tagline"
          value={formData.tagline}
          onChange={(e) => onInputChange('tagline', e.target.value)}
          placeholder="Brief tagline for the story"
        />
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Input
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => onInputChange('excerpt', e.target.value)}
          placeholder="Short description for story cards"
        />
      </div>
    </>
  );
};

export default StoryFormFields;
