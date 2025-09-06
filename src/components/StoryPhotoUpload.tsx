
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface StoryPhotoUploadProps {
  photoUrls: {
    photo_link_1: string;
    photo_link_2: string;
    photo_link_3: string;
  };
  photoAlts: {
    photo_alt_1: string;
    photo_alt_2: string;
    photo_alt_3: string;
  };
  storyCode?: string; // Required for deterministic photo paths
  onPhotoUpload: (photoNumber: 1 | 2 | 3, url: string) => void;
  onPhotoRemove: (photoNumber: 1 | 2 | 3) => void;
  onAltTextChange: (field: string, value: string) => void;
}

const StoryPhotoUpload: React.FC<StoryPhotoUploadProps> = ({
  photoUrls,
  photoAlts,
  storyCode,
  onPhotoUpload,
  onPhotoRemove,
  onAltTextChange
}) => {
  const [uploading, setUploading] = useState<{ [key: number]: boolean }>({});

  const resizeImageToWebP = (file: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        // Set canvas size
        canvas.width = width;
        canvas.height = height;
        
        // Draw and resize image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert canvas to WebP blob
        canvas.toBlob((blob) => {
          if (blob) {
            // Create new WebP file
            const webpFile = new File([blob], 'photo.webp', {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(webpFile);
          }
        }, 'image/webp', quality);
      };
      
      // Load the image
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (file: File, photoNumber: 1 | 2 | 3) => {
    console.log('🖼️ Photo upload started for photo', photoNumber, 'with file:', file);
    
    if (!file) {
      console.log('❌ No file provided');
      return;
    }

    if (!storyCode?.trim()) {
      toast.error('Story code is required before uploading photos. Please save the story first.');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('❌ Invalid file type:', file.type);
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 10MB for original, will be reduced after resize)
    if (file.size > 10 * 1024 * 1024) {
      console.log('❌ File too large:', file.size);
      toast.error('Image size must be less than 10MB');
      return;
    }

    console.log('✅ File validation passed, starting upload process');

    setUploading(prev => ({ ...prev, [photoNumber]: true }));

    try {
      // Resize and convert to WebP
      console.log('🔄 Starting image resize and WebP conversion...');
      toast.info('Resizing and optimizing image...');
      const webpFile = await resizeImageToWebP(file, 800, 600, 0.85);
      console.log('✅ Image converted to WebP:', {
        originalSize: (file.size / 1024 / 1024).toFixed(2) + 'MB',
        webpSize: (webpFile.size / 1024 / 1024).toFixed(2) + 'MB'
      });
      
      // Use deterministic filename: stories/{STORY_CODE}/photo-{1|2|3}.webp
      const fileName = `stories/${storyCode.trim()}/photo-${photoNumber}.webp`;
      console.log('📝 Using deterministic filename:', fileName);

      // Upload WebP file to Supabase storage with upsert to replace existing
      console.log('☁️ Starting upload to Supabase storage...');
      const { data, error } = await supabase.storage
        .from('story-photos')
        .upload(fileName, webpFile, {
          contentType: 'image/webp',
          upsert: true, // Replace existing file
          cacheControl: '3600' // 1 hour cache
        });

      console.log('📤 Upload response:', { data, error });

      if (error) {
        console.error('❌ Upload failed:', error);
        throw error;
      }

      // Get public URL
      console.log('🔗 Getting public URL...');
      const { data: { publicUrl } } = supabase.storage
        .from('story-photos')
        .getPublicUrl(fileName);

      console.log('✅ Public URL generated:', publicUrl);
      onPhotoUpload(photoNumber, publicUrl);
      toast.success(`Photo optimized and uploaded! Original: ${(file.size / 1024 / 1024).toFixed(1)}MB → WebP: ${(webpFile.size / 1024 / 1024).toFixed(1)}MB`);
    } catch (error) {
      console.error('❌ Upload error details:', error);
      console.error('Error message:', error instanceof Error ? error.message : error);
      toast.error(`Failed to upload photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      console.log('🏁 Upload process completed');
      setUploading(prev => ({ ...prev, [photoNumber]: false }));
    }
  };

  const handleUrlInput = (photoNumber: 1 | 2 | 3, url: string) => {
    onPhotoUpload(photoNumber, url);
  };

  const renderPhotoSection = (photoNumber: 1 | 2 | 3) => {
    const photoUrl = photoUrls[`photo_link_${photoNumber}` as keyof typeof photoUrls];
    const photoAlt = photoAlts[`photo_alt_${photoNumber}` as keyof typeof photoAlts];
    const isUploading = uploading[photoNumber];

    return (
      <Card key={photoNumber} className="p-0 w-full h-full overflow-hidden">
        <CardContent className="space-y-4 p-0">
          <div className="flex items-center justify-between px-4 pt-4">
            <Label className="text-sm font-bold">Photo {photoNumber}</Label>
            {photoUrl && (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={async () => {
                  try {
                    await onPhotoRemove(photoNumber);
                    toast.success('Photo removed successfully');
                  } catch (error) {
                    toast.error(`Failed to remove photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
                  }
                }}
              >
                <X className="h-3 w-3 mr-1" />
                Remove
              </Button>
            )}
          </div>

          {photoUrl ? (
            <div className="space-y-3">
              <div className="w-full flex justify-center">
                  <img
                    src={photoUrl}
                    alt={photoAlt || `Story photo ${photoNumber}`}
                    className="max-h-[420px] w-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
               <div className="bg-amber-50 p-3 rounded-lg border mx-4 mb-4">
                 <Label htmlFor={`alt_${photoNumber}`} className="text-sm font-medium text-orange-800">
                   📝 Picture Description/Alt Text (required for accessibility)
                 </Label>
                 <p className="text-xs text-orange-600 mb-2">
                   Describe what's in this photo for children who can't see the image
                 </p>
                 <Input
                   id={`alt_${photoNumber}`}
                   value={photoAlt}
                   onChange={(e) => onAltTextChange(`photo_alt_${photoNumber}`, e.target.value)}
                   placeholder="Example: A smiling child playing with toys in a sunny park"
                   className="mt-1"
                 />
               </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-gray-300 p-4 text-center w-full rounded-none mb-4">
                <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-3">
                  Upload an image (image file is resized to reduce size; display is fit to prevent cropping)
                </p>
                
                <div className="space-y-3">
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        console.log('📁 File input change event triggered');
                        const file = e.target.files?.[0];
                        console.log('📁 Selected file:', file ? file.name : 'No file selected');
                        if (file) {
                          console.log('📁 Starting file upload process for:', file.name);
                          handleFileUpload(file, photoNumber);
                        } else {
                          console.log('❌ No file was selected');
                        }
                      }}
                      className="mb-2"
                      disabled={isUploading}
                    />
                    {isUploading && (
                      <p className="text-sm text-blue-600">Uploading...</p>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500">or</div>
                  
                  <Input
                    placeholder="Enter image URL"
                    onChange={(e) => handleUrlInput(photoNumber, e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {[1, 2, 3].map(photoNumber => renderPhotoSection(photoNumber as 1 | 2 | 3))}
      </div>
    </div>
  );
};

export default StoryPhotoUpload;
