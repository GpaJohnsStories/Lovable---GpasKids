
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
            textAlign: 'center',
            color: '#000000',
            fontSize: '18px',
            fontStyle: 'italic',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            lineHeight: '1.6',
            fontWeight: 'normal'
          }}>
            <div style={{ marginBottom: '16px' }}>
              Click on any column heading to sort the library by that column.<br />The first click will always sort down and the next click will sort up.
            </div>
            <div>
              As more stories are loaded, you may want to keep a note on your device or even use<br />pencil and paper to record the Story Code so you can find it easily in the future.
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
