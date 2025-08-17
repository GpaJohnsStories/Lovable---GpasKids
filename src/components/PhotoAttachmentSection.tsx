
import React from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Camera } from 'lucide-react';

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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    onFileChange(selectedFile);
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
          JPEG, PNG, or WebP files only. Max 10MB.
        </p>
      </div>

      {file && (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded border border-orange-200">
            <div>
              <p className="text-sm font-medium text-gray-700">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
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
