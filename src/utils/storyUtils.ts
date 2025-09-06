
// Helper function to build cache-busted URL
export const buildCacheBustedUrl = (url: string, version: string): string => {
  if (!url) return url;
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${version}`;
};

// Helper function to get asset version from story
export const getAssetVersionFromStory = (story: any): string => {
  if (!story?.updated_at) return Date.now().toString();
  
  // Convert ISO timestamp to a simple string for versioning
  return new Date(story.updated_at).getTime().toString();
};

// Helper function to get all available photos from a story with their alt text
export const getStoryPhotos = (story: any) => {
  if (!story) return [];
  const version = getAssetVersionFromStory(story);
  const photos = [];
  
  if (story.photo_link_1) {
    photos.push({
      url: buildCacheBustedUrl(story.photo_link_1, version),
      alt: story.photo_alt_1 || `${story.title} - Photo 1`
    });
  }
  if (story.photo_link_2) {
    photos.push({
      url: buildCacheBustedUrl(story.photo_link_2, version),
      alt: story.photo_alt_2 || `${story.title} - Photo 2`
    });
  }
  if (story.photo_link_3) {
    photos.push({
      url: buildCacheBustedUrl(story.photo_link_3, version),
      alt: story.photo_alt_3 || `${story.title} - Photo 3`
    });
  }
  return photos;
};
