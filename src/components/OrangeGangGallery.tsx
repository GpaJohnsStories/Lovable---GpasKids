import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { AspectRatio } from './ui/aspect-ratio';
import LoadingSpinner from './LoadingSpinner';
import { Database } from '@/integrations/supabase/types';

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
  console.log('🖼️ OrangeGangGallery component rendering...');
  
  // Helper photos (4 fixed slots)
  const helperPhotos = [
    { id: 'helper-1', name: 'Helper 1', src: '/placeholder.svg', caption: 'Helper coming soon!' },
    { id: 'helper-2', name: 'Helper 2', src: '/placeholder.svg', caption: 'Helper coming soon!' },
    { id: 'helper-3', name: 'Helper 3', src: '/placeholder.svg', caption: 'Helper coming soon!' },
    { id: 'helper-4', name: 'Helper 4', src: '/placeholder.svg', caption: 'Helper coming soon!' },
  ];
  
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

  const getTooltipText = (photo: OrangeGangPhoto) => {
    const displayName = photo.display_name;
    const caption = photo.attachment_caption || 'Orange Shirt Gang Photo';
    const date = new Date(photo.created_at).toLocaleDateString();
    
    return `${caption}\n\nShared by: ${displayName}\nDate: ${date}`;
  };

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
        {/* Featured Original Orange Shirt Gang Photo */}
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-amber-800 mb-4">
            The Orange Shirt Gang
          </h2>
          
          <div className="flex justify-center">
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 rounded-2xl shadow-2xl">
                <div className="p-2 bg-gradient-to-br from-amber-300 to-yellow-300 rounded-xl">
                  <img
                    src="/lovable-uploads/fc32fa89-9e7a-4e53-851b-68cfbc3cbb8f.png"
                    alt="Original Orange Shirt Gang - Six children wearing bright orange t-shirts"
                    className="w-96 h-auto rounded-lg shadow-lg"
                    onLoad={() => console.log('✅ Original Orange Shirt Gang photo loaded successfully')}
                    onError={(e) => {
                      console.error('❌ Failed to load Original Orange Shirt Gang photo:', e);
                      console.log('Image src:', e.currentTarget.src);
                    }}
                  />
                </div>
              </div>
              {/* Decorative corner elements */}
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full shadow-lg"></div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full shadow-lg"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full shadow-lg"></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full shadow-lg"></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-amber-900 tracking-wide">
              Original Orange Shirt Gang
            </h3>
            <p className="text-amber-700 italic">
              The founding members who started it all!
            </p>
          </div>
        </div>

        {/* Helpers Section */}
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-semibold text-amber-800">
            Grandpa's Helpers
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {helperPhotos.map((helper) => (
              <Tooltip key={helper.id}>
                <TooltipTrigger asChild>
                  <div className="group cursor-pointer">
                    <AspectRatio ratio={2/3} className="overflow-hidden rounded-lg shadow-md border-3 border-amber-400 hover:border-amber-500 transition-all duration-300 bg-amber-50">
                      <img
                        src={helper.src}
                        alt={`${helper.name} - Orange Shirt Gang Helper`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </AspectRatio>
                    <div className="mt-3 text-center">
                      <p className="text-sm font-medium text-amber-800">{helper.name}</p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="text-center">
                    <p className="font-medium">{helper.caption}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* User submitted photos section */}
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-semibold text-amber-800">
            New Members Gallery
          </h3>
          <p className="text-amber-700 max-w-2xl mx-auto">
            Here are photos from friends who've joined 
            Grandpa's Orange Shirt Gang by sharing their orange shirt pictures.
          </p>
          
          {(!photos || photos.length === 0) ? (
            <div className="text-center py-12 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-amber-700 font-medium text-lg">No photos yet!</p>
              <p className="text-amber-600 mt-2">
                Be the first to share a photo of yourself in an orange shirt!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {photos.map((photo) => (
                <Tooltip key={photo.id}>
                  <TooltipTrigger asChild>
                    <div className="group cursor-pointer">
                      <AspectRatio ratio={2/3} className="overflow-hidden rounded-lg shadow-md border-3 border-amber-400 hover:border-amber-500 transition-all duration-300 bg-amber-50">
                        <img
                          src={getPhotoUrl(photo.attachment_path!)}
                          alt={photo.attachment_caption || 'Orange Shirt Gang Photo'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </AspectRatio>
                      <div className="mt-3 text-center">
                        <p className="text-sm font-medium text-amber-800">
                          {getDisplayName(photo)}
                        </p>
                        <p className="text-xs text-amber-600 mt-1">
                          {new Date(photo.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
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