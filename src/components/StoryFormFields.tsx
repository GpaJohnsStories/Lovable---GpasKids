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
  read_count?: number;
  thumbs_up_count?: number;
  thumbs_down_count?: number;
  ok_count?: number;
  copyright_status?: string;
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <Label htmlFor="copyright_status">Copyright Status</Label>
          <Select
            value={formData.copyright_status || '©'}
            onValueChange={(value) => onInputChange('copyright_status', value)}
          >
            <SelectTrigger className={`text-white font-bold ${
              (formData.copyright_status || '©') === '©' ? 'bg-red-500 hover:bg-red-600 border-red-600' :
              (formData.copyright_status || '©') === 'O' ? 'bg-green-500 hover:bg-green-600 border-green-600' :
              'bg-yellow-500 hover:bg-yellow-600 border-yellow-600'
            }`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50 bg-white border shadow-lg">
              <SelectItem value="©" className="text-xs text-red-600 font-bold">© Full Copyright</SelectItem>
              <SelectItem value="O" className="text-xs text-green-600 font-bold">O Open, No Copyright</SelectItem>
              <SelectItem value="S" className="text-xs text-yellow-600 font-bold">S Limited Sharing</SelectItem>
            </SelectContent>
          </Select>
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


      {/* Story Statistics Display */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="text-amber-700 font-medium mb-3">Story Statistics</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-amber-800 font-semibold text-lg">{formData.read_count || 0}</div>
            <div className="text-amber-600">Reads</div>
          </div>
          <div className="text-center">
            <div className="text-green-600 font-semibold text-lg">{formData.thumbs_up_count || 0}</div>
            <div className="text-amber-600">👍 Thumbs Up</div>
          </div>
          <div className="text-center">
            <div className="text-red-600 font-semibold text-lg">{formData.thumbs_down_count || 0}</div>
            <div className="text-amber-600">👎 Thumbs Down</div>
          </div>
          <div className="text-center">
            {(() => {
              const { readingTime, wordCount } = calculateReadingTimeWithWordCount(formData.content || formData.excerpt || '');
              return (
                <div>
                  <div className="text-amber-800 font-semibold">{readingTime}</div>
                  <div className="text-amber-600">{wordCount} words</div>
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
