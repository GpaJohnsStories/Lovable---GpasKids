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
    bio_content: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (bio) {
      setFormData({
        author_name: bio.author_name || '',
        bio_content: bio.bio_content || ''
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
            bio_content: formData.bio_content.trim()
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
            bio_content: formData.bio_content.trim()
          });

        if (error) throw error;
        toast.success("Author bio created successfully");
      }

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