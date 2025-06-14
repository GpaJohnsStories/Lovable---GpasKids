
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, BookOpen } from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";

const BuddysStoryEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [story, setStory] = useState({
    title: '',
    author: '',
    category: '',
    tagline: '',
    excerpt: '',
    content: '',
    story_code: '',
    google_drive_link: '',
    photo_link_1: '',
    photo_link_2: '',
    photo_link_3: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      loadStory();
    }
  }, [id, isNew]);

  const loadStory = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast.error("Error loading story");
      console.error(error);
      navigate('/buddys_admin');
    } else {
      setStory(data);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!story.title || !story.author || !story.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);

    try {
      if (isNew) {
        const { error } = await supabase
          .from('stories')
          .insert([story]);

        if (error) throw error;
        toast.success("Story created successfully!");
      } else {
        const { error } = await supabase
          .from('stories')
          .update(story)
          .eq('id', id);

        if (error) throw error;
        toast.success("Story updated successfully!");
      }

      navigate('/buddys_admin');
    } catch (error) {
      toast.error("Error saving story");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setStory(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-orange-700 text-lg">Loading story...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button 
            onClick={() => navigate('/buddys_admin')}
            variant="outline" 
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
          <h1 className="text-3xl font-bold text-orange-800">
            {isNew ? 'Create New Story' : 'Edit Story'}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-orange-800">Story Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Title *
                </label>
                <Input
                  value={story.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Story title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Author *
                </label>
                <Input
                  value={story.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder="Author name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Category *
                </label>
                <Select value={story.category} onValueChange={(value) => handleInputChange('category', value)}>
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
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Story Code
                </label>
                <Input
                  value={story.story_code}
                  onChange={(e) => handleInputChange('story_code', e.target.value)}
                  placeholder="Story code"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-700 mb-2">
                Tagline
              </label>
              <Input
                value={story.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                placeholder="Brief tagline for the story"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-700 mb-2">
                Excerpt
              </label>
              <Input
                value={story.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                placeholder="Short excerpt"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-700 mb-2">
                Google Drive Link
              </label>
              <Input
                value={story.google_drive_link}
                onChange={(e) => handleInputChange('google_drive_link', e.target.value)}
                placeholder="Google Drive link"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Photo Link 1
                </label>
                <Input
                  value={story.photo_link_1}
                  onChange={(e) => handleInputChange('photo_link_1', e.target.value)}
                  placeholder="Photo URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Photo Link 2
                </label>
                <Input
                  value={story.photo_link_2}
                  onChange={(e) => handleInputChange('photo_link_2', e.target.value)}
                  placeholder="Photo URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Photo Link 3
                </label>
                <Input
                  value={story.photo_link_3}
                  onChange={(e) => handleInputChange('photo_link_3', e.target.value)}
                  placeholder="Photo URL"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-700 mb-2">
                Content
              </label>
              <RichTextEditor
                value={story.content}
                onChange={(value) => handleInputChange('content', value)}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => navigate('/buddys_admin')}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="cozy-button"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Story'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BuddysStoryEditor;
