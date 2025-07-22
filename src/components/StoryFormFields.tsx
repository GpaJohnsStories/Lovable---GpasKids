
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StoryCodeField from './StoryCodeField';

interface StoryFormFieldsProps {
  formData: {
    title: string;
    author: string;
    category: "Fun" | "Life" | "North Pole" | "World Changers" | "WebText";
    tagline: string;
    excerpt: string;
    story_code: string;
    published: string;
  };
  onInputChange: (field: string, value: string) => void;
  compact?: boolean;
}

const StoryFormFields: React.FC<StoryFormFieldsProps> = ({ 
  formData, 
  onInputChange,
  compact = false 
}) => {
  const fieldSpacing = compact ? "space-y-3" : "space-y-4";
  const labelSize = compact ? "text-sm" : "text-base";

  return (
    <div className={fieldSpacing}>
      <div className="space-y-2">
        <Label htmlFor="title" className={`font-medium text-gray-700 ${labelSize}`}>
          Title *
        </Label>
        <Input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          placeholder="Enter story title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author" className={`font-medium text-gray-700 ${labelSize}`}>
          Author *
        </Label>
        <Input
          id="author"
          type="text"
          value={formData.author}
          onChange={(e) => onInputChange('author', e.target.value)}
          placeholder="Enter author name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className={`font-medium text-gray-700 ${labelSize}`}>
          Category *
        </Label>
        <Select value={formData.category} onValueChange={(value) => onInputChange('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Fun">Fun</SelectItem>
            <SelectItem value="Life">Life</SelectItem>
            <SelectItem value="North Pole">North Pole</SelectItem>
            <SelectItem value="World Changers">World Changers</SelectItem>
            <SelectItem value="WebText">WebText</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <StoryCodeField
          value={formData.story_code}
          onChange={(value) => onInputChange('story_code', value)}
          compact={compact}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tagline" className={`font-medium text-gray-700 ${labelSize}`}>
          Tagline <span className="text-gray-500 font-normal">(Maximum 100 Characters)</span>
        </Label>
        <Textarea
          id="tagline"
          value={formData.tagline}
          onChange={(e) => onInputChange('tagline', e.target.value)}
          placeholder="Enter a brief tagline"
          maxLength={100}
          rows={2}
          className="resize-none"
        />
        <div className="text-right text-sm text-gray-500">
          {formData.tagline.length}/100
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt" className={`font-medium text-gray-700 ${labelSize}`}>
          Excerpt
        </Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => onInputChange('excerpt', e.target.value)}
          placeholder="Enter a brief excerpt or summary"
          rows={compact ? 2 : 3}
        />
      </div>

      {!compact && (
        <div className="space-y-2">
          <Label htmlFor="published" className={`font-medium text-gray-700 ${labelSize}`}>
            Published Status
          </Label>
          <Select value={formData.published} onValueChange={(value) => onInputChange('published', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select publish status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="N">Not Published</SelectItem>
              <SelectItem value="Y">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default StoryFormFields;
