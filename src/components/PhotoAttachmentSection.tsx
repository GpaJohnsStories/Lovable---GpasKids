
import React, { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Camera, ImageIcon } from 'lucide-react';

interface PhotoAttachmentSectionProps {
  file: File | null;
  caption: string;
  onFileChange: (file: File | null) => void;
  onCaptionChange: (caption: string) => void;
  disabled?: boolean;
}

const PhotoAttachmentSection: React.FC<PhotoAttachmentSectionProps> = ({
  file,
  caption,
  onFileChange,
  onCaptionChange,
  disabled = false
}) => {
  const [isCompressing, setIsCompressing] = useState(false);

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate dimensions (max 1600px on longest side)
        const maxDimension = 1600;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.webp', {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file); // Fallback to original
            }
          },
          'image/webp',
          0.8
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    
    if (!selectedFile) {
      onFileChange(null);
      return;
    }

    // Check if compression is needed (over 600KB)
    if (selectedFile.size > 600 * 1024) {
      setIsCompressing(true);
      try {
        const compressedFile = await compressImage(selectedFile);
        onFileChange(compressedFile);
      } catch (error) {
        console.warn('Compression failed, using original:', error);
        onFileChange(selectedFile);
      } finally {
        setIsCompressing(false);
      }
    } else {
      onFileChange(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    onFileChange(null);
    onCaptionChange('');
  };

  return (
    <div className="space-y-4 p-4 border border-orange-200 rounded-lg bg-orange-50">
      <div className="flex items-center gap-2">
        <Camera className="w-5 h-5 text-orange-600" />
        <h3 className="font-semibold text-orange-800">
          Orange Shirt Gang Photo (Optional)
        </h3>
      </div>
      
      <p className="text-sm text-orange-700">
        Got a photo of yourself in an orange shirt? Share it with Grandpa's Orange Shirt Gang!
      </p>

      <div>
        <Label htmlFor="photo-attachment" className="text-sm font-medium text-gray-700">
          Upload Photo
        </Label>
        <Input
          id="photo-attachment"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={disabled}
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          JPEG, PNG, or WebP files. Large images will be automatically compressed to WebP format.
        </p>
        {isCompressing && (
          <div className="flex items-center gap-2 mt-2 text-xs text-orange-600">
            <ImageIcon className="w-3 h-3 animate-pulse" />
            <span>Compressing image for faster upload...</span>
          </div>
        )}
      </div>

      {file && (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded border border-orange-200">
            <div>
              <p className="text-sm font-medium text-gray-700">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(0)} KB
                {file.type === 'image/webp' && file.size < 600 * 1024 && (
                  <span className="text-green-600 ml-1">✓ Optimized</span>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              disabled={disabled}
              className="text-red-600 hover:text-red-800 text-sm underline"
            >
              Remove
            </button>
          </div>

          <div>
            <Label htmlFor="photo-caption" className="text-sm font-medium text-gray-700">
              Photo Caption (Optional)
            </Label>
            <Textarea
              id="photo-caption"
              value={caption}
              onChange={(e) => onCaptionChange(e.target.value)}
              placeholder="Tell us about your orange shirt photo..."
              maxLength={200}
              disabled={disabled}
              className="mt-1"
              rows={2}
            />
            <p className="text-xs text-gray-500 mt-1">
              {caption.length}/200 characters
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoAttachmentSection;
