
import CookieFreeFooter from "@/components/CookieFreeFooter";
import StoriesTable from "@/components/admin/StoriesTable";

const Library = () => {
  const handleEditStory = (story: any) => {
    // For now, just log the story - you can implement editing later
    console.log('Edit story:', story);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <main className="container mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-800 mb-4" style={{ fontFamily: "'Kalam', 'Caveat', cursive, sans-serif" }}>
            Story Library
          </h1>
        </div>
        
        <div className="mb-8">
          <StoriesTable onEditStory={handleEditStory} showActions={false} />
        </div>
      </main>
      <CookieFreeFooter />
    </div>
  );
};

export default Library;
