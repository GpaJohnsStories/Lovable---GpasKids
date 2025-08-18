import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { AspectRatio } from './ui/aspect-ratio';
import LoadingSpinner from './LoadingSpinner';
import { Database } from '@/integrations/supabase/types';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import { getStoryPhotos } from '@/utils/storyUtils';
import { createSafeHtml } from '@/utils/xssProtection';

type Comment = Database['public']['Tables']['comments']['Row'];

type OrangeGangPhoto = {
  id: string;
  attachment_path: string;
  attachment_caption: string | null;
  created_at: string;
  display_name: string;
};

interface PhotoComment extends Comment {
  nickname?: string;
}

const OrangeGangGallery = () => {
  // State for SYS-OSP webtext content
  const [webtext, setWebtext] = useState<any>(null);
  const [originalPhoto, setOriginalPhoto] = useState<string>('/lovable-uploads/fc32fa89-9e7a-4e53-851b-68cfbc3cbb8f.png');
  const { lookupStoryByCode } = useStoryCodeLookup();
  
  // Helper photos (4 fixed slots) - reduced size
  const helperPhotos = [
    { id: 'helper-1', name: 'Buddy', src: '/lovable-uploads/bfdc1312-b16c-4fad-b3b7-9c7d55dab74f.png', caption: 'Buddy - Kindness is my superpower!' },
    { id: 'helper-2', name: 'Fluffy', src: '/lovable-uploads/ff27a5e0-bf85-4c9b-a9a6-f9d012e46444.png', caption: 'Fluffy - Super Firewall Furball on duty!' },
    { id: 'helper-3', name: 'Max', src: '/lovable-uploads/1729cdc7-f3de-4393-9987-3dbfacafcdfa.png', caption: 'Max - Maximum Security Force!' },
    { id: 'helper-4', name: 'Sparky', src: '/lovable-uploads/80d8e834-9f1a-483a-ae7d-cec1be608287.png', caption: 'Sparky - I throw fiery softballs!' },
  ];
  
  // Fetch SYS-OSP webtext content
  useEffect(() => {
    const fetchWebtext = async () => {
      const result = await lookupStoryByCode('SYS-OSP', true);
      if (result.found && result.story) {
        setWebtext(result.story);
        const photos = getStoryPhotos(result.story);
        if (photos.length > 0) {
          setOriginalPhoto(photos[0].url);
        }
      }
    };
    fetchWebtext();
  }, [lookupStoryByCode]);

  
  const { data: photos, isLoading, error } = useQuery<OrangeGangPhoto[]>({
    queryKey: ['orange-gang-photos'],
    queryFn: async () => {
      // Use secure RPC to get public orange gang photos
      const { data, error } = await supabase
        .rpc('get_public_orange_gang_photos');

      if (error) {
        throw new Error(`Failed to fetch photos: ${error.message}`);
      }

      return data || [];
    },
  });

  const getPhotoUrl = (attachmentPath: string) => {
    const { data } = supabase.storage
      .from('orange-gang')
      .getPublicUrl(attachmentPath);
    return data.publicUrl;
  };

  const getDisplayName = (photo: OrangeGangPhoto) => {
    return photo.display_name;
  };

  // Sort photos newest first
  const sortedPhotos = photos ? [...photos].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ) : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
        <span className="ml-3 text-amber-700">Loading Orange Shirt Gang photos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-medium">Failed to load photos</p>
        <p className="text-sm text-gray-600 mt-2">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Custom Webtext Box for SYS-OSP */}
        <div className="relative bg-amber-50 rounded-lg border-4 border-amber-600 p-4 sm:p-6">
          {/* Main Content */}
          <div className="space-y-4">
            {/* 1. Original Photo at Top */}
            <div className="text-center">
              <div className="flex justify-center">
                <div className="w-full max-w-sm">
                  <img
                    src={originalPhoto}
                    alt="Original Orange Shirt Gang - Six children wearing bright orange t-shirts"
                    className="w-full h-auto object-contain border-4 border-amber-600 rounded bg-amber-50"
                  />
                </div>
              </div>
            </div>
            
            {/* 2. Title Below Photo */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-amber-900 tracking-wide font-playful">
                Original Orange Shirt Gang
              </h3>
              <p className="text-lg text-amber-700 italic mt-1 font-playful">
                The Kids Who Started It All
              </p>
            </div>
            
            {/* 3. Webtext Content */}
            {webtext && webtext.content && (
              <div 
                className="story-content text-amber-800 text-base leading-relaxed"
                dangerouslySetInnerHTML={createSafeHtml(webtext.content)}
              />
            )}
            
            {/* 4. Grandpa's Team inside the webtext box */}
            <div className="text-center space-y-4">
              <h4 className="text-xl font-semibold text-amber-800">
                Grandpa's Team
              </h4>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {helperPhotos.map((helper) => (
                  <Tooltip key={helper.id}>
                    <TooltipTrigger asChild>
                      <div className="cursor-pointer">
                        <div className="w-28 sm:w-32 md:w-36 mx-auto">
                          <AspectRatio ratio={2/3} className="overflow-hidden rounded border-4 border-amber-600 bg-amber-50">
                            <img
                              src={helper.src}
                              alt={`${helper.name} - Orange Shirt Gang Helper`}
                              className="w-full h-full object-cover"
                            />
                          </AspectRatio>
                        </div>
                        <div className="mt-2 text-center">
                          <p className="text-lg font-medium text-amber-800">{helper.name}</p>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <div className="text-center">
                        <p className="font-medium">{helper.caption}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
          
          {/* 5. Bottom-right code badge */}
          <div className="absolute bottom-2 right-2">
            <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded border border-amber-300">
              SYS-OSP
            </span>
          </div>
        </div>

        {/* New Members Gallery (user-submitted photos) */}
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-semibold text-amber-800">
            New Members Gallery
          </h3>
          <p className="text-amber-700 max-w-2xl mx-auto">
            Here are photos from friends who've joined 
            Grandpa's Orange Shirt Gang by sharing their orange shirt pictures.
          </p>
          
          {(!sortedPhotos || sortedPhotos.length === 0) ? (
            <div className="text-center py-12 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-amber-700 font-medium text-lg">No photos yet!</p>
              <p className="text-amber-600 mt-2">
                Be the first to share a photo of yourself in an orange shirt!
              </p>
            </div>
          ) : (
            <div className={`grid ${sortedPhotos.length > 24 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}`}>
              {sortedPhotos.map((photo) => (
                <Tooltip key={photo.id}>
                  <TooltipTrigger asChild>
                    <div className="cursor-pointer">
                      <AspectRatio ratio={3/2} className="overflow-hidden rounded border-4 border-amber-600 bg-amber-50">
                        <img
                          src={getPhotoUrl(photo.attachment_path!)}
                          alt={photo.attachment_caption || 'Orange Shirt Gang Photo'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </AspectRatio>
                      <div className="mt-2 text-center">
                        <p className="text-sm font-medium text-amber-800">
                          {getDisplayName(photo)}
                        </p>
                        <p className="text-xs text-amber-600 mt-1">
                          {new Date(photo.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <div className="text-center space-y-1">
                      <p className="font-medium">{photo.attachment_caption || 'Orange Shirt Gang Photo'}</p>
                      <p className="text-sm opacity-90">Shared by: {getDisplayName(photo)}</p>
                      <p className="text-xs opacity-75">
                        {new Date(photo.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}
        </div>

        <div className="text-center text-sm text-amber-600 bg-amber-50 rounded-lg p-4 border border-amber-200">
          <p>
            Want to join the Orange Shirt Gang? Share a photo of yourself wearing 
            an orange shirt through our comment form and it will appear here once approved!
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default OrangeGangGallery;