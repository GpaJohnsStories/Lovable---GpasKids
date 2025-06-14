
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import RichTextEditor from "./RichTextEditor";
import { Save, X } from "lucide-react";

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
    photo_link_3: ''
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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-orange-800">
          {story ? 'Edit Story' : 'Create New Story'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                placeholder="Enter story title"
              />
            </div>
            
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder="Author name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value as any)}
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
                onChange={(e) => handleInputChange('story_code', e.target.value)}
                placeholder="Optional story code"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={formData.tagline}
              onChange={(e) => handleInputChange('tagline', e.target.value)}
              placeholder="Brief tagline for the story"
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Input
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              placeholder="Short description for story cards"
            />
          </div>

          <div>
            <Label htmlFor="content">Story Content *</Label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => handleInputChange('content', content)}
              placeholder="Write your story here..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="google_drive_link">Google Drive Link</Label>
              <Input
                id="google_drive_link"
                value={formData.google_drive_link}
                onChange={(e) => handleInputChange('google_drive_link', e.target.value)}
                placeholder="Google Drive link"
              />
            </div>

            <div>
              <Label htmlFor="photo_link_1">Photo Link 1</Label>
              <Input
                id="photo_link_1"
                value={formData.photo_link_1}
                onChange={(e) => handleInputChange('photo_link_1', e.target.value)}
                placeholder="Photo URL"
              />
            </div>

            <div>
              <Label htmlFor="photo_link_2">Photo Link 2</Label>
              <Input
                id="photo_link_2"
                value={formData.photo_link_2}
                onChange={(e) => handleInputChange('photo_link_2', e.target.value)}
                placeholder="Photo URL"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="photo_link_3">Photo Link 3</Label>
            <Input
              id="photo_link_3"
              value={formData.photo_link_3}
              onChange={(e) => handleInputChange('photo_link_3', e.target.value)}
              placeholder="Photo URL"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="cozy-button">
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Story'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StoryForm;
