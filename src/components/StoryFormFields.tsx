import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateReadingTimeWithWordCount } from "@/utils/readingTimeUtils";

interface Story {
  id?: string;
  title: string;
  author: string;
  category: "Fun" | "Life" | "North Pole" | "World Changers" | "System" | "STORY";
  content: string;
  tagline: string;
  excerpt: string;
  story_code: string;
  google_drive_link: string;
  photo_link_1: string;
  photo_link_2: string;
  photo_link_3: string;
  photo_alt_1: string;
  photo_alt_2: string;
  photo_alt_3: string;
  video_url: string;
  published: string;
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <SelectItem value="System">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="story_code">Story Code *</Label>
          <Input
            id="story_code"
            value={formData.story_code}
            onChange={(e) => onInputChange('story_code', e.target.value)}
            required
            placeholder="Enter unique story code"
          />
        </div>

        <div>
          <Label htmlFor="published">Published Status</Label>
          <Select
            value={formData.published}
            onValueChange={(value) => onInputChange('published', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Y">Published (Y)</SelectItem>
              <SelectItem value="N">Not Published (N)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="tagline">Tagline</Label>
        <div className="relative">
          <Input
            id="tagline"
            value={formData.tagline}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 100) {
                onInputChange('tagline', value);
              }
            }}
            placeholder="Brief tagline for the story (max 100 characters)"
            maxLength={100}
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.tagline.length}/100 characters
          </div>
        </div>
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

      {/* Photo Alt Text Fields */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <Label className="text-lg font-medium text-blue-800 mb-4 block">
          📝 Photo Alt Text / Descriptions
        </Label>
        <p className="text-sm text-blue-600 mb-4">
          These descriptions help screen readers and provide context when images don't load. Required for accessibility.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="photo_alt_1" className="text-sm font-medium">
              Photo 1 Alt Text
            </Label>
            <Input
              id="photo_alt_1"
              value={formData.photo_alt_1}
              onChange={(e) => onInputChange('photo_alt_1', e.target.value)}
              placeholder="Describe photo 1 content"
            />
          </div>
          
          <div>
            <Label htmlFor="photo_alt_2" className="text-sm font-medium">
              Photo 2 Alt Text
            </Label>
            <Input
              id="photo_alt_2"
              value={formData.photo_alt_2}
              onChange={(e) => onInputChange('photo_alt_2', e.target.value)}
              placeholder="Describe photo 2 content"
            />
          </div>
          
          <div>
            <Label htmlFor="photo_alt_3" className="text-sm font-medium">
              Photo 3 Alt Text
            </Label>
            <Input
              id="photo_alt_3"
              value={formData.photo_alt_3}
              onChange={(e) => onInputChange('photo_alt_3', e.target.value)}
              placeholder="Describe photo 3 content"
            />
          </div>
        </div>
      </div>

      {/* Reading Time and Word Count Display */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="text-amber-700 font-medium">Story Statistics</div>
          <div className="text-amber-600">
            {(() => {
              const { readingTime, wordCount } = calculateReadingTimeWithWordCount(formData.content || formData.excerpt || '');
              return (
                <div className="text-right">
                  <div className="font-medium">{readingTime}</div>
                  <div className="text-gray-600">{wordCount} words</div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </>
  );
};

export default StoryFormFields;
