
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StoryPhotoUploadProps {
  photoUrls: {
    photo_link_1: string;
    photo_link_2: string;
    photo_link_3: string;
  };
  onPhotoUpload: (photoNumber: 1 | 2 | 3, url: string) => void;
  onPhotoRemove: (photoNumber: 1 | 2 | 3) => void;
}

const StoryPhotoUpload: React.FC<StoryPhotoUploadProps> = ({
  photoUrls,
  onPhotoUpload,
  onPhotoRemove,
}) => {
  const [uploading, setUploading] = useState<{[key: number]: boolean}>({});

  const uploadPhoto = async (file: File, photoNumber: 1 | 2 | 3) => {
    try {
      setUploading(prev => ({ ...prev, [photoNumber]: true }));

      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `story-photos/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('story-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('story-photos')
        .getPublicUrl(filePath);

      onPhotoUpload(photoNumber, data.publicUrl);
      toast.success(`Photo ${photoNumber} uploaded successfully!`);
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error(`Failed to upload photo ${photoNumber}`);
    } finally {
      setUploading(prev => ({ ...prev, [photoNumber]: false }));
    }
  };

  const handleFileSelect = (file: File | null, photoNumber: 1 | 2 | 3) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    uploadPhoto(file, photoNumber);
  };

  const removePhoto = async (photoNumber: 1 | 2 | 3) => {
    const photoUrl = photoUrls[`photo_link_${photoNumber}` as keyof typeof photoUrls];
    
    if (photoUrl) {
      try {
        // Extract file path from URL
        const urlParts = photoUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `story-photos/${fileName}`;

        // Delete from storage
        const { error } = await supabase.storage
          .from('story-photos')
          .remove([filePath]);

        if (error) {
          console.error('Error deleting file:', error);
        }
      } catch (error) {
        console.error('Error removing photo:', error);
      }
    }

    onPhotoRemove(photoNumber);
    toast.success(`Photo ${photoNumber} removed`);
  };

  const renderPhotoUpload = (photoNumber: 1 | 2 | 3) => {
    const photoUrl = photoUrls[`photo_link_${photoNumber}` as keyof typeof photoUrls];
    const isUploading = uploading[photoNumber];

    return (
      <div key={photoNumber} className="space-y-2">
        <Label htmlFor={`photo-${photoNumber}`}>Photo {photoNumber}</Label>
        
        {photoUrl ? (
          <div className="relative">
            <img
              src={photoUrl}
              alt={`Story photo ${photoNumber}`}
              className="w-full h-32 object-cover rounded-md border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => removePhoto(photoNumber)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
            <Input
              id={`photo-${photoNumber}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0] || null, photoNumber)}
              disabled={isUploading}
            />
            <Label
              htmlFor={`photo-${photoNumber}`}
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              {isUploading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                <>
                  <Image className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600">Click to upload image</span>
                  <span className="text-xs text-gray-400">Max 5MB</span>
                </>
              )}
            </Label>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {renderPhotoUpload(1)}
      {renderPhotoUpload(2)}
      {renderPhotoUpload(3)}
    </div>
  );
};

export default StoryPhotoUpload;
