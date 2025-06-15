
interface StoryPhotosGalleryProps {
  photos: string[];
  storyTitle: string;
}

const StoryPhotosGallery = ({ photos, storyTitle }: StoryPhotosGalleryProps) => {
  if (photos.length === 0) return null;

  return (
    <div className="mb-8">
      <div className={`grid gap-4 ${
        photos.length === 1 ? 'grid-cols-1 justify-items-center' :
        photos.length === 2 ? 'grid-cols-2' :
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      }`}>
        {photos.map((photo, index) => (
          <div key={index} className="overflow-hidden rounded-lg border border-orange-200 shadow-sm">
            <img
              src={photo}
              alt={`${storyTitle} - Photo ${index + 1}`}
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryPhotosGallery;
