
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { VideoIcon, Trash2Icon, Upload } from 'lucide-react';

interface StoryVideoUploadProps {
  videoUrl: string;
  onVideoUpload: (url: string) => void;
  onVideoRemove: () => void;
  onDurationCalculated?: (duration: number) => void;
  onVideoFileUpload?: (file: File) => Promise<boolean>;
  isUploading?: boolean;
}

const StoryVideoUpload: React.FC<StoryVideoUploadProps> = ({
  videoUrl,
  onVideoUpload,
  onVideoRemove,
  onDurationCalculated,
  onVideoFileUpload,
  isUploading = false
}) => {
  const [inputUrl, setInputUrl] = useState(videoUrl || '');
  const [isCalculatingDuration, setIsCalculatingDuration] = useState(false);

  const extractVideoId = (url: string): { platform: string; id: string } | null => {
    // YouTube patterns
    const youtubePatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ];
    
    for (const pattern of youtubePatterns) {
      const match = url.match(pattern);
      if (match) return { platform: 'youtube', id: match[1] };
    }
    
    // Vimeo patterns
    const vimeoPattern = /vimeo\.com\/(?:video\/)?(\d+)/;
    const vimeoMatch = url.match(vimeoPattern);
    if (vimeoMatch) return { platform: 'vimeo', id: vimeoMatch[1] };
    
    return null;
  };

  const calculateVideoDuration = async (url: string): Promise<number | null> => {
    const videoInfo = extractVideoId(url);
    if (!videoInfo) return null;

    try {
      if (videoInfo.platform === 'youtube') {
        // For YouTube, we'd need YouTube API key - for now, return null
        // In production, you'd implement YouTube Data API v3 call here
        console.log('YouTube video detected, duration calculation would require API key');
        return null;
      } else if (videoInfo.platform === 'vimeo') {
        // For Vimeo, we can use their oEmbed API
        const response = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`);
        if (response.ok) {
          const data = await response.json();
          return data.duration || null;
        }
      }
    } catch (error) {
      console.error('Error calculating video duration:', error);
    }
    
    return null;
  };

  const handleUrlSubmit = async () => {
    if (!inputUrl.trim()) {
      toast.error('Please enter a video URL');
      return;
    }

    const videoInfo = extractVideoId(inputUrl);
    if (!videoInfo) {
      toast.error('Please enter a valid YouTube or Vimeo URL');
      return;
    }

    setIsCalculatingDuration(true);
    
    try {
      // Calculate duration if possible
      const duration = await calculateVideoDuration(inputUrl);
      
      // Update the video URL
      onVideoUpload(inputUrl);
      
      // If we got a duration, notify parent component
      if (duration && onDurationCalculated) {
        onDurationCalculated(duration);
        toast.success(`Video added with duration: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`);
      } else {
        toast.success('Video URL added successfully');
      }
    } catch (error) {
      console.error('Error processing video:', error);
      toast.error('Error processing video URL');
    } finally {
      setIsCalculatingDuration(false);
    }
  };

  const handleRemove = () => {
    setInputUrl('');
    onVideoRemove();
    if (onDurationCalculated) {
      onDurationCalculated(0);
    }
    toast.success('Video removed');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onVideoFileUpload) return;

    try {
      const success = await onVideoFileUpload(file);
      if (success) {
        setInputUrl(''); // Clear preview URL since we now have bucket URL
        toast.success('MP4 video uploaded successfully!');
      }
    } catch (error) {
      console.error('Video upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload video');
    }
    
    // Reset file input
    event.target.value = '';
  };

  return (
    <div className="space-y-4">
      {/* MP4 File Upload (Recommended) */}
      {onVideoFileUpload && (
        <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
          <Label className="text-base font-medium text-green-800 mb-2 block">
            Upload MP4 to Library (Recommended)
          </Label>
          <p className="text-sm text-green-700 mb-3">
            Upload your MP4 video file directly to our secure library. Max size: 100MB
          </p>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept=".mp4,video/mp4"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
            />
            {isUploading && (
              <div className="text-sm text-green-600">Uploading...</div>
            )}
          </div>
        </div>
      )}

      {/* External Link Preview (not saved to database) */}
      <div className="p-4 border rounded-lg bg-gray-50">
        <Label htmlFor="video-url" className="text-base font-medium text-gray-700 mb-2 block">
          Alternate Link (Preview Only)
        </Label>
        <p className="text-xs text-gray-600 mb-3">
          For preview purposes only. This link will not be saved to the database.
        </p>
        <div className="flex gap-2">
          <Input
            id="video-url"
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://example.com/video.mp4"
            className="flex-1 text-sm"
          />
          <Button 
            onClick={handleUrlSubmit}
            disabled={!inputUrl.trim() || isCalculatingDuration}
            size="sm"
            variant="outline"
          >
            {isCalculatingDuration ? 'Processing...' : 'Preview'}
          </Button>
        </div>
      </div>

      {videoUrl && (
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <VideoIcon className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-blue-700">
              {videoUrl.includes('supabase') ? 'Video file uploaded to library' : 'Video URL set (preview only)'}
            </span>
          </div>
          <Button
            onClick={handleRemove}
            variant="destructive"
            size="sm"
          >
            <Trash2Icon className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

export default StoryVideoUpload;
