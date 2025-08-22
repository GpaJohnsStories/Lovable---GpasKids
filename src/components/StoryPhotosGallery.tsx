
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Photo {
  url: string;
  alt: string;
}

interface StoryPhotosGalleryProps {
  photos: Photo[];
  storyTitle: string;
}

const StoryPhotosGallery = ({ photos, storyTitle }: StoryPhotosGalleryProps) => {
  if (photos.length === 0) return null;

  return (
    <TooltipProvider>
      <div className="mb-8">
        <div className={`grid gap-4 ${
          photos.length === 1 ? 'grid-cols-1 justify-items-center' :
          photos.length === 2 ? 'grid-cols-2' :
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}>
          {photos.map((photo, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div className={`cursor-pointer ${
                  photos.length === 3 ? (
                    index === 0 ? 'justify-self-start' :
                    index === 1 ? 'justify-self-center lg:justify-self-center md:justify-self-end' :
                    'md:col-span-2 md:justify-self-center lg:col-span-1 lg:justify-self-end'
                  ) : ''
                }`}>
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    className="max-h-48 object-contain transition-transform duration-300 rounded-lg shadow-sm border-2 border-amber-border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-base font-serif font-semibold">{photo.alt}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default StoryPhotosGallery;
