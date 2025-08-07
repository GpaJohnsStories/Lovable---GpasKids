
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X, FileAudio, Loader } from "lucide-react";
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
      {!audioUrl ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <FileAudio className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Upload Audio File
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Support for MP3, WAV, OGG, M4A files up to 50MB
          </p>
          
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
            id="audio-upload"
            disabled={isUploading}
          />
          
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('audio-upload')?.click()}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Choose Audio File
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <FileAudio className="h-5 w-5 text-green-600" />
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
          
          <div className="mt-3 text-xs text-gray-500">
            <p>Audio URL: {audioUrl}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioUploadSection;
