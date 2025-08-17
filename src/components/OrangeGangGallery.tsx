import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import LoadingSpinner from './LoadingSpinner';
import { Database } from '@/integrations/supabase/types';

type Comment = Database['public']['Tables']['comments']['Row'];

interface PhotoComment extends Comment {
  nickname?: string;
}

const OrangeGangGallery = () => {
  const { data: photos, isLoading, error } = useQuery<PhotoComment[]>({
    queryKey: ['orange-gang-photos'],
    queryFn: async () => {
      // Get approved comments with photo attachments
      const { data: comments, error } = await supabase
        .from('comments')
        .select('*')
        .eq('status', 'approved')
        .eq('attachment_bucket', 'orange-gang')
        .not('attachment_path', 'is', null)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch photos: ${error.message}`);
      }

      // Get nicknames for each comment
      const commentsWithNicknames = await Promise.all(
        (comments || []).map(async (comment) => {
          try {
            const { data: nickname } = await supabase
              .rpc('get_nickname_by_personal_id', { 
                personal_id: comment.personal_id 
              });
            
            return {
              ...comment,
              nickname: nickname || undefined
            };
          } catch (error) {
            console.warn('Failed to get nickname for comment:', comment.id);
            return comment;
          }
        })
      );

      return commentsWithNicknames;
    },
  });

  const getPhotoUrl = (attachmentPath: string) => {
    const { data } = supabase.storage
      .from('orange-gang')
      .getPublicUrl(attachmentPath);
    return data.publicUrl;
  };

  const getDisplayName = (comment: PhotoComment) => {
    if (comment.nickname) {
      return comment.nickname;
    }
    // Mask PID for privacy: show first 2 and last 1 characters
    const pid = comment.personal_id;
    return `${pid.substring(0, 2)}***${pid.substring(5)}`;
  };

  const getTooltipText = (comment: PhotoComment) => {
    const displayName = getDisplayName(comment);
    const caption = comment.attachment_caption || comment.subject;
    const date = new Date(comment.created_at).toLocaleDateString();
    
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

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-12 bg-amber-50 rounded-lg border border-amber-200">
        <p className="text-amber-700 font-medium text-lg">No photos yet!</p>
        <p className="text-amber-600 mt-2">
          Be the first to share a photo of yourself in an orange shirt!
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-amber-800 mb-4">
            The Orange Shirt Gang
          </h2>
          <p className="text-amber-700 max-w-2xl mx-auto">
            Welcome to our special club! Here are photos from friends who've joined 
            Grandpa's Orange Shirt Gang by sharing their orange shirt pictures.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <Tooltip key={photo.id}>
              <TooltipTrigger asChild>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg shadow-md border-3 border-amber-400 hover:border-amber-500 transition-all duration-300 bg-amber-50">
                    <img
                      src={getPhotoUrl(photo.attachment_path!)}
                      alt={photo.attachment_caption || photo.subject}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
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
                  <p className="font-medium">{photo.attachment_caption || photo.subject}</p>
                  <p className="text-sm opacity-90">Shared by: {getDisplayName(photo)}</p>
                  <p className="text-xs opacity-75">
                    {new Date(photo.created_at).toLocaleDateString()}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
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