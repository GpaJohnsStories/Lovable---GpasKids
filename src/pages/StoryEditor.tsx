
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Story {
  id?: string;
  story_code: string;
  title: string;
  author: string;
  category: 'Fun' | 'Life' | 'North Pole' | 'World Changers';
  google_drive_link?: string;
  tagline?: string;
  excerpt?: string;
  content?: string;
  photo_link_1?: string;
  photo_link_2?: string;
  photo_link_3?: string;
}

const StoryEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<Story>({
    story_code: '',
    title: '',
    author: 'Grandpa',
    category: 'Fun',
    tagline: '',
    excerpt: '',
    content: '',
    google_drive_link: '',
    photo_link_1: '',
    photo_link_2: '',
    photo_link_3: ''
  });

  const isEditing = id !== 'new';

  useEffect(() => {
    if (isEditing) {
      fetchStory();
    }
  }, [id]);

  const fetchStory = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) setStory(data);
    } catch (error) {
      console.error('Error fetching story:', error);
      toast({
        title: "Error",
        description: "Failed to load story",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('stories')
          .update(story)
          .eq('id', id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Story updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('stories')
          .insert([story]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Story created successfully"
        });
      }
      
      navigate('/admin');
    } catch (error) {
      console.error('Error saving story:', error);
      toast({
        title: "Error",
        description: "Failed to save story",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !window.confirm('Are you sure you want to delete this story?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Story deleted successfully"
      });
      
      navigate('/admin');
    } catch (error) {
      console.error('Error deleting story:', error);
      toast({
        title: "Error",
        description: "Failed to delete story",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof Story, value: string) => {
    setStory(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-amber-800">
              {isEditing ? 'Edit Story' : 'Create New Story'}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-amber-800">Story Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="story_code">Story Code</Label>
                  <Input
                    id="story_code"
                    value={story.story_code}
                    onChange={(e) => updateField('story_code', e.target.value)}
                    placeholder="e.g., MG001"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={story.category} onValueChange={(value) => updateField('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fun">Fun</SelectItem>
                      <SelectItem value="Life">Life</SelectItem>
                      <SelectItem value="North Pole">North Pole</SelectItem>
                      <SelectItem value="World Changers">World Changers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={story.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Story title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={story.author}
                  onChange={(e) => updateField('author', e.target.value)}
                  placeholder="Author name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={story.tagline || ''}
                  onChange={(e) => updateField('tagline', e.target.value)}
                  placeholder="Short tagline for the story"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={story.excerpt || ''}
                  onChange={(e) => updateField('excerpt', e.target.value)}
                  placeholder="Brief description of the story"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Full Story Content</Label>
                <Textarea
                  id="content"
                  value={story.content || ''}
                  onChange={(e) => updateField('content', e.target.value)}
                  placeholder="Write the full story content here. You can paste formatted text or write directly. Use line breaks for paragraphs."
                  rows={15}
                  className="font-serif text-base leading-relaxed"
                />
                <p className="text-sm text-gray-600">
                  Tip: You can paste formatted text here. Use double line breaks to separate paragraphs.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="google_drive_link">Google Drive Link (Optional)</Label>
                <Input
                  id="google_drive_link"
                  value={story.google_drive_link || ''}
                  onChange={(e) => updateField('google_drive_link', e.target.value)}
                  placeholder="Link to the full story document (if you want to provide an alternative link)"
                />
                <p className="text-sm text-gray-600">
                  If you add story content above, this link becomes optional as readers can read the full story directly on the page.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-amber-800">Photo Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="photo_link_1">Photo 1 URL</Label>
                    <Input
                      id="photo_link_1"
                      value={story.photo_link_1 || ''}
                      onChange={(e) => updateField('photo_link_1', e.target.value)}
                      placeholder="First photo URL"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="photo_link_2">Photo 2 URL</Label>
                    <Input
                      id="photo_link_2"
                      value={story.photo_link_2 || ''}
                      onChange={(e) => updateField('photo_link_2', e.target.value)}
                      placeholder="Second photo URL"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="photo_link_3">Photo 3 URL</Label>
                    <Input
                      id="photo_link_3"
                      value={story.photo_link_3 || ''}
                      onChange={(e) => updateField('photo_link_3', e.target.value)}
                      placeholder="Third photo URL"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <div>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Story
                    </Button>
                  )}
                </div>
                
                <Button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-700">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : (isEditing ? 'Update Story' : 'Create Story')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StoryEditor;
