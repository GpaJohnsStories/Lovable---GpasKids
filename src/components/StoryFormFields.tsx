
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StoryFormFieldsProps {
  formData: {
    title: string;
    author: string;
    category: "Fun" | "Life" | "North Pole" | "World Changers" | "WebText" | "BioText" | "Admin";
    tagline: string;
    excerpt: string;
    story_code: string;
    published: string;
    // Bio-specific fields
    bio_subject_name?: string;
    born_date?: string;
    died_date?: string;
    native_country?: string;
    native_language?: string;
  };
  onInputChange: (field: string, value: string) => void;
  compact?: boolean;
  hideTitle?: boolean;
  hideAuthor?: boolean;
  hideTagline?: boolean;
  hideExcerpt?: boolean;
}

const StoryFormFields: React.FC<StoryFormFieldsProps> = ({ 
  formData, 
  onInputChange,
  compact = false,
  hideTitle = false,
  hideAuthor = false,
  hideTagline = false,
  hideExcerpt = false
}) => {
  const fieldSpacing = compact ? "space-y-3" : "space-y-4";
  const labelSize = compact ? "text-sm" : "text-base";

  const getPublishedColor = (publishedStatus: string) => {
    switch (publishedStatus) {
      case 'Y':
        return 'text-white bg-green-600 border-green-700';
      case 'N':
        return 'text-white bg-red-600 border-red-700';
      default:
        return 'text-white bg-red-600 border-red-700';
    }
  };

  return (
    <div className={fieldSpacing}>
      {!hideTitle && (
        <div className="space-y-2">
          <Label htmlFor="title" className={`font-bold text-gray-700 ${labelSize}`}>
            Title * <span className="text-gray-500 font-normal">(Maximum 40 Characters)</span>
          </Label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => onInputChange('title', e.target.value)}
            placeholder="Enter story title"
            maxLength={40}
            className="border-amber-border border-2"
            required
          />
          <div className="text-right text-sm text-gray-500">
            {formData.title.length}/40
          </div>
        </div>
      )}

      {!hideAuthor && (
        <div className="space-y-2">
          <Label htmlFor="author" className={`font-bold text-gray-700 ${labelSize}`}>
            Author *
          </Label>
          <Input
            id="author"
            type="text"
            value={formData.author}
            onChange={(e) => onInputChange('author', e.target.value)}
            placeholder="Enter author name"
            className="border-amber-border border-2"
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="category" className={`font-bold text-gray-700 ${labelSize}`}>
          Category *
        </Label>
        <Select value={formData.category} onValueChange={(value) => onInputChange('category', value)}>
          <SelectTrigger className="border-amber-border border-2">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Fun">Fun</SelectItem>
            <SelectItem value="Life">Life</SelectItem>
            <SelectItem value="North Pole">North Pole</SelectItem>
            <SelectItem value="World Changers">World Changers</SelectItem>
            <SelectItem value="WebText">WebText</SelectItem>
            <SelectItem value="BioText">BioText</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bio-specific fields - only show when category is BioText */}
      {formData.category === 'BioText' && (
        <>
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 space-y-4 relative">
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center z-10">
              <span className="text-white text-sm font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>1b</span>
            </div>
            <h3 className="text-lg font-bold text-teal-800 mb-3">Biography Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="bio_subject_name" className={`font-bold text-gray-700 ${labelSize}`}>
                Subject of Biography *
              </Label>
              <Input
                id="bio_subject_name"
                type="text"
                value={formData.bio_subject_name || ''}
                onChange={(e) => onInputChange('bio_subject_name', e.target.value)}
                placeholder="Enter the name of the person this biography is about"
                className="border-teal-300 border-2"
                required={formData.category === 'BioText'}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="born_date" className={`font-bold text-gray-700 ${labelSize}`}>
                  Born Date
                </Label>
                <Input
                  id="born_date"
                  type="date"
                  value={formData.born_date || ''}
                  onChange={(e) => onInputChange('born_date', e.target.value)}
                  className="border-teal-300 border-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="died_date" className={`font-bold text-gray-700 ${labelSize}`}>
                  Died Date
                </Label>
                <Input
                  id="died_date"
                  type="date"
                  value={formData.died_date || ''}
                  onChange={(e) => onInputChange('died_date', e.target.value)}
                  className="border-teal-300 border-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="native_country" className={`font-bold text-gray-700 ${labelSize}`}>
                  Native Country
                </Label>
                <Input
                  id="native_country"
                  type="text"
                  value={formData.native_country || ''}
                  onChange={(e) => onInputChange('native_country', e.target.value)}
                  placeholder="e.g., United States"
                  className="border-teal-300 border-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="native_language" className={`font-bold text-gray-700 ${labelSize}`}>
                  Native Language
                </Label>
                <Input
                  id="native_language"
                  type="text"
                  value={formData.native_language || ''}
                  onChange={(e) => onInputChange('native_language', e.target.value)}
                  placeholder="e.g., English"
                  className="border-teal-300 border-2"
                />
              </div>
            </div>
          </div>
        </>
      )}


      {!hideTagline && (
        <div className="space-y-2">
          <Label htmlFor="tagline" className={`font-bold text-gray-700 ${labelSize}`}>
            Tagline <span className="text-gray-500 font-normal">(Maximum 100 Characters)</span>
          </Label>
          <Textarea
            id="tagline"
            value={formData.tagline}
            onChange={(e) => onInputChange('tagline', e.target.value)}
            placeholder="Enter a brief tagline"
            maxLength={100}
            rows={2}
            className="resize-none border-amber-border border-2"
          />
          <div className="text-right text-sm text-gray-500">
            {formData.tagline.length}/100
          </div>
        </div>
      )}

      {!hideExcerpt && (
        <div className="space-y-2">
          <Label htmlFor="excerpt" className={`font-bold text-gray-700 ${labelSize}`}>
            Excerpt
          </Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => onInputChange('excerpt', e.target.value)}
            placeholder="Write a brief, engaging description that will make readers want to read your story..."
            rows={compact ? 2 : 3}
            className="border-amber-border border-2"
          />
        </div>
      )}

      {!compact && (
        <div className="space-y-2">
          <Label htmlFor="published" className={`font-bold text-gray-700 ${labelSize}`}>
            Published Status
          </Label>
          <Select value={formData.published} onValueChange={(value) => onInputChange('published', value)}>
            <SelectTrigger className={`font-bold ${getPublishedColor(formData.published)}`}>
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
