
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { VideoIcon, Trash2Icon } from 'lucide-react';

interface StoryVideoUploadProps {
  videoUrl: string;
  onVideoUpload: (url: string) => void;
  onVideoRemove: () => void;
  onDurationCalculated?: (duration: number) => void;
}

const StoryVideoUpload: React.FC<StoryVideoUploadProps> = ({
  videoUrl,
  onVideoUpload,
  onVideoRemove,
  onDurationCalculated
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

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="video-url" className="text-base font-medium">
          Video URL (YouTube or Vimeo)
        </Label>
        <div className="flex gap-2 mt-2">
          <Input
            id="video-url"
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
            className="flex-1"
          />
          <Button 
            onClick={handleUrlSubmit}
            disabled={!inputUrl.trim() || isCalculatingDuration}
            size="sm"
          >
            {isCalculatingDuration ? 'Processing...' : 'Add Video'}
          </Button>
        </div>
      </div>

      {videoUrl && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <VideoIcon className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-700">Video URL set</span>
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
