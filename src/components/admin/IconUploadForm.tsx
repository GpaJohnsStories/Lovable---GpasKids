import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, Plus } from 'lucide-react';

const IconUploadForm = () => {
  const [iconCode, setIconCode] = useState('');
  const [iconName, setIconName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async ({ file, code, name }: { file: File, code: string, name: string }) => {
      setIsUploading(true);
      
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${code}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('menu-icons')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Add to icon library
      const { error: dbError } = await supabase
        .from('icon_library')
        .insert({
          icon_code: code,
          icon_name: name,
          file_path: fileName
        });

      if (dbError) {
        throw new Error(`Database insert failed: ${dbError.message}`);
      }

      return { fileName, code, name };
    },
    onSuccess: (data) => {
      toast.success(`Icon "${data.name}" uploaded successfully!`);
      setIconCode('');
      setIconName('');
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['icon-library'] });
      setIsUploading(false);
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
      setIsUploading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !iconCode.trim() || !iconName.trim()) {
      toast.error('Please fill in all fields and select a file');
      return;
    }

    // Validate icon code format (alphanumeric with underscores/hyphens)
    if (!/^[a-zA-Z0-9_-]+$/.test(iconCode)) {
      toast.error('Icon code should only contain letters, numbers, underscores, and hyphens');
      return;
    }

    uploadMutation.mutate({
      file: selectedFile,
      code: iconCode,
      name: iconName
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (PNG, JPG, JPEG, or SVG)');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Upload New Icon
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="iconCode">Icon Code</Label>
              <Input
                id="iconCode"
                type="text"
                value={iconCode}
                onChange={(e) => setIconCode(e.target.value)}
                placeholder="e.g., home_icon"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="iconName">Icon Name</Label>
              <Input
                id="iconName"
                type="text"
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                placeholder="e.g., Home Icon"
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="iconFile">Icon File</Label>
            <Input
              id="iconFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1"
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground mt-1">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={isUploading || !selectedFile || !iconCode.trim() || !iconName.trim()}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Icon
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default IconUploadForm;