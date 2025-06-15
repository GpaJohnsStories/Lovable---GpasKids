
import CookieFreeFooter from "@/components/CookieFreeFooter";
import StoriesTable from "@/components/admin/StoriesTable";
import WelcomeHeader from "@/components/WelcomeHeader";

const Library = () => {
  const handleEditStory = (story: any) => {
    // For now, just log the story - you can implement editing later
    console.log('Edit story:', story);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <WelcomeHeader />
      <main className="container mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-800 mb-4" style={{ fontFamily: "'Kalam', 'Caveat', cursive, sans-serif" }}>
            Library of Stories
          </h1>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <div style={{ 
            color: 'black !important', 
            fontSize: '12px !important', 
            fontStyle: 'italic !important', 
            fontFamily: 'system-ui, -apple-system, sans-serif !important',
            lineHeight: '1.4 !important'
          }}>
            <div style={{ marginBottom: '12px', color: 'black !important', fontSize: '12px !important', fontStyle: 'italic !important', fontFamily: 'system-ui, -apple-system, sans-serif !important' }}>
              Click on any column heading to sort the library by that column. The first click will always sort down and the next click will sort up.
            </div>
            <div style={{ color: 'black !important', fontSize: '12px !important', fontStyle: 'italic !important', fontFamily: 'system-ui, -apple-system, sans-serif !important' }}>
              As more stories are loaded, you may want to keep a note on your device or even use pencil and paper to record the Story Code so you can find it easily in the future.
            </div>
          </div>
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
