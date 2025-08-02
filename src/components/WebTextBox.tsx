import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import { supabase } from '@/integrations/supabase/client';
import { getStoryPhotos } from '@/utils/storyUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';

interface WebTextBoxProps {
  webtextCode: string;
  icon: string;
  borderColor: string;
  backgroundColor: string;
  title: string;
}

export const WebTextBox: React.FC<WebTextBoxProps> = ({
  webtextCode,
  icon,
  borderColor,
  backgroundColor,
  title
}) => {
  const { lookupStoryByCode } = useStoryCodeLookup();
  const [webtext, setWebtext] = useState<any>(null);
  const [iconUrl, setIconUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  // Audio control states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [audioGenerated, setAudioGenerated] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(1); // Always 100%
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getContent = () => {
    if (loading) return "Loading...";
    if (!webtext) return "Coming Soon";
    return webtext.content || webtext.excerpt || "No content available";
  };

  // Audio cleanup effect
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }
    };
  }, [currentAudio]);

  // Apply volume and playback rate changes
  useEffect(() => {
    if (currentAudio) {
      currentAudio.volume = volume;
      currentAudio.playbackRate = playbackRate;
    }
  }, [currentAudio, volume, playbackRate]);

  // Audio control functions
  const canPlayAudio = () => {
    return !!(webtext?.audio_url || getContent());
  };

  const handlePlay = useCallback(async () => {
    if (isPaused && currentAudio) {
      // Resume paused audio
      setIsPaused(false);
      setIsPlaying(true);
      currentAudio.play();
      return;
    }

    if (webtext?.audio_url) {
      // Play existing audio URL
      const audio = new Audio(webtext.audio_url);
      audio.volume = volume;
      audio.playbackRate = playbackRate;
      
      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentAudio(null);
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentAudio(null);
        toast({
          title: "Audio Error",
          description: "Failed to play the audio file",
          variant: "destructive",
        });
      };

      setCurrentAudio(audio);
      setIsPlaying(true);
      setIsPaused(false);
      audio.play();
    } else if (getContent() && !audioGenerated) {
      // Generate audio via text-to-speech
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('text-to-speech', {
          body: {
            text: getContent(),
            voice: 'alloy',
            title: webtext?.title || title,
            author: webtext?.author
          }
        });

        if (error) throw error;

        if (data?.audioUrl) {
          const audio = new Audio(data.audioUrl);
          audio.volume = volume;
          audio.playbackRate = playbackRate;
          
          audio.onended = () => {
            setIsPlaying(false);
            setIsPaused(false);
            setCurrentAudio(null);
          };
          
          audio.onerror = () => {
            setIsPlaying(false);
            setIsPaused(false);
            setCurrentAudio(null);
            toast({
              title: "Audio Error",
              description: "Failed to play the generated audio",
              variant: "destructive",
            });
          };

          setCurrentAudio(audio);
          setIsPlaying(true);
          setIsPaused(false);
          setAudioGenerated(true);
          audio.play();
        }
      } catch (error) {
        console.error('Error generating audio:', error);
        toast({
          title: "Audio Generation Error",
          description: "Failed to generate audio for this content",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [webtext?.audio_url, getContent, volume, playbackRate, isPaused, currentAudio, audioGenerated, webtext?.title, title, webtext?.author]);

  const handlePause = useCallback(() => {
    if (currentAudio && isPlaying) {
      currentAudio.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  }, [currentAudio, isPlaying]);

  const handleStop = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentAudio(null);
    }
  }, [currentAudio]);

  const handleStartOver = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentAudio(null);
    }
    // Restart playback
    setTimeout(() => handlePlay(), 100);
  }, [currentAudio, handlePlay]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
  }, []);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setPlaybackRate(newSpeed);
  }, []);

  // Audio controls removed - auto-play at 100% volume

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch webtext content
      const webtextData = await lookupStoryByCode(webtextCode, true);
      setWebtext(webtextData);
      
      // Fetch icon from icon library
      try {
        const { data: iconData, error } = await supabase
          .from('icon_library')
          .select('file_path')
          .eq('icon_code', icon)
          .maybeSingle();
        
        if (!error && iconData) {
          // Construct the full URL for the icon from the storage bucket
          const { data: { publicUrl } } = supabase.storage
            .from('icons')
            .getPublicUrl(iconData.file_path);
          setIconUrl(publicUrl);
        }
      } catch (error) {
        console.error('Error fetching icon:', error);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [webtextCode, icon, lookupStoryByCode]);


  const isSysWel = webtextCode === "SYS-WEL";
  const photos = webtext ? getStoryPhotos(webtext) : [];
  const mainPhoto = photos[0];

  // Special styling for SYS-WEL content
  if (isSysWel) {
    return (
      <div className="bg-blue-100 border-4 border-blue-500 rounded-lg p-4 sm:p-6 mb-8 overflow-hidden">
        {/* Top section with photo and title */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Photo in left column on tablets+ */}
          {mainPhoto && (
            <div className="w-fit flex-shrink-0">
              <div className="group relative">
                <img
                  src={mainPhoto.url}
                  alt={mainPhoto.alt}
                  className="w-auto h-auto max-h-48 md:max-h-64 lg:max-h-80 object-contain rounded-lg border-2 border-blue-500 shadow-lg cursor-pointer transition-transform hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
                <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {mainPhoto.alt}
                </div>
              </div>
            </div>
          )}

          {/* Title and content section */}
          <div className="flex-1 min-w-0 flex flex-col">

            {/* Title section below audio controls */}
            <div className="mb-4">
              <div className="flex items-start gap-3 justify-center">
                {iconUrl && (
                  <img 
                    src={iconUrl} 
                    alt={icon}
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain border-2 border-blue-500 rounded mt-1 flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-handwritten font-bold text-blue-800 leading-tight break-words text-center">
                  {webtext?.title || "Welcome to Grandpa John's Story Corner!"}
                </h1>
              </div>
            </div>

            {/* Content below title */}
            <div className="flex-1 min-w-0">
              <div 
                className="font-handwritten text-blue-800 leading-relaxed break-words [&>h3]:text-xl [&>h3]:sm:text-2xl [&>h3]:font-bold [&>h3]:mb-4 [&>h3]:break-words [&>p]:text-base [&>p]:sm:text-lg [&>p]:mb-3 [&>p]:break-words"
                dangerouslySetInnerHTML={{ __html: getContent() }}
              />
            </div>
          </div>
        </div>

        {/* Bottom right: Webtext code */}
        <div className="flex justify-end">
          <div className="bg-blue-200/70 rounded px-3 py-1 text-sm font-mono text-blue-700 border border-blue-400">
            {webtextCode}
          </div>
        </div>
      </div>
    );
  }

  // Generic styling for other webtext content
  return (
    <div 
      className={`rounded-lg border-4 p-6 ${backgroundColor}`}
      style={{ borderColor }}
    >
      {/* Top Row */}
      <div className="flex justify-between items-start mb-4">
        {/* Left: Icon and Title */}
        <div className="flex items-center gap-3">
          {iconUrl && (
            <img 
              src={iconUrl} 
              alt={icon}
              className="w-8 h-8 object-contain border rounded"
              style={{ borderColor }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <h3 className="text-xl font-bold text-amber-800">
            {webtext?.title || title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <div 
          className="text-amber-900 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: getContent() }}
        />
      </div>

      {/* Bottom Right: Webtext Code */}
      <div className="flex justify-end">
        <div className="bg-white/70 rounded px-3 py-1 text-sm font-mono text-amber-700 border border-amber-300">
          {webtextCode}
        </div>
      </div>
    </div>
  );
};