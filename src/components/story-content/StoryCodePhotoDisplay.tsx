import React from 'react';
import { getStoryPhotos } from '@/utils/storyUtils';

interface StoryCodePhotoDisplayProps {
  story: any;
}

export const StoryCodePhotoDisplay: React.FC<StoryCodePhotoDisplayProps> = ({ story }) => {
  const photos = getStoryPhotos(story);

  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <div className="my-4">
      {photos.length === 1 ? (
        // Single photo - centered
        <div className="flex justify-center">
          <div className="max-w-md">
            <img
              src={photos[0].url}
              alt={photos[0].alt}
              title={photos[0].alt}
              className="h-auto rounded-lg shadow-lg border-4 border-white object-contain max-h-64"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      ) : (
        // Multiple photos - grid layout
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className={`${
              photos.length === 3 ? (
                index === 0 ? 'justify-self-start' :
                index === 1 ? 'justify-self-center lg:justify-self-center md:justify-self-end' :
                'md:col-span-2 md:justify-self-center lg:col-span-1 lg:justify-self-end'
              ) : ''
            }`}>
              <img
                src={photo.url}
                alt={photo.alt}
                title={photo.alt}
                className="h-32 object-contain transition-transform duration-300 rounded-lg shadow-lg border-4 border-white"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};