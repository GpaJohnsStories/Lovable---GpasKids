
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
  onPhotoUpload: (photoNumber: 1 | 2 | 3, url: string) => void;
  onPhotoRemove: (photoNumber: 1 | 2 | 3) => void;
  onAltTextChange: (field: string, value: string) => void;
}

const StoryPhotoUpload: React.FC<StoryPhotoUploadProps> = ({
  photoUrls,
  photoAlts,
  onPhotoUpload,
  onPhotoRemove,
  onAltTextChange
}) => {
  const [uploading, setUploading] = useState<{ [key: number]: boolean }>({});

  const resizeImage = (file: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.8): Promise<File> => {
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
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            // Create new file with same name and type
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          }
        }, file.type, quality);
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
      // Check admin status first
      const { data: session } = await supabase.auth.getSession();
      console.log('📝 Current session:', session?.session?.user?.id ? 'User logged in' : 'No user');
      
      const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin_safe');
      console.log('👑 Admin status check:', isAdmin, 'Error:', adminError);
      
      // Resize the image to prevent cropping and reduce file size
      console.log('🔄 Starting image resize...');
      toast.info('Resizing image...');
      const resizedFile = await resizeImage(file, 800, 600, 0.85);
      console.log('✅ Image resized:', {
        originalSize: (file.size / 1024 / 1024).toFixed(2) + 'MB',
        resizedSize: (resizedFile.size / 1024 / 1024).toFixed(2) + 'MB'
      });
      
      // Generate unique filename
      const fileExt = resizedFile.name.split('.').pop();
      const fileName = `story-photos/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      console.log('📝 Generated filename:', fileName);

      // Upload resized file to Supabase storage
      console.log('☁️ Starting upload to Supabase storage...');
      const { data, error } = await supabase.storage
        .from('story-photos')
        .upload(fileName, resizedFile);

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
      toast.success(`Photo resized and uploaded successfully! Original: ${(file.size / 1024 / 1024).toFixed(1)}MB → Resized: ${(resizedFile.size / 1024 / 1024).toFixed(1)}MB`);
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
      <Card key={photoNumber} className="p-4">
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold">Photo {photoNumber}</Label>
            {photoUrl && (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => onPhotoRemove(photoNumber)}
              >
                <X className="h-3 w-3 mr-1" />
                Remove
              </Button>
            )}
          </div>

          {photoUrl ? (
            <div className="space-y-3">
              <img
                src={photoUrl}
                alt={photoAlt || `Story photo ${photoNumber}`}
                className="w-full h-32 object-cover rounded border"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
               <div className="bg-amber-50 p-3 rounded-lg border">
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
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-3">
                  Upload an image (will be automatically resized to prevent cropping)
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(photoNumber => renderPhotoSection(photoNumber as 1 | 2 | 3))}
      </div>
    </div>
  );
};

export default StoryPhotoUpload;
