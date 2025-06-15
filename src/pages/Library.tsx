
import CookieFreeFooter from "@/components/CookieFreeFooter";

const Library = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <main className="container mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-800 mb-4" style={{ fontFamily: "'Kalam', 'Caveat', cursive, sans-serif" }}>
            Story Library
          </h1>
        </div>
      </main>
      <CookieFreeFooter />
    </div>
  );
};

export default Library;
