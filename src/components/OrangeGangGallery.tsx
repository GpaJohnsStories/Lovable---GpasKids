import React, { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { AspectRatio } from './ui/aspect-ratio';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import { getStoryPhotos } from '@/utils/storyUtils';
import IsolatedStoryRenderer from '@/components/story/IsolatedStoryRenderer';

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
              <h3 className="text-xl font-bold text-amber-900 tracking-wide font-fun">
                Original Orange Shirt Gang
              </h3>
              <p className="text-lg text-amber-700 italic mt-1 font-fun">
                The Kids Who Started It All
              </p>
            </div>
            
            {/* 3. Webtext Content */}
            {webtext && webtext.content && (
              <div className="story-content text-amber-800 text-base leading-relaxed">
                <IsolatedStoryRenderer 
                  content={webtext.content}
                  category="WebText"
                  fontSize={16}
                  showHeaderPreview={false}
                />
              </div>
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
                          <p className="text-lg font-medium text-amber-800 font-fun">{helper.name}</p>
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

        {/* New Members Gallery - Static message */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-8 text-center">
          <div className="mb-4">
            <div className="text-6xl mb-4">🍊</div>
            <h3 className="text-xl font-bold text-orange-800 mb-3">New Members Gallery Coming Soon!</h3>
            <p className="text-orange-700 leading-relaxed">
              We're preparing a special photo gallery to showcase our amazing Orange Gang members. 
              Check back soon to see all the wonderful faces in our community!
            </p>
          </div>
          <div className="mt-6 p-4 bg-white/60 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-600 font-medium">
              📸 Photos will be carefully curated and uploaded by our team
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default OrangeGangGallery;