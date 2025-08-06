
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, FileAudio, Loader, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AudioUploadSectionProps {
  audioUrl?: string;
  onAudioUpload: (url: string) => void;
  onAudioRemove: () => void;
}

const AudioUploadSection: React.FC<AudioUploadSectionProps> = ({
  audioUrl,
  onAudioUpload,
  onAudioRemove
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a valid audio file (MP3, WAV, OGG, M4A)");
      return;
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Audio file must be less than 50MB");
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('story-audio')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('story-audio')
        .getPublicUrl(fileName);

      onAudioUpload(data.publicUrl);
      toast.success("Audio uploaded successfully!");

    } catch (error: any) {
      console.error('Error uploading audio:', error);
      toast.error(`Error uploading audio: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAudio = () => {
    onAudioRemove();
    toast.success("Audio removed successfully!");
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="audio-upload" className="text-base font-bold text-gray-700">
        Story Audio (Optional)
      </Label>
      
      {audioUrl ? (
        <div className="space-y-3">
          <div className="border-2 rounded-lg p-4" style={{ borderColor: '#4A7C59' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <FileAudio className="h-5 w-5" style={{ color: '#4A7C59' }} />
                <span className="text-sm font-medium">Audio file uploaded</span>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemoveAudio}
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
            
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="audio-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              style={{ borderColor: '#4A7C59' }}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mb-2"></div>
                    <p className="text-sm text-gray-500">Uploading audio...</p>
                  </>
                ) : (
                  <>
                    <FileAudio className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload audio</span>
                    </p>
                    <p className="text-xs text-gray-500">MP3, WAV, OGG, M4A (MAX. 50MB)</p>
                  </>
                )}
              </div>
              <input
                id="audio-upload"
                type="file"
                className="hidden"
                accept="audio/*"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          </div>
          
          <div className="flex items-start space-x-2 p-3 rounded-lg" style={{ backgroundColor: '#f0f9f0' }}>
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: '#4A7C59' }} />
            <div className="text-sm" style={{ color: '#2d5a3d' }}>
              <p className="font-medium mb-1">Audio Guidelines:</p>
              <ul className="text-xs space-y-1">
                <li>• Maximum file size: 50MB</li>
                <li>• Supported formats: MP3, WAV, OGG, M4A</li>
                <li>• Audio will be publicly accessible but not downloadable</li>
                <li>• Keep content appropriate for children</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioUploadSection;
