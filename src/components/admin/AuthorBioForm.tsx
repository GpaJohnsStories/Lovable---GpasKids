
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import RichTextEditor from "@/components/RichTextEditor";

interface AuthorBioFormProps {
  bio?: any;
  onBack: () => void;
  onSave: () => void;
  backButtonText?: string;
}

const AuthorBioForm = ({ bio, onBack, onSave, backButtonText = "Back to Bios" }: AuthorBioFormProps) => {
  const [formData, setFormData] = useState({
    author_name: '',
    bio_content: '',
    born_date: '',
    died_date: '',
    native_country_name: '',
    native_language: '',
    photo_url: '',
    photo_alt: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (bio) {
      setFormData({
        author_name: bio.author_name || '',
        bio_content: bio.bio_content || '',
        born_date: bio.born_date || '',
        died_date: bio.died_date || '',
        native_country_name: bio.native_country_name || '',
        native_language: bio.native_language || '',
        photo_url: bio.photo_url || '',
        photo_alt: bio.photo_alt || ''
      });
    }
  }, [bio]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.author_name.trim()) {
      toast.error("Author name is required");
      return;
    }

    setIsSaving(true);

    try {
      if (bio) {
        // Update existing bio
        const { error } = await supabase
          .from('author_bios')
          .update({
            author_name: formData.author_name.trim(),
            bio_content: formData.bio_content.trim(),
            born_date: formData.born_date || null,
            died_date: formData.died_date || null,
            native_country_name: formData.native_country_name.trim() || null,
            native_language: formData.native_language.trim() || null,
            photo_url: formData.photo_url.trim() || null,
            photo_alt: formData.photo_alt.trim() || null
          })
          .eq('id', bio.id);

        if (error) throw error;
        toast.success("Author bio updated successfully");
      } else {
        // Create new bio
        const { error } = await supabase
          .from('author_bios')
          .insert({
            author_name: formData.author_name.trim(),
            bio_content: formData.bio_content.trim(),
            born_date: formData.born_date || null,
            died_date: formData.died_date || null,
            native_country_name: formData.native_country_name.trim() || null,
            native_language: formData.native_language.trim() || null,
            photo_url: formData.photo_url.trim() || null,
            photo_alt: formData.photo_alt.trim() || null
          });

        if (error) throw error;
        toast.success("Author bio created successfully");
      }

      // Call the onSave callback which will handle navigation
      onSave();
    } catch (error: any) {
      console.error('Error saving author bio:', error);
      if (error.code === '23505') {
        toast.error("An author with this name already exists");
      } else {
        toast.error("Error saving author bio");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const wordCount = formData.bio_content.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {backButtonText}
          </Button>
          <CardTitle>
            {bio ? `Edit Bio: ${bio.author_name}` : 'Create New Author Bio'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="author_name">Author Name</Label>
          <Input
            id="author_name"
            value={formData.author_name}
            onChange={(e) => handleInputChange('author_name', e.target.value)}
            placeholder="Enter author's name"
            disabled={!!bio} // Disable editing name for existing bios to maintain consistency
          />
          {bio && (
            <p className="text-sm text-muted-foreground">
              Author name cannot be changed for existing bios to maintain story links
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="born_date">Born Date</Label>
            <Input
              id="born_date"
              type="date"
              value={formData.born_date}
              onChange={(e) => handleInputChange('born_date', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="died_date">Died Date</Label>
            <Input
              id="died_date"
              type="date"
              value={formData.died_date}
              onChange={(e) => handleInputChange('died_date', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="native_country_name">Native Country</Label>
            <Input
              id="native_country_name"
              value={formData.native_country_name}
              onChange={(e) => handleInputChange('native_country_name', e.target.value)}
              placeholder="e.g., United States"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="native_language">Native Language</Label>
            <Input
              id="native_language"
              value={formData.native_language}
              onChange={(e) => handleInputChange('native_language', e.target.value)}
              placeholder="e.g., English"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="photo_url">Photo URL</Label>
            <Input
              id="photo_url"
              value={formData.photo_url}
              onChange={(e) => handleInputChange('photo_url', e.target.value)}
              placeholder="https://example.com/author-photo.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo_alt">Photo Description</Label>
            <Input
              id="photo_alt"
              value={formData.photo_alt}
              onChange={(e) => handleInputChange('photo_alt', e.target.value)}
              placeholder="Description of the author's photo"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="bio_content">Biography</Label>
            <span className={`text-sm ${wordCount > 1000 ? 'text-destructive' : wordCount > 500 ? 'text-orange-600' : 'text-muted-foreground'}`}>
              {wordCount} words {wordCount > 500 && `(${wordCount > 1000 ? 'over limit!' : 'consider keeping under 500'})`}
            </span>
          </div>
          <RichTextEditor
            content={formData.bio_content}
            onChange={(content) => handleInputChange('bio_content', content)}
            placeholder="Enter the author's biography..."
          />
          <p className="text-sm text-muted-foreground">
            Ideal length: under 500 words. Maximum recommended: 1000 words.
          </p>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="cozy-button"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Bio'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthorBioForm;
