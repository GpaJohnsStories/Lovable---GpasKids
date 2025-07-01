
// Helper function to get all available photos from a story with their alt text
export const getStoryPhotos = (story: any) => {
  if (!story) return [];
  const photos = [];
  if (story.photo_link_1) {
    photos.push({
      url: story.photo_link_1,
      alt: story.photo_alt_1 || `${story.title} - Photo 1`
    });
  }
  if (story.photo_link_2) {
    photos.push({
      url: story.photo_link_2,
      alt: story.photo_alt_2 || `${story.title} - Photo 2`
    });
  }
  if (story.photo_link_3) {
    photos.push({
      url: story.photo_link_3,
      alt: story.photo_alt_3 || `${story.title} - Photo 3`
    });
  }
  return photos;
};
