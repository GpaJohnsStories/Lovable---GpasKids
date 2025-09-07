import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Upload, Plus } from 'lucide-react';

const IconUploadForm = () => {
  const [iconCode, setIconCode] = useState('');
  const [iconName, setIconName] = useState('');
  const [fileExtension, setFileExtension] = useState('png');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPriority, setIsPriority] = useState(false);
  
  const queryClient = useQueryClient();

  // Generate filename based on icon code and extension
  const generateFileName = () => {
    if (!iconCode.trim()) return '';
    const prefix = isPriority ? '!' : '';
    return `${prefix}${iconCode}.${fileExtension}`;
  };

  const uploadMutation = useMutation({
    mutationFn: async ({ file, code, name }: { file: File, code: string, name: string }) => {
      setIsUploading(true);
      
      // Upload file to storage using the generated filename with priority prefix if needed
      const prefix = isPriority ? '!' : '';
      const fileName = `${prefix}${code}.${fileExtension}`;
      
      const { error: uploadError } = await supabase.storage
        .from('icons')
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
          icon_name: name,
          file_name_path: fileName
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
      setIsPriority(false);
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

    // Validate icon code format (3-8 chars, alphanumeric with underscores/hyphens)
    if (!/^[a-zA-Z0-9_-]{3,8}$/.test(iconCode)) {
      toast.error('Icon code should be 3-8 characters containing only letters, numbers, underscores, and hyphens');
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
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (PNG, JPG, JPEG, SVG, or GIF)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
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
          {/* Top row: Icon Code (1/3 width) + File Extension + Generated Filename */}
          <div className="flex items-end gap-4">
            <div className="w-1/3">
              <Label htmlFor="iconCode">Unique Icon Code</Label>
              <Input
                id="iconCode"
                type="text"
                value={iconCode}
                onChange={(e) => setIconCode(e.target.value)}
                placeholder="e.g., ICO-BK"
                className="mt-1"
              />
            </div>
            <div className="w-32">
              <Label htmlFor="fileExtension">File Extension</Label>
              <Select value={fileExtension} onValueChange={setFileExtension}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">png</SelectItem>
                  <SelectItem value="jpg">jpg</SelectItem>
                  <SelectItem value="gif">gif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>Generated Filename</Label>
              <div className="mt-1 px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground">
                {generateFileName() || 'Enter icon code to see filename'}
              </div>
            </div>
          </div>

          {/* Icon Name below on the left */}
          <div className="w-1/2">
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
          
          {/* Priority Icon Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isPriority" 
              checked={isPriority}
              onCheckedChange={(checked) => setIsPriority(checked as boolean)}
            />
            <Label htmlFor="isPriority" className="text-sm font-medium">
              Priority Icon (adds "!" prefix for preloading)
            </Label>
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