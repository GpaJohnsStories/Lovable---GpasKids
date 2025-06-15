
// Helper function to get all available photos from a story
export const getStoryPhotos = (story: any) => {
  if (!story) return [];
  const photos = [];
  if (story.photo_link_1) photos.push(story.photo_link_1);
  if (story.photo_link_2) photos.push(story.photo_link_2);
  if (story.photo_link_3) photos.push(story.photo_link_3);
  return photos;
};
