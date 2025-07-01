
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

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

  const handleFileUpload = async (file: File, photoNumber: 1 | 2 | 3) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(prev => ({ ...prev, [photoNumber]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onPhotoUpload(photoNumber, data.url);
      toast.success('Photo uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload photo. Please try again.');
    } finally {
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
            <Label className="text-sm font-medium">Photo {photoNumber}</Label>
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
              <div>
                <Label htmlFor={`alt_${photoNumber}`} className="text-sm">
                  Picture Label (what children will see)
                </Label>
                <Input
                  id={`alt_${photoNumber}`}
                  value={photoAlt}
                  onChange={(e) => onAltTextChange(`photo_alt_${photoNumber}`, e.target.value)}
                  placeholder="Describe what's in this photo"
                  className="mt-1"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-3">
                  Upload an image or enter a URL
                </p>
                
                <div className="space-y-3">
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, photoNumber);
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
