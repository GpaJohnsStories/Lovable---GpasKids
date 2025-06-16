
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import RichTextEditor from "./RichTextEditor";
import StoryFormFields from "./StoryFormFields";
import StoryPhotoUpload from "./StoryPhotoUpload";
import StoryFormActions from "./StoryFormActions";

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
  const [formData, setFormData] = useState<Story>({
    title: '',
    author: 'Grandpa John',
    category: 'Fun',
    content: '',
    tagline: '',
    excerpt: '',
    story_code: '',
    google_drive_link: '',
    photo_link_1: '',
    photo_link_2: '',
    photo_link_3: '',
    published: 'N'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (story) {
      setFormData(story);
    }
  }, [story]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (story?.id) {
        // Update existing story
        const { error } = await supabase
          .from('stories')
          .update(formData)
          .eq('id', story.id);
        
        if (error) throw error;
        toast.success("Story updated successfully!");
      } else {
        // Create new story
        const { error } = await supabase
          .from('stories')
          .insert([formData]);
        
        if (error) throw error;
        toast.success("Story created successfully!");
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving story:', error);
      toast.error("Error saving story");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof Story, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (photoNumber: 1 | 2 | 3, url: string) => {
    handleInputChange(`photo_link_${photoNumber}` as keyof Story, url);
  };

  const handlePhotoRemove = (photoNumber: 1 | 2 | 3) => {
    handleInputChange(`photo_link_${photoNumber}` as keyof Story, '');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-orange-800">
          {story ? 'Edit Story' : 'Create New Story'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <StoryFormFields 
            formData={formData} 
            onInputChange={handleInputChange} 
          />

          <div>
            <Label htmlFor="content">Story Content *</Label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => handleInputChange('content', content)}
              placeholder="Write your story here..."
            />
          </div>

          <div>
            <Label className="text-base font-medium text-gray-700 mb-4 block">Story Photos</Label>
            <StoryPhotoUpload
              photoUrls={{
                photo_link_1: formData.photo_link_1,
                photo_link_2: formData.photo_link_2,
                photo_link_3: formData.photo_link_3,
              }}
              onPhotoUpload={handlePhotoUpload}
              onPhotoRemove={handlePhotoRemove}
            />
          </div>

          <StoryFormActions 
            isLoading={isLoading} 
            onCancel={onCancel} 
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default StoryForm;
