
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Play, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StoryVideoUploadProps {
  videoUrl: string;
  onVideoUpload: (url: string) => void;
  onVideoRemove: () => void;
}

const StoryVideoUpload: React.FC<StoryVideoUploadProps> = ({
  videoUrl,
  onVideoUpload,
  onVideoRemove
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a valid video file (MP4, WebM, MOV, or AVI)");
      return;
    }

    // Validate file size (100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Video file size must be less than 100MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      const { data, error } = await supabase.storage
        .from('story-videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('story-videos')
        .getPublicUrl(filePath);

      onVideoUpload(publicUrl);
      toast.success("Video uploaded successfully!");
    } catch (error: any) {
      console.error('Error uploading video:', error);
      toast.error(`Failed to upload video: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveVideo = async () => {
    if (!videoUrl) return;

    try {
      // Extract file path from URL
      const urlParts = videoUrl.split('/');
      const filePath = urlParts.slice(-2).join('/'); // Get "videos/filename.ext"

      const { error } = await supabase.storage
        .from('story-videos')
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        toast.error("Failed to delete video file");
      }

      onVideoRemove();
      toast.success("Video removed successfully!");
    } catch (error: any) {
      console.error('Error removing video:', error);
      toast.error(`Failed to remove video: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="video-upload" className="text-base font-bold text-gray-700">
        Story Video (Optional)
      </Label>
      
      {videoUrl ? (
        <div className="space-y-3">
          <div className="relative">
            <video
              src={videoUrl}
              controls
              className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-200"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemoveVideo}
            className="flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Remove Video</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="video-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mb-2"></div>
                    <p className="text-sm text-gray-500">Uploading video...</p>
                    {uploadProgress > 0 && (
                      <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload video</span>
                    </p>
                    <p className="text-xs text-gray-500">MP4, WebM, MOV, or AVI (MAX. 100MB)</p>
                  </>
                )}
              </div>
              <input
                id="video-upload"
                type="file"
                className="hidden"
                accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                onChange={handleVideoUpload}
                disabled={isUploading}
              />
            </label>
          </div>
          
          <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Video Guidelines:</p>
              <ul className="text-xs space-y-1">
                <li>• Maximum file size: 100MB</li>
                <li>• Supported formats: MP4, WebM, MOV, AVI</li>
                <li>• Videos will be publicly accessible but not downloadable</li>
                <li>• Keep content appropriate for children</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryVideoUpload;
